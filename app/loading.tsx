import { ProductGridSkeleton } from "./skeletons/ProductGrid";

export default function Loading() {
  return (
    <div className="neu-page min-h-screen px-6 py-10 md:px-12 lg:px-20">
      {/* Hero skeleton */}
      <section className="mx-auto mt-12 max-w-6xl">
        <div className="neu-raised grid animate-pulse gap-10 p-8 md:grid-cols-2 md:p-14">
          <div className="flex flex-col justify-center gap-6">
            <div className="h-7 w-32 rounded bg-slate-300" />
            <div className="h-24 w-full rounded bg-slate-300" />
            <div className="h-12 w-full max-w-md rounded bg-slate-300" />
            <div className="h-12 w-40 rounded bg-slate-300" />
          </div>

          <div className="aspect-square rounded-xl bg-slate-300 md:aspect-6/5" />
        </div>
      </section>

      <ProductGridSkeleton />
    </div>
  );
}
