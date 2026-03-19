import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const product = await (prisma as any).product.upsert({
      where: { gtin: data.gtin },
      update: {
        description: data.description,
        department: data.department,
        section: data.section,
        cost: data.cost,
        salePrice: data.sale_price,
        taxRate: data.tax_rate,
        ncm: data.ncm,
        cest: data.cest,
        suggestedPrice: data.suggested_price,
        aiReason: data.ai_reason,
      },
      create: {
        gtin: data.gtin,
        description: data.description,
        department: data.department,
        section: data.section,
        cost: data.cost,
        salePrice: data.sale_price,
        taxRate: data.tax_rate,
        ncm: data.ncm,
        cest: data.cest,
        suggestedPrice: data.suggested_price,
        aiReason: data.ai_reason,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro ao registrar produto no Atlas:", error);
    return NextResponse.json({ detail: "Erro ao registrar produto" }, { status: 500 });
  }
}
