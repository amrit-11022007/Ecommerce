import { prisma } from "@/app/lib/database/prisma";
import { ProductPageProps } from "@/app/types/definitions";
import { notFound } from "next/navigation";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.products.findUnique({
    where: { product_id: Number(id) },
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
    : "NO COMMENTS TO DISPLAY";
  const updatedAtText = latestReview?.updated_at
    ? new Date(latestReview.updated_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not updated yet";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-300 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-sm text-slate-500">
          Home <span className="mx-2">/</span> {product.category}
          <span className="mx-2">/</span>
          <span className="text-slate-300">{product.product_name}</span>
        </div>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8 lg:grid-cols-[400px_1fr]">
          <div className="flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 p-8">
            <div className="text-center">
              <div className="mb-4 text-8xl">🛍️</div>
              <p className="text-sm font-medium uppercase tracking-widest text-orange-400/80">
                {product.brand}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              {product.category}
            </p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {product.product_name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              by{" "}
              <span className="font-semibold text-slate-300">
                {product.brand}
              </span>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-green-500/15 px-2.5 py-1 text-sm font-semibold text-green-400 border border-green-500/20">
                {ratingValue} ★
              </span>
              <span className="text-sm text-slate-500">({reviewText})</span>
            </div>
            <div className="mt-6">
              <span className="text-3xl font-bold text-white">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="my-6 h-px bg-white/10" />
            <p className="text-sm leading-relaxed text-slate-400">
              {product.description}
            </p>
            <div className="mt-8 flex gap-4">
              <Button
                text="Add to Cart"
                type="button"
                style="flex-1 rounded-xl border border-orange-500/30 bg-orange-500/10 px-6 py-3.5 font-semibold text-orange-400 backdrop-blur-sm transition-all duration-300 hover:bg-orange-500/20 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98]"
              />
              <Button
                text="Buy Now"
                type="button"
                style="flex-1 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98]"
              />
            </div>
          </div>
        </section>
        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <h2 className="mb-6 text-lg font-semibold text-white">
              Product Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-orange-400/70">Brand</span>
                <span className="text-sm font-medium text-white">
                  {product.brand}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-orange-400/70">Category</span>
                <span className="text-sm font-medium text-white">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-orange-400/70">Product Name</span>
                <span className="text-sm font-medium text-white">
                  {product.product_name}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-orange-400/70">Price</span>
                <span className="text-sm font-medium text-white">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm text-green-400/70">Availability</span>
                <span className="text-sm font-medium text-green-400">
                  {stockCount} in stock
                </span>
              </div>
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm text-orange-400/70">Updated At</span>
                <span className="text-sm font-medium text-white">
                  {updatedAtText}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8">
            <h2 className="mb-6 text-lg font-semibold text-white">
              Reviews & Ratings
            </h2>
            <div className="space-y-4 mb-8">
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/20">
                    {ratingValue} ★
                  </span>
                  <span className="text-sm text-slate-500">{reviewText}</span>
                </div>
                <p className="text-sm text-slate-400">{commentsText}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-6">
              <h3 className="mb-4 text-sm font-semibold text-white">
                Add a Review
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Write your review..."
                  type="text"
                  name="review"
                  style="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-sm transition-all duration-300 focus:border-orange-500/50 focus:bg-white/10 focus:shadow-lg focus:shadow-orange-500/5"
                />
                <Button
                  text="Submit Review"
                  type="button"
                  style="w-full rounded-xl bg-orange-500/15 border border-orange-500/20 px-4 py-3 text-sm font-semibold text-orange-400 backdrop-blur-sm transition-all duration-300 hover:bg-orange-500/25 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98]"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
