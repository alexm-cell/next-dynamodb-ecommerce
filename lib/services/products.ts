import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db, requiredEnv } from "@/lib/dynamodb";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  if (!process.env.PRODUCTS_TABLE) {
    if (process.env.NODE_ENV !== "production") return MOCK_PRODUCTS;
    throw new Error("PRODUCTS_TABLE non configurée");
  }
  const result = await db.send(new ScanCommand({
    TableName: requiredEnv("PRODUCTS_TABLE"),
  }));
  return (result.Items ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!process.env.PRODUCTS_TABLE) {
    if (process.env.NODE_ENV !== "production") {
      return MOCK_PRODUCTS.find(p => p.productId === id) ?? null;
    }
    throw new Error("PRODUCTS_TABLE non configurée");
  }
  const result = await db.send(new GetCommand({
    TableName: requiredEnv("PRODUCTS_TABLE"),
    Key: { productId: id },
  }));
  return (result.Item as Product | undefined) ?? null;
}
