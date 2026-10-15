import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/services/products";
export async function GET() { return NextResponse.json({ success: true, data: await getAllProducts() }); }
