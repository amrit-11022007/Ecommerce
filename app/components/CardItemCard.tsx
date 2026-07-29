// app/components/CartItemCard.tsx
"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, Minus, Plus, Star, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItemProps = {
  product_id: string;
};

export default function CartItemCard({ product_id }: CartItemProps) {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [availableCount, setAvailableCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`${window.location.origin}/api/cart`)
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = data.items?.find((i: any) => i.product_id === product_id);
        if (item) {
          setQuantity(item.quantity);
          setPrice(Number(item.price));
          setProductName(item.product_name);
          setBrand(item.brand);
          setRating(item.rating);
          setAvailableCount(item.available_count);
        }
        setIsLoading(false);
      });
  }, [product_id]);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;
    if (newQuantity > availableCount) {
      setError(`Only ${availableCount} available`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    setIsUpdating(true);
    setQuantity(newQuantity);
    setError("");

    try {
      const res = await fetch(
        `${window.location.origin}/api/cart?id=${product_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        setQuantity(quantity);
        setError(data.message || "Failed to update");
        setTimeout(() => setError(""), 3000);
        return;
      }

      router.refresh();
    } catch {
      setQuantity(quantity);
      setError("Failed to update");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${window.location.origin}/api/cart?id=${product_id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Failed to remove");
      router.refresh();
    } catch {
      console.error("Failed to remove item:");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-xl bg-gray-100" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 rounded bg-gray-100" />
            <div className="h-4 w-1/4 rounded bg-gray-100" />
            <div className="h-8 w-1/3 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex gap-4">
        <Link
          href={`/products/${product_id}`}
          className="w-24 h-24 rounded-xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] flex items-center justify-center shrink-0 shadow-sm"
        >
          <ShoppingBag size={32} className="text-[#6C63FF]" />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/products/${product_id}`}>
            <h3 className="text-base font-semibold text-[#2D3436] truncate hover:text-[#2874F0] transition-colors">
              {productName}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">{brand}</p>

          {rating !== null ? (
            <div className="flex items-center gap-1 mt-2">
              <Star size={14} className="fill-[#FF9F43] text-[#FF9F43]" />
              <span className="text-sm font-medium text-gray-500">
                {rating}/5
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400 mt-2 block">
              No ratings yet
            </span>
          )}

          {error && (
            <p className="text-xs font-medium text-red-500 mt-2">{error}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            {availableCount > 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => updateQuantity(quantity! - 1)}
                  disabled={isUpdating || (quantity ?? 0) <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={16} className="text-gray-500" />
                </button>
                <span className="text-sm font-bold text-[#2D3436] min-w-6 text-center">
                  {isUpdating ? (
                    <Loader2 size={14} className="animate-spin mx-auto" />
                  ) : (
                    quantity
                  )}
                </span>
                <button
                  onClick={() => updateQuantity(quantity! + 1)}
                  disabled={isUpdating || (quantity ?? 0) >= availableCount}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <span className="text-sm font-bold text-red-500 bg-red-50 min-w-6 text-center">
                Out Of Stock
              </span>
            )}

            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-[#2D3436]">
                ₹{(price * (quantity ?? 0)).toLocaleString("en-IN")}
              </span>
              <button
                onClick={removeItem}
                disabled={isUpdating}
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-red-50 transition-colors group disabled:opacity-40"
              >
                {isUpdating ? (
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                ) : (
                  <Trash2
                    size={18}
                    className="text-gray-400 group-hover:text-red-400 transition-colors"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
