interface SheetsRow {
  orderedAt: string;
  deliveryDate: string;
  name: string;
  phone: string;
  company: string;
  order: string;
  notes: string;
  total: number;
  paid: boolean;
}

export async function appendOrderRow(row: SheetsRow): Promise<void> {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("SHEETS_WEBHOOK_URL is not configured");

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets webhook responded ${res.status}: ${text}`);
  }
}

export function describeItems(
  items: Array<{ name: string; side: string; salad: string; quantity: number }>,
): string {
  return items
    .map((it) => {
      const combo = [it.side, it.salad].filter(Boolean).join(" · ");
      const suffix = combo ? ` (${combo})` : "";
      const qty = it.quantity > 1 ? ` ×${it.quantity}` : "";
      return `${it.name}${suffix}${qty}`;
    })
    .join("; ");
}
