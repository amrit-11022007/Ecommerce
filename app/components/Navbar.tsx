"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, X, Menu } from "lucide-react";
import { useState } from "react";
import SearchResult from "./SearchResult";
import NeoStoreLogo from "./Logo";

export default function Navbar({ userId = "0", totalCartItems = 0 }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="px-5 sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <nav className="container-premium h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight hover:scale-105 transition-transform duration-300"
        >
          <NeoStoreLogo variant="uppercase" size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-black hover:text-[#2D3436] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-linear-to-r after:from-[#2874F0] after:to-[#6C63FF] after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-black hover:text-[#2D3436] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-linear-to-r after:from-[#2874F0] after:to-[#6C63FF] after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
          >
            Shop
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-black hover:text-[#2D3436] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-linear-to-r after:from-[#2874F0] after:to-[#6C63FF] after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
          >
            Collections
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative hidden md:block">
            <div
              className={`flex items-center rounded-2xl border-2 transition-all duration-500 ${
                isSearchOpen
                  ? "w-80 border-[#6C63FF] bg-white shadow-lg shadow-[#6C63FF]/10"
                  : "w-12 border-gray-100 bg-gray-50 hover:border-gray-200 hover:shadow-md"
              }`}
            >
              {isSearchOpen ? (
                <div className="w-full flex items-center">
                  <Search size={18} className="ml-4 text-[#6C63FF] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleCloseSearch}
                    className="mr-3 text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center w-full h-12 text-gray-400 hover:text-[#6C63FF] transition-all duration-300"
                >
                  <Search size={20} />
                </button>
              )}
            </div>
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 top-full mt-3 w-full rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-[#6C63FF]/10 overflow-hidden">
                <SearchResult query={searchQuery} onClose={handleCloseSearch} />
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden text-gray-500 hover:text-[#6C63FF] transition-colors duration-300"
          >
            {isSearchOpen ? <X size={22} /> : <Search size={22} />}
          </button>

          <Link href={`/cart/${userId}`}>
            <button
              aria-label="Shopping bag"
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#6C63FF]/30 hover:bg-[#F0F8FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 transition-all duration-300 group"
            >
              <ShoppingBag
                size={20}
                className="text-gray-500 group-hover:text-[#6C63FF] transition-colors duration-300"
              />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-linear-to-r from-[#2874F0] to-[#6C63FF] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-[#6C63FF]/30">
                {totalCartItems}
              </span>
            </button>
          </Link>

          <Link href={`/user/${userId}`}>
            <button
              aria-label="Account"
              className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#6C63FF]/30 hover:bg-[#F0F8FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 transition-all duration-300 group"
            >
              <User
                size={20}
                className="text-gray-500 group-hover:text-[#6C63FF] transition-colors duration-300"
              />
            </button>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-[#6C63FF]/30 hover:bg-[#F0F8FF] transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <X size={22} className="text-[#6C63FF]" />
            ) : (
              <Menu size={22} className="text-gray-600" />
            )}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl py-6 px-6 shadow-2xl">
          <div className="flex flex-col gap-4">
            <Link
              href="/shop"
              className="text-base font-semibold text-[#2874F0] hover:text-[#6C63FF] transition-colors duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/new-arrivals"
              className="text-base font-medium text-gray-600 hover:text-[#2D3436] transition-colors duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/collections"
              className="text-base font-medium text-gray-600 hover:text-[#2D3436] transition-colors duration-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href={`/user/${userId}`}
              className="text-base font-medium text-gray-600 hover:text-[#2D3436] transition-colors duration-300 pt-2 border-t border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Account
            </Link>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Search size={18} className="text-[#6C63FF] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full bg-transparent text-sm text-[#2D3436] placeholder:text-gray-400 outline-none"
              autoFocus
            />
            <button
              onClick={handleCloseSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
            >
              <X size={18} />
            </button>
          </div>
          <SearchResult query={searchQuery} onClose={handleCloseSearch} />
        </div>
      )}
    </header>
  );
}
