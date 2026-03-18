"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Download,
  FileSpreadsheet,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  BarChart3,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountingExport {
  id: string;
  periodo: string;
  tipo: string;
  status: string;
  fileName: string;
  totalNotas: number;
  valorTotal: number;
  exportedBy: string;
  errorMsg: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { icon: React.ElementType; bg: string; text: string; border: string; label: string }> = {
  exportado: { icon: CheckCircle2, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Exportado" },
  gerado: { icon: RefreshCw, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Gerado" },
  pendente: { icon: Clock, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Pendente" },
  erro: { icon: AlertCircle, bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", label: "Erro" },
};

const tipoConfig: Record<string, { bg: string; text: string; border: string }> = {
  SPED: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  EFD: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  DCTF: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  SINTEGRA: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
  CUSTOM: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatPeriodo(p: string) {
  const [year, month] = p.split("-");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AccountingExportTab() {
  const [exports, setExports] = useState<AccountingExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");

  useEffect(() => {
    fetch("/api/fiscal/exports")
      .then((r) => r.json())
      .then((data) => { setExports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = exports.filter((e) => {
    const matchTipo = filterTipo === "Todos" || e.tipo === filterTipo;
    const matchStatus = filterStatus === "Todos" || e.status === filterStatus;
    return matchTipo && matchStatus;
  });

  // Stats
  const totalExported = exports.filter((e) => e.status === "exportado").length;
  const totalPending = exports.filter((e) => e.status === "pendente").length;
  const totalValue = exports.filter((e) => e.status === "exportado").reduce((a, e) => a + e.valorTotal, 0);
  const totalNotas = exports.filter((e) => e.status === "exportado").reduce((a, e) => a + e.totalNotas, 0);

  const stats = [
    { label: "Exportados", value: totalExported, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Pendentes", value: totalPending, icon: Clock, color: "text-amber-400" },
    { label: "Valor Total", value: formatCurrency(totalValue), icon: Banknote, color: "text-blue-400" },
    { label: "Notas Processadas", value: totalNotas.toLocaleString("pt-BR"), icon: BarChart3, color: "text-violet-400" },
  ];

  // Grouped by period
  const periodos = [...new Set(exports.map((e) => e.periodo))].sort().reverse();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Exportação Contábil</h2>
          <p className="text-sm text-slate-500">SPED, EFD, DCTF, SINTEGRA e exportações customizadas</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
          <FileSpreadsheet size={18} /> Gerar Exportação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl bg-slate-800/80", s.color)}>
              <s.icon size={18} />
            </div>
            <div>
              <div className="text-lg font-black text-white">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          <option value="Todos">Todos os Tipos</option>
          <option value="SPED">SPED</option>
          <option value="EFD">EFD</option>
          <option value="DCTF">DCTF</option>
          <option value="SINTEGRA">SINTEGRA</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          <option value="Todos">Todos os Status</option>
          <option value="exportado">Exportado</option>
          <option value="gerado">Gerado</option>
          <option value="pendente">Pendente</option>
          <option value="erro">Erro</option>
        </select>
      </div>

      {/* Timeline by Period */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Carregando...</div>
      ) : (
        <div className="space-y-6">
          {periodos.map((periodo) => {
            const periodoExports = filtered.filter((e) => e.periodo === periodo);
            if (periodoExports.length === 0) return null;
            return (
              <div key={periodo}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={14} className="text-emerald-500" />
                  <h3 className="text-sm font-black text-white">{formatPeriodo(periodo)}</h3>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {periodoExports.map((exp) => {
                    const sc = statusConfig[exp.status] || statusConfig.pendente;
                    const tc = tipoConfig[exp.tipo] || tipoConfig.CUSTOM;
                    const StatusIcon = sc.icon;
                    return (
                      <div key={exp.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider", tc.bg, tc.text, tc.border)}>
                            {exp.tipo}
                          </span>
                          <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider inline-flex items-center gap-1", sc.bg, sc.text, sc.border)}>
                            <StatusIcon size={10} /> {sc.label}
                          </span>
                        </div>

                        {exp.status === "exportado" || exp.status === "gerado" ? (
                          <>
                            <div className="mb-3">
                              <div className="text-sm font-bold text-white">{exp.fileName}</div>
                              <div className="text-[11px] text-slate-500">por {exp.exportedBy} • {formatDate(exp.updatedAt)}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-slate-800/40 rounded-lg p-2.5 text-center">
                                <div className="text-sm font-black text-white">{exp.totalNotas}</div>
                                <div className="text-[9px] text-slate-500 uppercase">Notas</div>
                              </div>
                              <div className="bg-slate-800/40 rounded-lg p-2.5 text-center">
                                <div className="text-sm font-bold text-white">{formatCurrency(exp.valorTotal)}</div>
                                <div className="text-[9px] text-slate-500 uppercase">Valor</div>
                              </div>
                            </div>
                            <button className="w-full bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                              <Download size={12} /> Baixar Arquivo
                            </button>
                          </>
                        ) : exp.status === "pendente" ? (
                          <div className="text-center py-4">
                            <div className="text-sm text-slate-500 mb-3">Aguardando processamento</div>
                            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-lg shadow-emerald-600/20">
                              <RefreshCw size={12} /> Gerar Agora
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-sm text-rose-400 mb-1">Erro no processamento</div>
                            <div className="text-xs text-slate-500">{exp.errorMsg}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
