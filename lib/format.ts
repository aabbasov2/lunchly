export function formatPrice(value: number): string {
  return `€${value.toFixed(2)}`;
}

export function formatCalories(cal: number): string {
  return `${cal} kcal`;
}

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
