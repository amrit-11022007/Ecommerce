import { ProductGrid } from "./components/ProductGrid";
import { DisplayProduct, ProductRow } from "./types/definitions";
import { Hero } from "./components/Hero";
import { db } from "./lib/database/db";

export default async function Home() {
  let featuredProducts: DisplayProduct[] = [];
  try {
    const [rows] = await db.query<ProductRow[]>(
      "SELECT product_id, product_name, brand, price FROM Products LIMIT 16",
    );
    console.log(rows);
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
    <div className="neu-page min-h-screen px-6 py-10 md:px-12 lg:px-20">
      <Hero
        eyebrow="New season"
        title={
          <>
            Everyday essentials,{" "}
            <span className="text-(--neu-accent)">softly</span> made better.
          </>
        }
        description="Footwear, tech, and apparel from brands you trust — curated on one calm, clutter-free shelf."
        ctaLabel="Browse the shelf"
        imageText="Neo Store"
        imageAlt="Featured products preview"
      />
      <ProductGrid
        eyebrow="Shelf"
        heading="Featured products"
        products={featuredProducts}
      />
    </div>
  );
}
