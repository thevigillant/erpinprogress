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

// POST — Cria uma nova nota fiscal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Calcula o próximo número de guia se não for enviado
    let numero = body.numero;
    if (!numero) {
      const lastNota = await prisma.notaFiscal.findFirst({
        orderBy: { numero: "desc" },
      });
      const lastNum = lastNota ? parseInt(lastNota.numero) : 0;
      numero = (lastNum + 1).toString().padStart(6, "0");
    }

    const novaNota = await prisma.notaFiscal.create({
      data: {
        numero,
        serie: body.serie || "1",
        tipo: body.tipo || "NFE",
        natureza: body.natureza || "Venda de Mercadorias",
        status: body.status || "rascunho",
        destinatario: body.destinatario || "CASH ERP Solutions",
        cnpjDest: body.cnpjDest || "00.000.000/0001-00",
        valorTotal: parseFloat(body.valorTotal) || 0,
        valorProdutos: parseFloat(body.valorProdutos) || 0,
        valorIcms: parseFloat(body.valorIcms) || 0,
        valorPis: parseFloat(body.valorPis) || 0,
        valorCofins: parseFloat(body.valorCofins) || 0,
        valorDesconto: parseFloat(body.valorDesconto) || 0,
        valorFrete: parseFloat(body.valorFrete) || 0,
        chaveAcesso: body.chaveAcesso || Math.random().toString().substring(2, 12).padStart(44, "0"),
        dataEmissao: body.dataEmissao ? new Date(body.dataEmissao) : new Date(),
        observacoes: body.observacoes || "",
      },
    });

    return NextResponse.json(novaNota, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "Número de guia já existente" }, { status: 400 });
    }
    console.error("Erro ao criar guia fiscal:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
