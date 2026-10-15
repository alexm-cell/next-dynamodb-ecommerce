"use client";
import Link from "next/link";
export function Navbar({ cartCount = 0, wishlistCount = 0 }: { cartCount?: number; wishlistCount?: number }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-indigo-600">NexusStore</Link>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/">Boutique</Link>
          <Link href="/cart">Panier ({cartCount})</Link>
          <Link href="/wishlist">Favoris ({wishlistCount})</Link>
        </div>
      </div>
    </header>
  );
}
