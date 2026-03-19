import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await (prisma as any).product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json({ detail: "Erro interno" }, { status: 500 });
  }
}
