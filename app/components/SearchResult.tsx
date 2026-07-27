"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { ProductRow } from "@/app/types/definitions";
import { Search, Sparkles, ArrowRight } from "lucide-react";

type SearchResultProps = {
  query: string;
  limit?: number;
  emptyMessage?: string;
  className?: string;
  onClose?: () => void;
};

export default function SearchResult({
  query,
  limit = 10,
  emptyMessage = "No results found.",
  className,
  onClose,
}: SearchResultProps) {
  const [results, setResults] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const prevQuery = useRef(query);

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed === "") {
      if (prevQuery.current !== "") {
        setResults([]);
        prevQuery.current = "";
      }
      return;
    }

    if (trimmed === prevQuery.current) return;
    prevQuery.current = trimmed;

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

  if (trimmed === "") return null;

  return (
    <div className={className}>
      <div className="px-5 py-3 border-b border-gray-50">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Results for &ldquo;{trimmed}&rdquo;
        </p>
      </div>

      <ul className="max-h-80 overflow-y-auto py-3">
        {loading ? (
          <li className="px-5 py-4">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-[#6C63FF] animate-pulse" />
              <span className="text-sm font-medium text-gray-500">
                Searching...
              </span>
            </div>
          </li>
        ) : results.length > 0 ? (
          results.map((product) => (
            <li key={product.product_id}>
              <Link
                href={`/products/${product.product_id}`}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-3.5 text-sm text-[#2D3436] hover:bg-linear-to-r hover:from-[#F0F8FF] hover:to-[#F8F0FF] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Search size={16} className="text-[#6C63FF]" />
                  </div>
                  <span className="truncate font-medium">
                    {product.product_name}
                  </span>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-xs font-semibold text-[#6C63FF] bg-[#6C63FF]/5 px-3 py-1 rounded-full">
                    {product.brand}
                  </span>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-[#6C63FF] group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-5 py-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#F0F8FF] to-[#F8F0FF] flex items-center justify-center">
                <Search size={28} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">
                {emptyMessage}
              </p>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}
