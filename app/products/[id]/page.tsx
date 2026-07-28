import { prisma } from "@/app/lib/database/prisma";
import { ProductPageProps } from "@/app/types/definitions";
import { notFound } from "next/navigation";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import {
  Star,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import HeartIcon from "@/app/components/wishlisticon";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.products.findUnique({
    where: { product_id: id },
    select: {
      brand: true,
      category: true,
      product_name: true,
      description: true,
      price: true,
      Inventory: {
        select: {
          available_count: true,
        },
        take: 1,
      },
      Reviews: {
        select: {
          rating: true,
          review: true,
          comments: true,
          updated_at: true,
        },
        orderBy: {
          updated_at: "desc",
        },
        take: 1,
      },
    },
  });

  if (!product) return notFound();

  const stockCount = product.Inventory[0]?.available_count ?? 0;
  const latestReview = product.Reviews[0] ?? null;
  const ratingValue =
    latestReview?.rating !== null && latestReview?.rating !== undefined
      ? `${latestReview.rating}/5`
      : "Not rated";
  const reviewText = latestReview?.review?.trim()
    ? latestReview.review
    : "No review available";
  const commentsText = latestReview?.comments?.trim()
    ? latestReview.comments
    : "No comments to display";
  const updatedAtText = latestReview?.updated_at
    ? new Date(latestReview.updated_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not updated yet";

  return (
    <main className="min-h-screen bg-linear-to-b from-[#F0F8FF]/30 via-white to-white">
      <div className="container-premium py-8 md:py-12">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-400">
          <span className="hover:text-[#6C63FF] transition-colors duration-300 cursor-pointer">
            Home
          </span>
          <span>/</span>
          <span className="hover:text-[#6C63FF] transition-colors duration-300 cursor-pointer">
            {product.category}
          </span>
          <span>/</span>
          <span className="text-[#2D3436]">{product.product_name}</span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] border border-gray-100 p-12 shadow-2xl shadow-[#6C63FF]/5 group">
            <div className="absolute top-6 right-6 z-10 flex gap-2">
              <HeartIcon
                name={product.product_name}
                price={Number(product.price)}
                id={id}
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-110">
                <Share2
                  size={20}
                  className="text-gray-400 hover:text-[#6C63FF] transition-colors duration-300"
                />
              </button>
            </div>
            <div className="flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3">
              <div className="text-center">
                <div className="mb-6 text-[120px]">🛍️</div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#6C63FF] bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                  {product.brand}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-6">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#6C63FF] p-2 flex items-center justify-center cursor-pointer shadow-lg">
                <div className="text-2xl">🛍️</div>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-2 flex items-center justify-center cursor-pointer hover:border-[#6C63FF]/50 transition-all duration-300">
                <div className="text-2xl">📦</div>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-2 flex items-center justify-center cursor-pointer hover:border-[#6C63FF]/50 transition-all duration-300">
                <div className="text-2xl">✨</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#2874F0]/10 to-[#6C63FF]/10 backdrop-blur-sm border border-[#6C63FF]/20 px-4 py-2 w-fit mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF]">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[#2D3436] md:text-5xl tracking-tight leading-tight">
              {product.product_name}
            </h1>

            <p className="mt-3 text-lg text-gray-500 font-medium">
              by{" "}
              <span className="font-semibold text-[#2874F0]">
                {product.brand}
              </span>
            </p>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#FF9F43]/10 to-[#FF9F43]/5 px-4 py-2">
                <Star size={16} className="fill-[#FF9F43] text-[#FF9F43]" />
                <span className="text-sm font-bold text-[#FF9F43]">
                  {ratingValue}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-400">
                {reviewText}
              </span>
            </div>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-5xl font-bold text-[#2D3436] tracking-tight">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="text-lg text-gray-400 line-through font-medium">
                ₹
                {Math.round(Number(product.price) * 1.4).toLocaleString(
                  "en-IN",
                )}
              </span>
              <span className="text-sm font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                30% off
              </span>
            </div>

            <div className="my-8 h-px bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />

            <p className="text-base leading-relaxed text-gray-500 font-medium">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-gray-200 p-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <Minus size={20} className="text-gray-600" />
                </button>
                <span className="text-lg font-bold text-[#2D3436] min-w-8 text-center">
                  1
                </span>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <Plus size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <Button
                text="Add to Cart"
                type="button"
                variant="primary"
                size="lg"
                icon={ShoppingBag}
                className="rounded-2xl shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40 flex-1"
              />
              <Button
                text="Buy Now"
                type="button"
                variant="outline"
                size="lg"
                className="rounded-2xl flex-1"
              />
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
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-[#6C63FF]/5">
            <h2 className="mb-8 text-2xl font-bold text-[#2D3436] flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#2874F0]/10 to-[#6C63FF]/10 flex items-center justify-center">
                <ShoppingBag size={20} className="text-[#6C63FF]" />
              </div>
              Product Details
            </h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">Brand</span>
                <span className="text-sm font-bold text-[#2D3436]">
                  {product.brand}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">
                  Category
                </span>
                <span className="text-sm font-bold text-[#2D3436]">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">
                  Product Name
                </span>
                <span className="text-sm font-bold text-[#2D3436]">
                  {product.product_name}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">Price</span>
                <span className="text-sm font-bold text-[#2D3436]">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-50">
                <span className="text-sm font-medium text-gray-500">
                  Availability
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-green-500 bg-green-50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {stockCount} in stock
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm font-medium text-gray-500">
                  Updated At
                </span>
                <span className="text-sm font-bold text-[#2D3436]">
                  {updatedAtText}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-[#6C63FF]/5">
            <h2 className="mb-8 text-2xl font-bold text-[#2D3436] flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#FF9F43]/10 to-[#FF6B6B]/10 flex items-center justify-center">
                <Star size={20} className="text-[#FF9F43]" />
              </div>
              Reviews & Ratings
            </h2>
            <div className="space-y-6 mb-8">
              <div className="rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 shadow-sm">
                    <Star size={14} className="fill-[#FF9F43] text-[#FF9F43]" />
                    <span className="text-sm font-bold text-[#2D3436]">
                      {ratingValue}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    {reviewText}
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {commentsText}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="mb-5 text-lg font-bold text-[#2D3436]">
                Add a Review
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Share your experience..."
                  type="text"
                  name="review"
                />
                <Button
                  text="Submit Review"
                  type="button"
                  variant="primary"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
