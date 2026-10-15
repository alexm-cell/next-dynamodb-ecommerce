"use client";
import { useEffect, useState } from "react";
import { CartItem } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const load = () => { fetch("/api/cart").then(r => r.json()).then(d => d.success && setItems(d.data)); };
  useEffect(() => { load(); }, []);
  const remove = async (id: string) => { await fetch(`/api/cart?productId=${id}`, { method: "DELETE" }); load(); };
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-bold mb-6">Panier</h1>
        {items.map(i => i.product && (
          <div key={i.productId} className="flex justify-between items-center bg-white p-4 rounded-xl mb-4 shadow-sm">
            <span>{i.product.name} (x{i.quantity})</span>
            <button onClick={() => remove(i.productId)} className="text-red-500">Supprimer</button>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
