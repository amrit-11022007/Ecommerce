import Image from "next/image";
import type { DisplayProduct } from "@/app/types/definitions";
import Button from "@/app/components/Button";
import { placeholderImage, formatPrice } from "@/app/lib/format";
import { Plus, Star } from "lucide-react";

type ProductCardProps = {
  product: DisplayProduct;
};

export function Card({ product }: ProductCardProps) {
  return (
    <article className="neu-card flex flex-col gap-4 p-5">
      <div className="neu-inset">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={placeholderImage(product.name)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-(--neu-text-muted)">
            {product.brand}
          </p>
          <h3 className="text-xl font-semibold">{product.name}</h3>
        </div>
        <div className="neu-inset flex shrink-0 items-center gap-1 px-2.5 py-1 text-xs font-medium">
          <Star size={16} color="#388E3C" />
          {product.rating}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">
          {formatPrice(product.price)}
        </span>
        <Button
          type="button"
          style="flex h-11 w-11 items-center justify-center text-[var(--neu-accent)]"
          icon={Plus}
        />
      </div>
    </article>
  );
}
