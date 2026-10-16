import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/services/products";

export async function GET() {
  // Ne jamais exposer les données de démonstration comme un catalogue réel.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Catalogue de production non configuré." },
      { status: 503 }
    );
  }

  try {
    return NextResponse.json({
      success: true,
      data: await getAllProducts(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Impossible de charger le catalogue." },
      { status: 500 }
    );
  }
}
