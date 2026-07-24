import type { ProductGridProps } from "../types/componentDefinitions";
import { Card } from "@/app/components/Card";

export function ProductGrid({ eyebrow, heading, products }: ProductGridProps) {
  return (
    <section className="mx-auto mt-16 max-w-6xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-orange-400">
            {eyebrow}
          </span>
          <h2 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
            {heading}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
