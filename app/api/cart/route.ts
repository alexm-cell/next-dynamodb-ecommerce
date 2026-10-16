import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { DeleteCommand, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { authOptions } from "@/lib/auth";
import { db, requiredEnv } from "@/lib/dynamodb";
import { getProductById } from "@/lib/services/products";

export const runtime = "nodejs";

async function userId() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function GET() {
  try {
    const user = await userId();
    if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    const result = await db.send(new QueryCommand({
      TableName: requiredEnv("CART_TABLE"),
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": user },
    }));
    return NextResponse.json({ items: result.Items ?? [] });
  } catch {
    return NextResponse.json({ error: "Panier indisponible ou table non configurée" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await userId();
    if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    const body = await request.json();
    const productId = typeof body?.productId === "string" ? body.productId : "";
    const quantity = body?.quantity;
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "Produit ou quantité invalide" }, { status: 400 });
    }
    const product = await getProductById(productId);
    if (!product) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    if (quantity > product.stock) return NextResponse.json({ error: "Stock insuffisant" }, { status: 409 });
    await db.send(new PutCommand({
      TableName: requiredEnv("CART_TABLE"),
      Item: { userId: user, productId, quantity, updatedAt: new Date().toISOString() },
    }));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Panier indisponible ou table non configurée" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await userId();
    if (!user) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    if (typeof body?.productId !== "string" || !body.productId) {
      return NextResponse.json({ error: "productId requis" }, { status: 400 });
    }
    await db.send(new DeleteCommand({
      TableName: requiredEnv("CART_TABLE"),
      Key: { userId: user, productId: body.productId },
    }));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Panier indisponible ou table non configurée" }, { status: 503 });
  }
}
