import { NextResponse } from "next/server";
import { getCartItems, addToCart, removeFromCart } from "@/lib/services/cart";
const U = "demo_user_123";
export async function GET() { return NextResponse.json({ success: true, data: await getCartItems(U) }); }
export async function POST(req: Request) { const b = await req.json(); await addToCart(U, b.productId, b.quantity || 1); return NextResponse.json({ success: true }); }
export async function DELETE(req: Request) { const id = new URL(req.url).searchParams.get("productId"); if (id) await removeFromCart(U, id); return NextResponse.json({ success: true }); }
