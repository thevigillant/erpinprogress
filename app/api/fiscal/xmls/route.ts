import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET — Lista todos os XMLs com dados da nota fiscal
export async function GET() {
  try {
    const xmls = await prisma.xmlStorage.findMany({
      include: {
        notaFiscal: {
          select: {
            numero: true,
            serie: true,
            tipo: true,
            destinatario: true,
            status: true,
            valorTotal: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(xmls);
  } catch (error) {
    console.error("Erro ao buscar XMLs:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
