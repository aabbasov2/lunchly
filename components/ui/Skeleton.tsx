import { cn } from "@/lib/format";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-[linear-gradient(90deg,rgba(0,0,0,0.04)_0px,rgba(0,0,0,0.08)_40px,rgba(0,0,0,0.04)_80px)] bg-[length:400px_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.08)_40px,rgba(255,255,255,0.04)_80px)]",
        className,
      )}
    />
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="rounded-3xl bg-surface-light p-3 shadow-soft dark:bg-elevated-dark">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <div className="mt-4 space-y-2 p-1">
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-5/6 rounded-md" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
