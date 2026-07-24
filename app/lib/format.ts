export function placeholderImage(text: string, w = 500, h = 500) {
  return `https://dummyjson.com/image/${w}x${h}/1e293b/94a3b8?text=${encodeURIComponent(text)}`;
}

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}
