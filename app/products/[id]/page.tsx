import { db } from "@/app/lib/database/db";
import { ProductRow } from "@/app/types/definitions";
import { ProductPageProps } from "@/app/types/definitions";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [rows] = await db.query<ProductRow[]>(
    "SELECT * FROM Products where product_id = ?",
    [id],
  );
  const product = rows[0];
  if (!product) return notFound();
  return (
    <main className="min-h-screen bg-[#e9eef7] px-6 py-10 text-slate-700 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-sm text-slate-500">
          Home <span className="mx-2">/</span> {product.category}
          <span className="mx-2">/</span>
          <span className="text-slate-700">{product.product_name}</span>
        </div>
        <section className="grid gap-10 rounded-4xl bg-[#e9eef7] p-6 shadow-[12px_12px_24px_#c7d0de,-12px_-12px_24px_#ffffff] md:p-10 lg:grid-cols-2">
          <div className="flex min-h-105 items-center justify-center rounded-3xl bg-[#e9eef7] shadow-[inset_8px_8px_16px_#c7d0de,inset_-8px_-8px_16px_#ffffff]">
            <div className="text-center">
              <div className="mb-4 text-8xl">🛍️</div>
              <p className="text-sm font-medium uppercase tracking-widest text-slate-400">
                {product.brand}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--neu-accent)">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              {product.product_name}
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              <span className="font-semibold text-slate-700">
                {product.brand}
              </span>
            </p>
            <div className="mt-8">
              <span className="text-4xl font-bold text-slate-800">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="my-8 h-px bg-slate-300/60" />
            <div className="mb-8 flex items-center justify-between rounded-2xl bg-[#e9eef7] px-5 py-4 shadow-[inset_5px_5px_10px_#c7d0de,inset_-5px_-5px_10px_#ffffff]">
              <span className="font-mono text-sm font-semibold text-slate-700">
                {product.description}
              </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="flex-1 rounded-2xl bg-[#e9eef7] px-6 py-4 font-semibold text-slate-700 shadow-[8px_8px_16px_#c7d0de,-8px_-8px_16px_#ffffff] transition hover:shadow-[4px_4px_8px_#c7d0de,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c7d0de,inset_-4px_-4px_8px_#ffffff]">
                Add to Cart
              </button>
              <button className="flex-1 rounded-2xl bg-[#E0C313] px-6 py-4 font-semibold text-white shadow-[8px_8px_16px_#c7d0de,-8px_-8px_16px_#ffffff] transition hover:brightness-105 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]">
                Buy Now
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
