export function placeholderImage(text: string, w = 500, h = 500) {
  return `https://dummyjson.com/image/${w}x${h}/e4e9f0/565c68?text=${encodeURIComponent(text)}`;
}

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}
