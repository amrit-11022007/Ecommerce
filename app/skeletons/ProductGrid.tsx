import { CardSkeleton } from "./Card";

export function ProductGridSkeleton() {
  return (
    <section className="container-premium py-16">
      <div className="mb-10 space-y-3">
        <div className="h-5 w-28 animate-pulse rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
        <div className="h-10 w-64 animate-pulse rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
