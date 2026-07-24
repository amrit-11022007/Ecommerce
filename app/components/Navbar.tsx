"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import Button from "./Button";
import SearchResult from "./SearchResult";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 px-6 py-3 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-350 items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          NEO-STORE
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/shop"
            className="border-b-2 border-orange-400 pb-1 text-sm font-medium text-white"
          >
            Shop
          </Link>

          <Link
            href="/new-arrivals"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            New Arrivals
          </Link>

          <Link
            href="/collections"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Collections
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`flex h-10 items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 ${
                isSearchOpen ? "w-64 px-4" : "w-10 justify-center"
              }`}
            >
              {isSearchOpen ? (
                <>
                  <Search size={18} className="shrink-0 text-slate-400" />
                  <SearchResult autoFocus />
                  <Button
                    style="shrink-0 text-slate-400 transition hover:text-white"
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    icon={X}
                  />
                </>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  icon={Search}
                  iconClass="text-slate-400"
                  style="text-slate-400"
                />
              )}
            </div>
          </div>

          <button
            aria-label="Shopping bag"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20"
          >
            <ShoppingBag size={18} className="text-slate-400" />
          </button>

          <button
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20"
          >
            <User size={18} className="text-slate-400" />
          </button>
        </div>
      </nav>
    </header>
  );
}
