import { NextResponse } from "next/server";
import Stripe from "stripe";
import { appendOrderRow } from "@/lib/sheets";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) {
    return NextResponse.json(
      { error: "Stripe env vars are not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secret);
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, whSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Signature verify failed: ${message}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ ok: true, ignored: "not paid" });
  }

  const md = session.metadata ?? {};
  try {
    await appendOrderRow({
      orderedAt: md.orderedAt || new Date().toISOString(),
      deliveryDate: md.deliveryDate || "",
      name: md.name || "",
      phone: md.phone || "",
      company: md.company || "",
      order: md.order || "",
      notes: md.notes || "",
      total: Number(md.total) || (session.amount_total ?? 0) / 100,
      paid: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
