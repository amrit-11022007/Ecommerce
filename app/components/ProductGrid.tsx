import type { ProductGridProps } from "../types/componentDefinitions";
import { Card } from "@/app/components/Card";

export function ProductGrid({ eyebrow, heading, products }: ProductGridProps) {
  return (
    <section className="container-premium py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          {eyebrow && (
            <span className="inline-block rounded-full bg-linear-to-r from-[#2874F0]/10 to-[#6C63FF]/10 backdrop-blur-sm border border-[#6C63FF]/20 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF]">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-4 text-4xl font-bold text-[#2D3436] md:text-5xl tracking-tight">
            {heading}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 12).map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>

      {products.length > 12 && (
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#2874F0] to-[#6C63FF] px-8 py-4 text-base font-semibold text-white shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 hover:scale-105 transition-all duration-300">
            Load More Products
            <span>↓</span>
          </button>
        </div>
      )}
    </section>
  );
}
