import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — Lista todas as notas fiscais
export async function GET() {
  try {
    const notas = await prisma.notaFiscal.findMany({
      orderBy: { dataEmissao: "desc" },
    });
    return NextResponse.json(notas);
  } catch (error) {
    console.error("Erro ao buscar notas fiscais:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
