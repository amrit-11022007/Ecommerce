import { CardSkeleton } from "./Card";

export function ProductGridSkeleton() {
  return (
    <section className="mx-auto mt-16 max-w-6xl">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-300" />
        <div className="h-8 w-56 animate-pulse rounded bg-slate-300" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
