import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, requiredEnv } from "@/lib/dynamodb";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const stripe = new Stripe(requiredEnv("STRIPE_SECRET_KEY"));
    const signature = request.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ error: "Signature manquante" }, { status: 400 });

    const event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      requiredEnv("STRIPE_WEBHOOK_SECRET"),
    );

    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object as Stripe.Checkout.Session;
      if (checkout.payment_status !== "paid" || !checkout.metadata?.userId) {
        return NextResponse.json({ error: "Paiement non confirmé" }, { status: 400 });
      }

      await db.send(new PutCommand({
        TableName: requiredEnv("ORDERS_TABLE"),
        Item: {
          orderId: checkout.id,
          userId: checkout.metadata.userId,
          paymentStatus: checkout.payment_status,
          amountTotal: checkout.amount_total,
          currency: checkout.currency,
          createdAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(orderId)",
      })).catch(async (error: unknown) => {
        // Un webhook rejoué ne doit pas créer une seconde commande.
        if (error && typeof error === "object" && "name" in error &&
            error.name === "ConditionalCheckFailedException") return;
        throw error;
      });
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook invalide ou stockage non configuré" }, { status: 400 });
  }
}
