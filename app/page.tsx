"use client";
import { useEffect, useState } from "react";
import { Product } from "./types/definitions";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product | null>(null);

  // Let's pretend this comes from a URL parameter, a click, or state.
  // We'll hardcode it to "3" just for this example.
  const [activeProductId, setActiveProductId] = useState("3");

  useEffect(() => {
    // 1. Update the query to expect a variable
    const query = `
      query GetMyData($productId: ID!) {
        getAllProducts {
          id
          name
          price
        }
        getProductById(id: $productId) {
          id
          name
          price
        }
      }
    `;

    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query, // The query string
        // 2. Add the variables object
        variables: {
          productId: activeProductId, // Match the exact name defined in the query (without the $)
        },
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.data) {
          setProducts(response.data.getAllProducts);
          setFeatured(response.data.getProductById);
        }
      });
  }, [activeProductId]); // Add activeProductId to dependency array so it refetches if it changes

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* A quick way to test dynamic variables: A button that changes the ID */}
      <button
        onClick={() => setActiveProductId("2")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Load Product #2
      </button>

      <h1>Featured Product</h1>
      {featured && (
        <p key={featured.id}>
          {featured.name} - ${featured.price}
        </p>
      )}

      <h1>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
