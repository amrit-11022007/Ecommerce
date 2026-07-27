import { ProductGridSkeleton } from "./skeletons/ProductGrid";

export default function Loading() {
  return (
    <main>
      <section className="container-premium pt-8 pb-4">
        <div className="animate-pulse rounded-[3rem] bg-linear-to-br from-[#F0F8FF] via-white to-[#F8F0FF] border border-gray-100 p-8 md:p-16">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <div className="flex flex-col justify-center gap-7">
              <div className="h-7 w-32 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
              <div className="space-y-4">
                <div className="h-14 w-full rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
                <div className="h-14 w-3/4 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
              </div>
              <div className="space-y-3">
                <div className="h-5 w-full max-w-md rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
                <div className="h-5 w-2/3 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
              </div>
              <div className="h-14 w-44 rounded-full bg-linear-to-r from-gray-200 to-gray-100" />
            </div>

            <div className="flex items-center justify-center">
              <div className="aspect-square w-full max-w-lg rounded-[2.5rem] bg-linear-to-br from-gray-200 to-gray-100" />
            </div>
          </div>
        </div>
      </section>

      <ProductGridSkeleton />
    </main>
  );
}
