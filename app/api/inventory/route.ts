import { NextResponse } from "next/server";
import { fetchInventory } from "@/lib/sheets";
import { meals } from "@/data/meals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date (YYYY-MM-DD)" }, { status: 400 });
  }
  try {
    const { sold } = await fetchInventory(date);
    const remaining: Record<string, number | null> = {};
    for (const meal of meals) {
      if (meal.dailyLimit === undefined) {
        remaining[meal.id] = null;
      } else {
        remaining[meal.id] = Math.max(0, meal.dailyLimit - (sold[meal.id] ?? 0));
      }
    }
    return NextResponse.json({ date, sold, remaining });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
