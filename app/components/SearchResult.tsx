"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { ProductRow } from "@/app/types/definitions";
import { useDebounce } from "@/app/utility/deBounce";

type SearchResultProps = {
  limit?: number;
  emptyMessage?: string;
  className?: string;
  autoFocus?: boolean;
};

export default function SearchResult({
  limit = 10,
  emptyMessage = "No results found.",
  className,
}: SearchResultProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const trimmed = debouncedQuery.trim();

  useEffect(() => {
    if (trimmed === "") return;

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?identifier=${encodeURIComponent(trimmed)}&limit=${limit}`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to load data.");
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Search failed:", error);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [trimmed, limit]);

  const isOpen = query.trim().length > 0;
  const displayedResults = trimmed === "" ? [] : results;

  return (
    <div className="relative min-w-0 flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products, brands..."
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
      />

      {isOpen && (
        <div
          className={clsx(
            "absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-[0_12px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl",
            className,
          )}
        >
          <ul className="max-h-72 overflow-y-auto">
            {loading ? (
              <li className="px-4 py-3 text-sm text-slate-500">Searching…</li>
            ) : displayedResults.length > 0 ? (
              displayedResults.map((product) => (
                <li key={product.product_id} onClick={() => setQuery("")}>
                  <Link
                    href={`/products/${product.product_id}`}
                    className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5"
                  >
                    <span className="truncate">{product.product_name}</span>
                    <span className="ml-3 shrink-0 text-xs text-slate-500">
                      {product.brand}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="cursor-default px-4 py-3 text-sm text-slate-500">
                {emptyMessage}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
