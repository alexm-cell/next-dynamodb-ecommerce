"use client";
import Link from "next/link";
import { Product } from "@/types";
export function ProductCard({ product, onAddToCart, onToggleWishlist }: { product: Product; onAddToCart?: (id: string) => void; onToggleWishlist?: (id: string) => void }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between p-4">
      <div>
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.description}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-lg font-bold">{product.price.toFixed(2)} €</span>
        <button onClick={() => onAddToCart?.(product.productId)} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl">Ajouter</button>
      </div>
    </div>
  );
}
