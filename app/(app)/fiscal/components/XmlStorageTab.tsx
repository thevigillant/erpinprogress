"use client";

import { useState, useEffect } from "react";
import {
  FileCode2,
  Search,
  Download,
  Eye,
  Trash2,
  HardDrive,
  FileCheck,
  FileX,
  FileWarning,
  Clock,
  X,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface XmlRecord {
  id: string;
  notaFiscalId: string;
  tipo: string;
  xmlContent: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  notaFiscal: {
    numero: string;
    serie: string;
    tipo: string;
    destinatario: string;
    status: string;
    valorTotal: number;
  };
}

const tipoXmlConfig: Record<string, { icon: React.ElementType; bg: string; text: string; border: string; label: string }> = {
  autorizacao: { icon: FileCheck, bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", label: "Autorização" },
  cancelamento: { icon: FileX, bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", label: "Cancelamento" },
  inutilizacao: { icon: FileWarning, bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", label: "Inutilização" },
  evento: { icon: Clock, bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Evento" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function XmlStorageTab() {
  const [xmls, setXmls] = useState<XmlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [viewingXml, setViewingXml] = useState<XmlRecord | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/fiscal/xmls")
      .then((r) => r.json())
      .then((data) => { setXmls(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = xmls.filter((x) => {
    const matchSearch =
      x.fileName.toLowerCase().includes(search.toLowerCase()) ||
      x.notaFiscal.numero.includes(search) ||
      x.notaFiscal.destinatario.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === "Todos" || x.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  // Stats
  const totalSize = xmls.reduce((a, x) => a + x.fileSize, 0);
  const autorizados = xmls.filter((x) => x.tipo === "autorizacao").length;
  const cancelamentos = xmls.filter((x) => x.tipo === "cancelamento").length;

  const stats = [
    { label: "Total de XMLs", value: xmls.length, icon: FileCode2, color: "text-emerald-400" },
    { label: "Armazenamento", value: formatSize(totalSize), icon: HardDrive, color: "text-blue-400" },
    { label: "Autorizações", value: autorizados, icon: FileCheck, color: "text-cyan-400" },
    { label: "Cancelamentos", value: cancelamentos, icon: FileX, color: "text-rose-400" },
  ];

  const handleCopy = () => {
    if (viewingXml) {
      navigator.clipboard.writeText(viewingXml.xmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (xml: XmlRecord) => {
    const blob = new Blob([xml.xmlContent], { type: "text/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = xml.fileName || `${xml.notaFiscal.numero}-${xml.tipo}.xml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Armazenamento de XMLs</h2>
          <p className="text-sm text-slate-500">XMLs de NF-e autorizadas, cancelamentos e eventos</p>
        </div>
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
            placeholder="Buscar por arquivo, nº da nota ou destinatário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600"
          />
        </div>
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          <option value="Todos">Todos os Tipos</option>
          <option value="autorizacao">Autorização</option>
          <option value="cancelamento">Cancelamento</option>
          <option value="inutilizacao">Inutilização</option>
          <option value="evento">Evento</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">Nenhum XML encontrado</div>
        ) : (
          filtered.map((xml) => {
            const tc = tipoXmlConfig[xml.tipo] || tipoXmlConfig.autorizacao;
            const TipoIcon = tc.icon;
            return (
              <div key={xml.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-2.5 rounded-xl", tc.bg)}>
                    <TipoIcon size={20} className={tc.text} />
                  </div>
                  <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider", tc.bg, tc.text, tc.border)}>
                    {tc.label}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-bold text-white mb-0.5">{xml.fileName}</div>
                  <div className="text-[11px] text-slate-500">NF {xml.notaFiscal.numero} — {xml.notaFiscal.destinatario}</div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-4">
                  <span>{formatSize(xml.fileSize)}</span>
                  <span>{formatDate(xml.createdAt)}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setViewingXml(xml)} className="flex-1 bg-slate-800 text-slate-300 hover:text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                    <Eye size={12} /> Visualizar
                  </button>
                  <button onClick={() => handleDownload(xml)} className="flex-1 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all">
                    <Download size={12} /> Baixar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* XML Viewer Modal */}
      {viewingXml && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FileCode2 size={20} className="text-emerald-500" />
                  {viewingXml.fileName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">NF {viewingXml.notaFiscal.numero} — {formatSize(viewingXml.fileSize)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all",
                  copied ? "bg-emerald-600/20 text-emerald-400" : "bg-slate-800 text-slate-400 hover:text-white"
                )}>
                  {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                </button>
                <button onClick={() => setViewingXml(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[50vh]">
              {viewingXml.xmlContent}
            </pre>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setViewingXml(null)} className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-sm font-bold transition-all hover:text-white">
                Fechar
              </button>
              <button onClick={() => handleDownload(viewingXml)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
                <Download size={16} /> Baixar XML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
