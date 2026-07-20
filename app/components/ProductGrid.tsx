import type { DisplayProduct } from "@/app/types/definitions";
import { Card } from "@/app/components/Card";
import Button from "@/app/components/Button";

type ProductGridProps = {
  eyebrow: string;
  heading: string;
  products: DisplayProduct[];
  viewAllLabel?: string;
};

export function ProductGrid({
  eyebrow,
  heading,
  products,
  viewAllLabel = "View all",
}: ProductGridProps) {
  return (
    <section className="mx-auto mt-16 max-w-6xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-(--neu-accent)">
            {eyebrow}
          </span>
          <h2 className="mt-1 text-2xl font-semibold md:text-3xl">{heading}</h2>
        </div>
        <Button
          type="button"
          style="hidden px-5 py-2.5 text-sm font-medium text-(--neu-accent) md:block"
          text={viewAllLabel}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
