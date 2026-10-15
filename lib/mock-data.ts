import { Product, Category } from "@/types";
export const MOCK_CATEGORIES: Category[] = [
  { categoryId: "cat_1", name: "Électronique", slug: "audio-tech", description: "Audio high-tech" },
  { categoryId: "cat_2", name: "Mode", slug: "wearables", description: "Accessoires" }
];
export const MOCK_PRODUCTS: Product[] = [
  { productId: "prod_1", name: "Casque Sans Fil", slug: "casque", description: "Casque audio HD", price: 249.99, category: "audio-tech", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", stock: 15, rating: 4.8, reviewCount: 124, featured: true },
  { productId: "prod_2", name: "Montre Connectée", slug: "montre", description: "Sport Pro", price: 199.50, category: "wearables", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", stock: 8, rating: 4.6, reviewCount: 89, featured: true }
];
