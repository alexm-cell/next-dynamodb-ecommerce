import { NextResponse } from "next/server";
import { getWishlistItems, toggleWishlist } from "@/lib/services/wishlist";
const U = "demo_user_123";
export async function GET() { return NextResponse.json({ success: true, data: await getWishlistItems(U) }); }
export async function POST(req: Request) { const b = await req.json(); const added = await toggleWishlist(U, b.productId); return NextResponse.json({ success: true, added }); }
