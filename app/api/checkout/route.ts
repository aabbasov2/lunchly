import { NextResponse } from "next/server";
import Stripe from "stripe";
import { describeItems, fetchInventory } from "@/lib/sheets";
import { meals } from "@/data/meals";

interface OrderItem {
  id: string;
  name: string;
  side: string;
  salad: string;
  quantity: number;
  unitPrice: number;
}

interface CheckoutPayload {
  name: string;
  phone: string;
  company: string;
  notes?: string;
  total: number;
  deliveryDate?: string;
  items: OrderItem[];
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY is not configured" },
      { status: 500 },
    );
  }

  let payload: CheckoutPayload;
  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = payload?.name?.trim();
  const phone = payload?.phone?.trim();
  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const deliveryDate = (payload.deliveryDate ?? "").slice(0, 32);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
    return NextResponse.json({ error: "Missing or invalid deliveryDate" }, { status: 400 });
  }

  // Aggregate quantities per meal id for inventory check + items_json metadata.
  const perMeal = new Map<string, number>();
  for (const it of payload.items) {
    if (!it.id) {
      return NextResponse.json({ error: "Item id missing" }, { status: 400 });
    }
    perMeal.set(it.id, (perMeal.get(it.id) ?? 0) + it.quantity);
  }

  // Server-authoritative inventory check: refuse if any capped meal would go over.
  try {
    const { sold } = await fetchInventory(deliveryDate);
    for (const [mealId, qty] of perMeal) {
      const meal = meals.find((m) => m.id === mealId);
      if (!meal || meal.dailyLimit === undefined) continue;
      const remaining = meal.dailyLimit - (sold[mealId] ?? 0);
      if (qty > remaining) {
        return NextResponse.json(
          { error: "Sold out", mealId, mealName: meal.name, remaining: Math.max(0, remaining) },
          { status: 409 },
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Inventory check failed: ${message}` }, { status: 502 });
  }

  const stripe = new Stripe(secret);

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const orderedAt = new Date().toISOString();
  const orderDescription = describeItems(payload.items);
  const itemsJson = JSON.stringify(
    Array.from(perMeal.entries()).map(([id, qty]) => ({ id, qty })),
  );

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = payload.items.map((it) => {
    const combo = [it.side, it.salad].filter(Boolean).join(" · ");
    return {
      quantity: it.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(it.unitPrice * 100),
        product_data: {
          name: it.name,
          ...(combo ? { description: combo } : {}),
        },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancelled`,
      metadata: {
        orderedAt,
        name,
        phone,
        company: payload.company ?? "",
        notes: (payload.notes ?? "").slice(0, 500),
        order: orderDescription.slice(0, 500),
        total: String(payload.total),
        deliveryDate,
        itemsJson: itemsJson.slice(0, 500),
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 502 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 502 });
  }
}
