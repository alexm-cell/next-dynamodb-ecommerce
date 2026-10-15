import { MOCK_PRODUCTS } from "../mock-data";
import { Product } from "@/types";
export async function getAllProducts(): Promise<Product[]> { return MOCK_PRODUCTS; }
export async function getProductById(id: string): Promise<Product | null> { return MOCK_PRODUCTS.find(p => p.productId === id) || null; }
