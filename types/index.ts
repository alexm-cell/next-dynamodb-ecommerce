export interface Product { productId: string; name: string; slug: string; description: string; price: number; category: string; imageUrl: string; stock: number; rating: number; reviewCount: number; featured?: boolean; }
export interface Category { categoryId: string; name: string; slug: string; description: string; }
export interface CartItem { userId: string; productId: string; quantity: number; product?: Product; }
export interface WishlistItem { userId: string; productId: string; addedAt: string; product?: Product; }
export interface ApiResponse<T> { success: boolean; data?: T; error?: string; }
