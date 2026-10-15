"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetch("/api/products").then(r => r.json()).then(d => d.success && setProducts(d.data)); }, []);
  const handleAddToCart = async (id: string) => { await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: id }) }); alert("Ajouté au panier !"); };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Boutique</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(p => <ProductCard key={p.productId} product={p} onAddToCart={handleAddToCart} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}
