import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Busca todas as notas fiscais
    const notas = await prisma.notaFiscal.findMany({
      orderBy: { dataEmissao: "desc" },
    });

    // KPIs
    const emitidas = notas.filter((n) => n.status === "emitida");
    const totalFaturado = emitidas.reduce((a, n) => a + n.valorTotal, 0);
    const totalIcms = emitidas.reduce((a, n) => a + n.valorIcms, 0);
    const totalPis = emitidas.reduce((a, n) => a + n.valorPis, 0);
    const totalCofins = emitidas.reduce((a, n) => a + n.valorCofins, 0);
    const totalImpostos = totalIcms + totalPis + totalCofins;
    const cargaTributaria = totalFaturado > 0 ? (totalImpostos / totalFaturado) * 100 : 0;
    const notasCanceladas = notas.filter((n) => n.status === "cancelada").length;
    const mediaPorNota = emitidas.length > 0 ? totalFaturado / emitidas.length : 0;

    // Impostos por tipo
    const impostosPorTipo = [
      { tipo: "ICMS", valor: totalIcms, percentual: totalImpostos > 0 ? (totalIcms / totalImpostos) * 100 : 0 },
      { tipo: "PIS", valor: totalPis, percentual: totalImpostos > 0 ? (totalPis / totalImpostos) * 100 : 0 },
      { tipo: "COFINS", valor: totalCofins, percentual: totalImpostos > 0 ? (totalCofins / totalImpostos) * 100 : 0 },
    ];

    // Faturamento mensal — agrupa por mês
    const mesesMap = new Map<string, { faturamento: number; impostos: number }>();
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    for (const nota of emitidas) {
      if (!nota.dataEmissao) continue;
      const d = new Date(nota.dataEmissao);
      const key = `${months[d.getMonth()]}/${d.getFullYear()}`;
      const existing = mesesMap.get(key) || { faturamento: 0, impostos: 0 };
      existing.faturamento += nota.valorTotal;
      existing.impostos += nota.valorIcms + nota.valorPis + nota.valorCofins;
      mesesMap.set(key, existing);
    }

    const faturamentoMensal = Array.from(mesesMap.entries())
      .map(([mes, vals]) => ({ mes, ...vals }))
      .slice(-6);

    // Últimas notas
    const recentNotas = notas.slice(0, 5).map((n) => ({
      numero: n.numero,
      destinatario: n.destinatario,
      valor: n.valorTotal,
      status: n.status,
      dataEmissao: n.dataEmissao?.toISOString() || "",
    }));

    return NextResponse.json({
      kpis: {
        totalFaturado,
        totalImpostos,
        cargaTributaria,
        totalNotas: notas.length,
        notasCanceladas,
        mediaPorNota,
      },
      impostosPorTipo,
      faturamentoMensal,
      recentNotas,
    });
  } catch (error) {
    console.error("Erro ao buscar dashboard fiscal:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
