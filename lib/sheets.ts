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
  itemsJson: string;
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

export interface InventoryResponse {
  date: string;
  sold: Record<string, number>;
}

export async function fetchInventory(date: string): Promise<InventoryResponse> {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("SHEETS_WEBHOOK_URL is not configured");
  const url = new URL(webhookUrl);
  url.searchParams.set("date", date);
  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    throw new Error(`Sheets inventory responded ${res.status}`);
  }
  const data = (await res.json()) as { ok?: boolean; date?: string; sold?: Record<string, number>; error?: string };
  if (data.ok === false) {
    throw new Error(data.error ?? "inventory error");
  }
  return { date: data.date ?? date, sold: data.sold ?? {} };
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
