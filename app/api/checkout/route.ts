import { NextResponse } from "next/server";
import Stripe from "stripe";
import { describeItems } from "@/lib/sheets";

interface OrderItem {
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

  const stripe = new Stripe(secret);

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const orderedAt = new Date().toISOString();
  const orderDescription = describeItems(payload.items);

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
        order: orderDescription,
        total: String(payload.total),
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
