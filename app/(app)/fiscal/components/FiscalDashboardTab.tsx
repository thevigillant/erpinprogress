"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Receipt,
  Percent,
  CalendarDays,
  Eye,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardData {
  kpis: {
    totalFaturado: number;
    totalImpostos: number;
    cargaTributaria: number;
    totalNotas: number;
    notasCanceladas: number;
    mediaPorNota: number;
  };
  impostosPorTipo: { tipo: string; valor: number; percentual: number }[];
  faturamentoMensal: { mes: string; faturamento: number; impostos: number }[];
  recentNotas: { numero: string; destinatario: string; valor: number; status: string; dataEmissao: string }[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function FiscalDashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fiscal/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 text-sm">Carregando dashboard...</div>;
  }

  if (!data) {
    return <div className="text-center py-20 text-slate-500 text-sm">Dados indisponíveis</div>;
  }

  const { kpis, impostosPorTipo, faturamentoMensal, recentNotas } = data;

  // Define max for bar charts
  const maxFaturamento = Math.max(...faturamentoMensal.map((f) => f.faturamento), 1);
  const maxImposto = Math.max(...impostosPorTipo.map((i) => i.valor), 1);

  const kpiCards = [
    { label: "Total Faturado", value: formatCurrency(kpis.totalFaturado), icon: Banknote, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total Impostos", value: formatCurrency(kpis.totalImpostos), icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Carga Tributária", value: `${kpis.cargaTributaria.toFixed(1)}%`, icon: Percent, color: "text-rose-400", bg: "bg-rose-500/10" },
    { label: "Total Notas", value: kpis.totalNotas.toLocaleString("pt-BR"), icon: Receipt, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Notas Canceladas", value: kpis.notasCanceladas.toString(), icon: FileText, color: "text-slate-400", bg: "bg-slate-500/10" },
    { label: "Média por Nota", value: formatCurrency(kpis.mediaPorNota), icon: BarChart3, color: "text-violet-400", bg: "bg-violet-500/10" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-1">Dashboard Fiscal</h2>
        <p className="text-sm text-slate-500">Visão geral consolidada dos dados fiscais da empresa</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2.5 rounded-xl", kpi.bg)}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
            </div>
            <div className="text-xl font-black text-white">{kpi.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Faturamento Mensal Bar Chart */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" /> Faturamento Mensal
          </h3>
          <p className="text-[11px] text-slate-500 mb-6">Faturamento vs Impostos — últimos meses</p>

          <div className="space-y-4">
            {faturamentoMensal.map((m) => (
              <div key={m.mes}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-400">{m.mes}</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(m.faturamento)}</span>
                </div>
                <div className="relative h-6 bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${(m.faturamento / maxFaturamento) * 100}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600/50 to-amber-400/50 rounded-full transition-all duration-500"
                    style={{ width: `${(m.impostos / maxFaturamento) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-amber-500 mt-0.5 text-right">
                  Impostos: {formatCurrency(m.impostos)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Faturamento
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></div> Impostos
            </div>
          </div>
        </div>

        {/* Impostos por Tipo */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
            <Percent size={16} className="text-amber-500" /> Impostos por Tipo
          </h3>
          <p className="text-[11px] text-slate-500 mb-6">Breakdown da carga tributária</p>

          <div className="space-y-5">
            {impostosPorTipo.map((imp) => {
              const colors: Record<string, string> = {
                ICMS: "from-blue-600 to-blue-400",
                PIS: "from-violet-600 to-violet-400",
                COFINS: "from-amber-600 to-amber-400",
                IPI: "from-cyan-600 to-cyan-400",
                ISS: "from-rose-600 to-rose-400",
              };
              return (
                <div key={imp.tipo}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">{imp.tipo}</span>
                      <span className="text-slate-500">({imp.percentual.toFixed(1)}%)</span>
                    </div>
                    <span className="font-mono font-bold text-white">{formatCurrency(imp.valor)}</span>
                  </div>
                  <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className={cn("absolute inset-y-0 left-0 bg-gradient-to-r rounded-full transition-all duration-500", colors[imp.tipo] || "from-slate-600 to-slate-400")}
                      style={{ width: `${(imp.valor / maxImposto) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Notas */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-black text-white mb-1 flex items-center gap-2">
          <Receipt size={16} className="text-blue-500" /> Últimas Notas Fiscais
        </h3>
        <p className="text-[11px] text-slate-500 mb-4">Emissões mais recentes</p>

        <div className="space-y-3">
          {recentNotas.map((nota) => {
            const statusColors: Record<string, string> = {
              emitida: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              cancelada: "text-rose-400 bg-rose-500/10 border-rose-500/20",
              rascunho: "text-slate-400 bg-slate-500/10 border-slate-500/20",
            };
            return (
              <div key={nota.numero} className="flex items-center justify-between bg-slate-800/30 rounded-xl p-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 p-2.5 rounded-xl">
                    <FileText size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">NF {nota.numero}</div>
                    <div className="text-[11px] text-slate-500">{nota.destinatario} — {formatDate(nota.dataEmissao)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider", statusColors[nota.status] || statusColors.rascunho)}>
                    {nota.status}
                  </span>
                  <span className="text-sm font-bold font-mono text-white">{formatCurrency(nota.valor)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
