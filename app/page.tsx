import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { ProductGrid } from "./components/ProductGrid";
import { ProductGridSkeleton } from "./skeletons/ProductGrid";
import { DisplayProduct } from "./types/definitions";
import { Hero } from "./components/Hero";
import { prisma } from "./lib/database/prisma";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Sparkles, Truck, Shield, RotateCcw } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;

  return (
    <main>
      <Hero
        eyebrow="New season"
        title={
          <>
            Everyday essentials,{" "}
            <span className="bg-linear-to-r from-[#2874F0] to-[#6C63FF] bg-clip-text text-transparent">
              softly
            </span>{" "}
            made better.
          </>
        }
        description="Footwear, tech, and apparel from brands you trust — curated on one calm, clutter-free shelf."
        ctaLabel="Browse the shelf"
        imageText="Neo Store"
        imageAlt="Featured products preview"
      />

      <div className="container-premium py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-[#F0F8FF] to-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#6C63FF]/20 transition-all duration-300 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Truck size={22} className="text-[#2874F0]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D3436]">Free Shipping</p>
              <p className="text-xs text-gray-400 font-medium">
                Orders above ₹499
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-[#FFF5E7] to-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FF9F43]/20 transition-all duration-300 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Shield size={22} className="text-[#FF9F43]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D3436]">Secure Payment</p>
              <p className="text-xs text-gray-400 font-medium">
                100% protected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-[#F0FFF4] to-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              <RotateCcw size={22} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D3436]">Easy Returns</p>
              <p className="text-xs text-gray-400 font-medium">30-day policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-linear-to-br from-[#F8F0FF] to-white p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#6C63FF]/20 transition-all duration-300 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Sparkles size={22} className="text-[#6C63FF]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D3436]">
                Premium Quality
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Handpicked items
              </p>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <GetProducts isAuthenticated={isAuthenticated} />
      </Suspense>
    </main>
  );
}

async function GetProducts({ isAuthenticated }: { isAuthenticated: boolean }) {
  let featuredProducts: DisplayProduct[] = [];
  try {
    const rows = await prisma.products.findMany({
      select: {
        product_id: true,
        product_name: true,
        brand: true,
        price: true,
      },
      take: 16,
    });
    featuredProducts = rows.map((row: (typeof rows)[number]) => ({
      id: row.product_id,
      name: row.product_name,
      brand: row.brand,
      price: Number(row.price),
      rating: 4.5,
    }));
  } catch (error) {
    console.error("Failed to fetch", error);
  }

  return (
    <ProductGrid
      eyebrow="Curated Shelf"
      heading="Featured Products"
      products={featuredProducts}
      isAuthenticated={isAuthenticated}
    />
  );
}
