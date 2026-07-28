import { WishlistItem } from "../types/componentDefinitions";

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("wishlist");
  return stored ? JSON.parse(stored) : [];
}

export function addToWishlist(product: WishlistItem): void {
  const wishlist = getWishlist();
  if (!wishlist.find((item) => item.id === product.id)) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
}

export function removeFromWishlist(productId: string): void {
  const wishlist = getWishlist().filter((item) => item.id !== productId);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

export function inWishlist(productId: string): boolean {
  return getWishlist().some((item) => item.id === productId);
}
