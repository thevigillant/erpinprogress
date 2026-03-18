import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — Lista todas as exportações contábeis
export async function GET() {
  try {
    const exports = await prisma.accountingExport.findMany({
      orderBy: [{ periodo: "desc" }, { tipo: "asc" }],
    });
    return NextResponse.json(exports);
  } catch (error) {
    console.error("Erro ao buscar exportações contábeis:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
