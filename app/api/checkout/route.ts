import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import Stripe from "stripe";
import { authOptions } from "@/lib/auth";
import { db, requiredEnv } from "@/lib/dynamodb";
import { getProductById } from "@/lib/services/products";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "Connexion requise" }, { status: 401 });

    const stripeKey = requiredEnv("STRIPE_SECRET_KEY");
    const appUrl = requiredEnv("NEXT_PUBLIC_APP_URL");
    const cart = await db.send(new QueryCommand({
      TableName: requiredEnv("CART_TABLE"),
      KeyConditionExpression: "userId = :u",
      ExpressionAttributeValues: { ":u": email },
    }));

    const items = cart.Items ?? [];
    if (!items.length) return NextResponse.json({ error: "Panier vide" }, { status: 400 });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const item of items) {
      const productId = item.productId;
      const quantity = item.quantity;
      if (typeof productId !== "string" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json({ error: "Panier invalide" }, { status: 400 });
      }
      const product = await getProductById(productId);
      if (!product || product.stock < quantity || !Number.isFinite(product.price) || product.price <= 0) {
        return NextResponse.json({ error: "Produit indisponible ou stock insuffisant" }, { status: 409 });
      }
      line_items.push({
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: { name: product.name, metadata: { productId } },
        },
      });
    }

    const stripe = new Stripe(stripeKey);
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: email,
      success_url: `${appUrl}/cart?payment=success`,
      cancel_url: `${appUrl}/cart?payment=cancelled`,
      metadata: { userId: email },
    });
    return NextResponse.json({ url: checkout.url });
  } catch {
    return NextResponse.json({ error: "Checkout non configuré ou indisponible" }, { status: 503 });
  }
}
