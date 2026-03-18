import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — Lista todas as regras tributárias
export async function GET() {
  try {
    const rules = await prisma.taxRule.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rules);
  } catch (error) {
    console.error("Erro ao buscar regras tributárias:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST — Cria nova regra tributária
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, rate, cst, cfop, ncm, ufOrigem, ufDestino, description } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Nome e tipo são obrigatórios" }, { status: 400 });
    }

    const rule = await prisma.taxRule.create({
      data: {
        name,
        type,
        rate: parseFloat(rate) || 0,
        cst: cst || "",
        cfop: cfop || "",
        ncm: ncm || "",
        ufOrigem: ufOrigem || "",
        ufDestino: ufDestino || "",
        description: description || "",
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar regra tributária:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
