"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import {
  addToWishlist,
  inWishlist,
  removeFromWishlist,
} from "../lib/whishlist";
import type { WishlistItem } from "../types/componentDefinitions";

export default function HeartIcon({ id, name, price }: WishlistItem) {
  const [isWishlisted, setIsWishlisted] = useState(() => inWishlist(id));

  function handleWishList(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(id);
      setIsWishlisted(false);
    } else {
      addToWishlist({
        id,
        name,
        price,
      });
      setIsWishlisted(true);
    }
  }
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-110"
      onClick={(e) => handleWishList(e)}
    >
      <Heart
        size={20}
        className={`transition-all duration-300 ${
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-400"
        }`}
      />
    </button>
  );
}
