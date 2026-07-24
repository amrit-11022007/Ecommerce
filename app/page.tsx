import { Suspense } from "react";

import { ProductGrid } from "./components/ProductGrid";
import { ProductGridSkeleton } from "./skeletons/ProductGrid";
import { DisplayProduct } from "./types/definitions";
import { Hero } from "./components/Hero";
import { prisma } from "./lib/database/prisma";

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 md:px-12 lg:px-20">
      <Hero
        eyebrow="New season"
        title={
          <>
            Everyday essentials, <span className="text-orange-400">softly</span>{" "}
            made better.
          </>
        }
        description="Footwear, tech, and apparel from brands you trust — curated on one calm, clutter-free shelf."
        ctaLabel="Browse the shelf"
        imageText="Neo Store"
        imageAlt="Featured products preview"
      />
      <Suspense fallback={<ProductGridSkeleton />}>
        <GetProducts />
      </Suspense>
    </div>
  );
}

async function GetProducts() {
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
    featuredProducts = rows.map((row) => ({
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
      eyebrow="Shelf"
      heading="Featured products"
      products={featuredProducts}
    />
  );
}
