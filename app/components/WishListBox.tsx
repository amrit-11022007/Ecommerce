"use client";

import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";
import type { WishlistItem } from "../types/componentDefinitions";

function getWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("wishlist");
  return stored ? JSON.parse(stored) : [];
}

export default function WishlistBox() {
  const wishlistItems = getWishlistItems();

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-[#6C63FF]/5 border border-gray-100">
      <h2 className="text-xl font-bold text-[#2D3436] mb-6 flex items-center gap-3">
        <Heart size={24} className="text-red-400" />
        Wishlist
      </h2>
      {wishlistItems.length > 0 ? (
        <div className="max-h-85 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="grid grid-cols-2 gap-3">
            {wishlistItems.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="flex flex-col items-center gap-3 rounded-2xl bg-linear-to-br from-red-50 to-pink-50 p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="w-full aspect-square rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Heart
                    size={32}
                    className="text-red-300 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300"
                  />
                </div>
                <div className="w-full text-center">
                  <p className="text-xs font-semibold text-[#2D3436] truncate group-hover:text-red-500 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold text-red-400 mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-red-50 to-pink-50 mb-4">
            <Heart size={32} className="text-red-300" />
          </div>
          <p className="text-gray-500 font-medium">Your wishlist is empty</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 mt-4 text-red-400 font-semibold hover:text-red-500 transition-colors duration-300 group"
          >
            Browse Products
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
