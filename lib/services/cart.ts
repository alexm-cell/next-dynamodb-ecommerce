import { CartItem } from "@/types";
import { getProductById } from "./products";
let inMemoryCart: CartItem[] = [];
export async function getCartItems(userId: string): Promise<CartItem[]> {
  return Promise.all(inMemoryCart.filter(i => i.userId === userId).map(async i => ({ ...i, product: (await getProductById(i.productId)) || undefined })));
}
export async function addToCart(userId: string, productId: string, quantity: number = 1): Promise<void> {
  const existing = inMemoryCart.find(i => i.userId === userId && i.productId === productId);
  if (existing) existing.quantity += quantity; else inMemoryCart.push({ userId, productId, quantity });
}
export async function removeFromCart(userId: string, productId: string): Promise<void> {
  inMemoryCart = inMemoryCart.filter(i => !(i.userId === userId && i.productId === productId));
}
