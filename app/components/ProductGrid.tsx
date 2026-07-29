import { Card } from "@/app/components/Card";

import type { ProductGridProps } from "../types/componentDefinitions";

export function ProductGrid({
  eyebrow,
  heading,
  products,
  isAuthenticated,
}: ProductGridProps) {
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
        <button className="hidden sm:inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:border-[#6C63FF] hover:text-[#6C63FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 transition-all duration-300 group">
          View All
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 12).map((product) => (
          <Card
            key={product.id}
            product={product}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </section>
  );
}
