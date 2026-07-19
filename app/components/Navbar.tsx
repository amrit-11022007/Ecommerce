"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="w-full bg-[#f5f9fd] px-6 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
      <nav className="mx-auto flex max-w-350 items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-[#20252b]"
        >
          NEO-STORE
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/shop"
            className="border-b-2 border-[#606a75] pb-1 text-sm font-medium text-[#20252b]"
          >
            Shop
          </Link>

          <Link
            href="/new-arrivals"
            className="text-sm text-[#596574] transition hover:text-black"
          >
            New Arrivals
          </Link>

          <Link
            href="/collections"
            className="text-sm text-[#596574] transition hover:text-black"
          >
            Collections
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex h-10 items-center rounded-full bg-[#f5f9fd] shadow-[4px_4px_10px_#d7e0e9,-4px_-4px_10px_#ffffff] transition-all duration-300 ${
              isSearchOpen ? "w-64 px-4" : "w-10 justify-center"
            }`}
          >
            {isSearchOpen ? (
              <>
                <Search size={18} className="shrink-0 text-gray-500" />
                <Input
                  autofocus={true}
                  type="text"
                  placeholder="Search products..."
                  style="ml-2 w-full bg-transparent text-sm outline-none"
                />
                <Button
                  style="text-gray-500 transition hover:text-black"
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
                iconClass="text-[#4d5966]"
                style="text-gray-500"
              />
            )}
          </div>
          <button
            aria-label="Shopping bag"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f9fd] shadow-[4px_4px_10px_#d7e0e9,-4px_-4px_10px_#ffffff]"
          >
            <ShoppingBag size={18} className="text-[#4d5966]" />
          </button>

          <button
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f9fd] shadow-[4px_4px_10px_#d7e0e9,-4px_-4px_10px_#ffffff]"
          >
            <User size={18} className="text-[#4d5966]" />
          </button>
        </div>
      </nav>
    </header>
  );
}
