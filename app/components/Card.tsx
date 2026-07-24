"use client";

import Link from "next/link";
import type { DisplayProduct } from "@/app/types/definitions";
import Button from "@/app/components/Button";
import { Plus, Star } from "lucide-react";

type ProductCardProps = {
  product: DisplayProduct;
};

export function Card({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <article className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1">
        <div className="overflow-hidden rounded-xl border border-white/5">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <div className="aspect-square bg-slate-800 flex justify-center items-center text-white">
              {product.name}
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-orange-400/80">
              {product.brand}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white/90 truncate">
              {product.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400 border border-green-500/20">
            <Star size={14} color="#4ade80" />
            {product.rating}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-white">{product.price}</span>
          <Button
            type="button"
            style="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 transition-all duration-300 hover:bg-orange-500/25 hover:scale-110"
            icon={Plus}
          />
        </div>
      </article>
    </Link>
  );
}
