import { WishlistItem } from "@/types";
import { getProductById } from "./products";
let inMemoryWishlist: WishlistItem[] = [];
export async function getWishlistItems(userId: string): Promise<WishlistItem[]> {
  return Promise.all(inMemoryWishlist.filter(i => i.userId === userId).map(async i => ({ ...i, product: (await getProductById(i.productId)) || undefined })));
}
export async function toggleWishlist(userId: string, productId: string): Promise<boolean> {
  const existing = inMemoryWishlist.find(w => w.userId === userId && w.productId === productId);
  if (existing) {
    inMemoryWishlist = inMemoryWishlist.filter(w => !(w.userId === userId && w.productId === productId));
    return false;
  } else {
    inMemoryWishlist.push({ userId, productId, addedAt: new Date().toISOString() });
    return true;
  }
}
