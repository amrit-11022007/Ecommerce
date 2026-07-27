"use client";

import Link from "next/link";
import type { DisplayProduct } from "@/app/types/definitions";
import Button from "@/app/components/Button";
import { Plus, Star, Heart } from "lucide-react";
import { useState } from "react";

type ProductCardProps = {
  product: DisplayProduct;
};

export function Card({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <article className="group relative flex flex-col gap-4 rounded-3xl bg-white border border-gray-100 p-4 transition-all duration-500 hover:shadow-xl hover:shadow-[#6C63FF]/10 hover:-translate-y-2 hover:border-[#6C63FF]/20">
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-110"
      >
        <Heart
          size={18}
          className={`transition-all duration-300 ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      <Link href={`/products/${product.id}`} className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F9FA] p-6">
          <div className="relative aspect-square w-full overflow-hidden transition-transform duration-700 group-hover:scale-110">
            <div className="aspect-square flex justify-center items-center text-gray-400 font-medium text-sm">
              {product.name}
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6C63FF]/70">
              {product.brand}
            </p>
            <h3 className="mt-1.5 text-base font-semibold text-[#2D3436] truncate group-hover:text-[#2874F0] transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-linear-to-r from-[#FF9F43]/10 to-[#FF9F43]/5 px-3 py-1.5">
            <Star size={13} className="fill-[#FF9F43] text-[#FF9F43]" />
            <span className="text-xs font-bold text-[#FF9F43]">
              {product.rating}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[#2D3436] tracking-tight">
              {product.price}
            </span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            className="rounded-full w-11 h-11 p-0 shadow-lg shadow-[#6C63FF]/20 hover:shadow-xl hover:shadow-[#6C63FF]/30 hover:scale-110 transition-all duration-300"
            text=""
          />
        </div>
      </Link>
    </article>
  );
}
