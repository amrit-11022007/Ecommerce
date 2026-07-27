"use client";

import Link from "next/link";
import type { DisplayProduct } from "@/app/types/definitions";
import { Plus, Star, Heart, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  product: DisplayProduct;
  isAuthenticated?: boolean;
};

export function Card({ product, isAuthenticated = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToCart) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsAddingToCart(true);
    setError("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Failed to add to cart");
      }

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      router.refresh();
    } catch (error) {
      setError("Failed to add");
      setTimeout(() => setError(""), 2000);
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/products/${product.id}`} className="block">
      <article className="group relative flex flex-col gap-4 rounded-3xl bg-white border border-gray-100 p-4 transition-all duration-500 hover:shadow-xl hover:shadow-[#6C63FF]/10 hover:-translate-y-2 hover:border-[#6C63FF]/20">
        <button
          onClick={handleWishlist}
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

        <div className="overflow-hidden rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F9FA] p-6 pointer-events-none">
          <div className="relative aspect-square w-full overflow-hidden transition-transform duration-700 group-hover:scale-110">
            <div className="aspect-square flex justify-center items-center text-gray-400 font-medium text-sm">
              {product.name}
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 pointer-events-none">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6C63FF]/70">
              {product.brand}
            </p>
            <h3 className="mt-1.5 text-base font-semibold text-[#2D3436] truncate group-hover:text-[#2874F0] transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-linear-to-r from-[#FF9F43]/10 to-[#FF9F43]/5 px-3 py-1.5 pointer-events-auto">
            <Star size={13} className="fill-[#FF9F43] text-[#FF9F43]" />
            <span className="text-xs font-bold text-[#FF9F43]">
              {product.rating}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pointer-events-none">
          <div>
            <span className="text-2xl font-bold text-[#2D3436] tracking-tight">
              {product.price}
            </span>
            {error && (
              <p className="text-[10px] font-medium text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`pointer-events-auto inline-flex items-center justify-center rounded-full w-11 h-11 shadow-lg transition-all duration-300 hover:scale-110 disabled:hover:scale-100 disabled:cursor-not-allowed ${
              addedToCart
                ? "bg-green-500 shadow-green-500/30"
                : "bg-linear-to-r from-[#2874F0] to-[#6C63FF] shadow-[#6C63FF]/20 hover:shadow-xl hover:shadow-[#6C63FF]/30"
            }`}
          >
            {isAddingToCart ? (
              <Loader2 size={18} className="text-white animate-spin" />
            ) : addedToCart ? (
              <Check size={18} className="text-white" />
            ) : (
              <Plus size={18} className="text-white" />
            )}
          </button>
        </div>
      </article>
    </Link>
  );
}
