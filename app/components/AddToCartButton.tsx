// app/components/AddToCartButton.tsx
"use client";

import {
  ShoppingBag,
  Minus,
  Plus,
  Check,
  Loader2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { AddToCartButtonProps } from "../types/componentDefinitions";

export function AddToCartButton({
  productId,
  stockCount,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to add to cart");

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {stockCount > 0 && (
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-200 p-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors duration-300"
            >
              <Minus size={20} className="text-gray-600" />
            </button>
            <span className="text-lg font-bold text-[#2D3436] min-w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors duration-300"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold shadow-xl transition-all duration-300 flex-1 ${
            added
              ? "bg-green-500 shadow-green-500/30 text-white"
              : "bg-linear-to-r from-[#2874F0] to-[#6C63FF] text-white shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 hover:scale-[1.02]"
          }`}
        >
          {isAdding ? (
            <Loader2 size={20} className="animate-spin" />
          ) : added ? (
            <>
              <Check size={20} />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={20} />
              Add to Cart
            </>
          )}
        </button>
        {stockCount > 0 ? (
          <button className="rounded-2xl border-2 border-[#2874F0] px-8 py-4 text-base font-semibold text-[#2874F0] hover:bg-linear-to-r hover:from-[#2874F0] hover:to-[#6C63FF] hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300 flex-1">
            Buy Now
          </button>
        ) : (
          <button
            disabled
            className="rounded-2xl border-2 border-red-200 bg-red-50 px-8 py-4 text-base font-semibold text-red-400 cursor-not-allowed flex-1"
          >
            Out of Stock
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#F0F8FF] p-4">
          <Truck size={22} className="text-[#2874F0]" />
          <span className="text-xs font-semibold text-gray-600 text-center">
            Free Shipping
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#FFF5E7] p-4">
          <Shield size={22} className="text-[#FF9F43]" />
          <span className="text-xs font-semibold text-gray-600 text-center">
            Secure Pay
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#F0FFF4] p-4">
          <RotateCcw size={22} className="text-green-500" />
          <span className="text-xs font-semibold text-gray-600 text-center">
            Easy Return
          </span>
        </div>
      </div>
    </>
  );
}
