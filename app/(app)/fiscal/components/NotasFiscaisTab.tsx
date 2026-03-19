"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Eye,
  Download,
  XCircle,
  Plus,
  Receipt,
  Banknote,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Pencil,
  CalendarDays,
  Hash,
  Building2,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotaFiscal {
  id: string;
  numero: string;
  serie: string;
  tipo: string;
  natureza: string;
  status: string;
  chaveAcesso: string;
  protocolo: string;
  destinatario: string;
  cnpjDest: string;
  valorTotal: number;
  valorProdutos: number;
  valorIcms: number;
  valorPis: number;
  valorCofins: number;
  valorDesconto: number;
  valorFrete: number;
  dataEmissao: string;
  dataSaida: string | null;
  observacoes: string;
}

const statusConfig: Record<string, { icon: React.ElementType; bg: string; text: string; border: string; label: string }> = {
  emitida: { icon: CheckCircle2, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Paga" },
  rascunho: { icon: Pencil, bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", label: "Rascunho" },
  cancelada: { icon: XCircle, bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", label: "Cancelada" },
  inutilizada: { icon: Ban, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Vencida" },
};

const tipoConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  NFE: { label: "GNRE", icon: Landmark, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  NFCE: { label: "DARE", icon: Building2, bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  NFSE: { label: "DAS", icon: Receipt, bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function NotasFiscaisTab() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [selectedNota, setSelectedNota] = useState<NotaFiscal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    tipo: "NFE",
    destinatario: "",
    cnpjDest: "",
    natureza: "",
    valorProdutos: 0,
    valorIcms: 0,
    valorPis: 0,
    valorCofins: 0,
    valorDesconto: 0,
    valorFrete: 0,
    status: "rascunho",
  });

  useEffect(() => {
    fetch("/api/fiscal/notas")
      .then((r) => r.json())
      .then((data) => { setNotas(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = notas.filter((n) => {
    const matchSearch =
      n.numero.includes(search) ||
      n.destinatario.toLowerCase().includes(search.toLowerCase()) ||
      n.cnpjDest.includes(search) ||
      n.chaveAcesso.includes(search);
    const matchStatus = filterStatus === "Todos" || n.status === filterStatus;
    const matchTipo = filterTipo === "Todos" || n.tipo === filterTipo;
    return matchSearch && matchStatus && matchTipo;
  });

  // Stats
  const totalPagas = notas.filter((n) => n.status === "emitida").length;
  const totalValor = notas.filter((n) => n.status === "emitida").reduce((a, n) => a + n.valorTotal, 0);
  const totalImpostos = notas.filter((n) => n.status === "emitida").reduce((a, n) => a + n.valorIcms + n.valorPis + n.valorCofins, 0);
  const rascunhos = notas.filter((n) => n.status === "rascunho").length;

  const stats = [
    { label: "Guias Pagas", value: totalPagas, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Total Recolhido", value: formatCurrency(totalValor), icon: Banknote, color: "text-blue-400" },
    { label: "Tributos Totais", value: formatCurrency(totalImpostos), icon: AlertTriangle, color: "text-amber-400" },
    { label: "Pendentes", value: rascunhos, icon: Clock, color: "text-slate-400" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Guias Fiscais</h2>
          <p className="text-sm text-slate-500">Gerencie guias de recolhimento — GNRE, DARE, DAS e mais</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} /> Nova Guia
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nº da guia, contribuinte ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600"
          />
        </div>
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          <option value="Todos">Todos os Tipos</option>
          <option value="NFE">GNRE</option>
          <option value="NFCE">DARE</option>
          <option value="NFSE">DAS</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          <option value="Todos">Todos os Status</option>
          <option value="emitida">Paga</option>
          <option value="rascunho">Rascunho</option>
          <option value="cancelada">Cancelada</option>
          <option value="inutilizada">Vencida</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nº Guia</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contribuinte</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vencimento</th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">Nenhuma guia encontrada</td></tr>
            ) : (
              filtered.map((nf) => {
                const sc = statusConfig[nf.status] || statusConfig.rascunho;
                const tc = tipoConfig[nf.tipo] || tipoConfig.NFE;
                const StatusIcon = sc.icon;
                return (
                  <tr key={nf.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors cursor-pointer" onClick={() => setSelectedNota(nf)}>
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-white text-sm">{nf.numero}</div>
                      <div className="text-[10px] text-slate-500">Série {nf.serie}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider", tc.bg, tc.text, tc.border)}>
                        {tc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{nf.destinatario}</div>
                      <div className="text-[11px] font-mono text-slate-500">{nf.cnpjDest}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDate(nf.dataEmissao)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-white text-sm">{formatCurrency(nf.valorTotal)}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider inline-flex items-center gap-1", sc.bg, sc.text, sc.border)}>
                        <StatusIcon size={10} /> {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedNota(nf); }} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-800">
                          <Eye size={14} />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-800">
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedNota && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText size={20} className="text-emerald-500" />
                  Guia {selectedNota.numero}
                  <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ml-2",
                    (statusConfig[selectedNota.status] || statusConfig.rascunho).bg,
                    (statusConfig[selectedNota.status] || statusConfig.rascunho).text,
                    (statusConfig[selectedNota.status] || statusConfig.rascunho).border
                  )}>
                    {(statusConfig[selectedNota.status] || statusConfig.rascunho).label}
                  </span>
                </h3>
              </div>
              <button onClick={() => setSelectedNota(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <XCircle size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoField label="Tipo da Guia" value={(tipoConfig[selectedNota.tipo] || tipoConfig.NFE).label} />
              <InfoField label="Referência" value={selectedNota.natureza || "—"} />
              <InfoField label="Contribuinte" value={selectedNota.destinatario} />
              <InfoField label="CNPJ/CPF" value={selectedNota.cnpjDest} mono />
              <InfoField label="Vencimento" value={formatDate(selectedNota.dataEmissao)} />
              <InfoField label="Data Pagamento" value={selectedNota.dataSaida ? formatDate(selectedNota.dataSaida) : "—"} />
            </div>

            {selectedNota.chaveAcesso && (
              <div className="bg-slate-800/50 rounded-xl p-3 mb-6">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Código de Barras</div>
                <div className="font-mono text-xs text-emerald-400 break-all">{selectedNota.chaveAcesso}</div>
              </div>
            )}

            <div className="bg-slate-800/30 rounded-xl p-4 mb-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Composição da Guia</h4>
              <div className="grid grid-cols-2 gap-3">
                <ValueField label="Valor Principal" value={selectedNota.valorProdutos} />
                <ValueField label="Juros" value={selectedNota.valorFrete} />
                <ValueField label="Desconto" value={selectedNota.valorDesconto} negative />
                <ValueField label="ICMS" value={selectedNota.valorIcms} tax />
                <ValueField label="PIS" value={selectedNota.valorPis} tax />
                <ValueField label="COFINS" value={selectedNota.valorCofins} tax />
              </div>
              <div className="border-t border-slate-700 mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">TOTAL DA GUIA</span>
                <span className="text-xl font-black text-white">{formatCurrency(selectedNota.valorTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedNota(null)} className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-sm font-bold transition-all hover:text-white">
                Fechar
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
                <Download size={16} /> Baixar Guia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Plus size={24} className="text-emerald-500" /> Nova Guia de Imposto
              </h3>
              <button onClick={() => setIsCreating(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const total = formData.valorProdutos + formData.valorIcms + formData.valorPis + formData.valorCofins + formData.valorFrete - formData.valorDesconto;
              fetch("/api/fiscal/notas", {
                method: "POST",
                body: JSON.stringify({ ...formData, valorTotal: total }),
                headers: { "Content-Type": "application/json" }
              })
              .then(r => r.json())
              .then(data => {
                if (data.error) alert(data.error);
                else {
                  setNotas([data, ...notas]);
                  setIsCreating(false);
                }
              });
            }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Tipo da Guia</label>
                  <select 
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                  >
                    <option value="NFE">GNRE (Estadual)</option>
                    <option value="NFCE">DARE (Estadual)</option>
                    <option value="NFSE">DAS (Simples Nacional)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Número (opcional)</label>
                  <input 
                    type="text"
                    placeholder="000XXX"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Contribuinte / Nome Fantasia</label>
                  <input 
                    type="text"
                    required
                    placeholder="Nome da empresa ou pessoa"
                    value={formData.destinatario}
                    onChange={(e) => setFormData({...formData, destinatario: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">CNPJ do Responsável</label>
                  <input 
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={formData.cnpjDest}
                    onChange={(e) => setFormData({...formData, cnpjDest: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Referência Fiscal</label>
                  <input 
                    type="text"
                    placeholder="Mes/Ano ou Natureza"
                    value={formData.natureza}
                    onChange={(e) => setFormData({...formData, natureza: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>

              <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Composição de Valores</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase pl-1">Valor Principal (R$)</label>
                    <input type="number" step="0.01" value={formData.valorProdutos} onChange={(e)=>setFormData({...formData, valorProdutos: parseFloat(e.target.value) || 0})} className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase pl-1">ICMS (R$)</label>
                    <input type="number" step="0.01" value={formData.valorIcms} onChange={(e)=>setFormData({...formData, valorIcms: parseFloat(e.target.value) || 0})} className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase pl-1">PIS/COFINS (R$)</label>
                    <input type="number" step="0.01" value={formData.valorPis} onChange={(e)=>setFormData({...formData, valorPis: parseFloat(e.target.value) || 0})} className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase pl-1">Juros/Multa (R$)</label>
                    <input type="number" step="0.01" value={formData.valorFrete} onChange={(e)=>setFormData({...formData, valorFrete: parseFloat(e.target.value) || 0})} className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl text-sm font-bold transition-all hover:bg-slate-700">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/40">
                  Emitir Guia Fiscal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</div>
      <div className={cn("text-sm text-white font-semibold", mono && "font-mono")}>{value}</div>
    </div>
  );
}

function ValueField({ label, value, negative, tax }: { label: string; value: number; negative?: boolean; tax?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={cn(
        "text-sm font-bold font-mono",
        negative ? "text-rose-400" : tax ? "text-amber-400" : "text-white"
      )}>
        {negative && value > 0 ? "- " : ""}{formatCurrency(value)}
      </span>
    </div>
  );
}
