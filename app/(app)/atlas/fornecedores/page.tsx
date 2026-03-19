"use client";

import { useState, useEffect, useRef } from "react";
import {
  Building2, Search, Plus, Trash2, RefreshCw, CheckCircle2,
  AlertCircle, MapPin, Phone, Mail, Calendar, DollarSign,
  Briefcase, X, Eye, Edit3, Save, Star, ChevronDown
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Supplier {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  category: string;
  situacao: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  porte: string;
  natureza_juridica: string;
  atividade_principal: string;
  data_abertura: string;
  capital_social: string;
  obs: string;
  registered_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function maskCNPJ(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function situacaoBadge(s: string) {
  const lower = (s || "").toLowerCase();
  if (lower.includes("ativa")) return { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: s || "ATIVA" };
  if (lower.includes("baixada") || lower.includes("cancelada")) return { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: s || "BAIXADA" };
  return { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: s || "IRREGULAR" };
}

function formatDate(d: string) {
  if (!d) return "—";
  if (d.includes("-")) {
    const [y, m, dd] = d.split("-");
    return `${dd}/${m}/${y}`;
  }
  return d;
}

function formatCapital(v: string) {
  const n = parseFloat(v);
  if (!n) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── InfoBox ──────────────────────────────────────────────────────────────────
function InfoBox({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`p-3 rounded-xl border ${accent ? "border-orange-500/20 bg-orange-500/5" : "border-slate-700/50 bg-slate-800/30"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${accent ? "text-orange-400" : "text-slate-500"}`}>{label}</p>
      <p className={`font-bold text-sm ${accent ? "text-orange-400" : "text-slate-100"}`}>{value || "—"}</p>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ supplier: s, onClose, onDeleted }: { supplier: Supplier | null; onClose: () => void; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);
  const [obs, setObs] = useState(s?.obs || "");
  const [email, setEmail] = useState(s?.email || "");
  const [telefone, setTelefone] = useState(s?.telefone || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setObs(s?.obs || ""); setEmail(s?.email || ""); setTelefone(s?.telefone || ""); setEditing(false);
  }, [s]);

  if (!s) return null;
  const badge = situacaoBadge(s.situacao);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/atlas/suppliers/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ obs, email, telefone }),
    });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm) return setConfirm(true);
    setDeleting(true);
    await fetch(`/api/atlas/suppliers/${s.id}`, { method: "DELETE" });
    setDeleting(false);
    onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700/50 rounded-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ animation: "fadeIn 0.2s ease" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              s.category === "FILIAL" ? "bg-blue-500/10" : 
              s.category === "CLIENTE" ? "bg-emerald-500/10" :
              s.category === "OUTROS" ? "bg-slate-500/10" :
              "bg-orange-500/10"}`}>
              <Building2 size={28} className={
                s.category === "FILIAL" ? "text-blue-400" : 
                s.category === "CLIENTE" ? "text-emerald-400" :
                s.category === "OUTROS" ? "text-slate-400" :
                "text-orange-400"} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-lg font-black text-white">{s.nome_fantasia || s.razao_social}</h2>
                {s.category && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    s.category === "FILIAL" ? "border-blue-500/30 text-blue-400 bg-blue-500/5" : 
                    s.category === "CLIENTE" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
                    s.category === "OUTROS" ? "border-slate-500/30 text-slate-400 bg-slate-500/5" :
                    "border-orange-500/30 text-orange-400 bg-orange-500/5"}`}>
                    {s.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">{s.razao_social}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badge.bg} ${badge.color}`}>{badge.label}</span>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Dados principais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoBox label="CNPJ" value={s.cnpj} accent />
            <InfoBox label="Abertura" value={formatDate(s.data_abertura)} />
            <InfoBox label="Porte" value={s.porte} />
            <InfoBox label="Capital Social" value={formatCapital(s.capital_social)} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <InfoBox label="Natureza Jurídica" value={s.natureza_juridica} />
            <InfoBox label="Atividade Principal" value={s.atividade_principal} />
          </div>

          {/* Endereço */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Endereço</span>
            </div>
            <p className="text-white font-medium text-sm">
              {[s.logradouro, s.numero, s.complemento].filter(Boolean).join(", ")}
              {s.bairro ? ` — ${s.bairro}` : ""}
            </p>
            <p className="text-slate-400 text-sm">{[s.municipio, s.uf].filter(Boolean).join(" / ")}{s.cep ? ` — CEP ${s.cep}` : ""}</p>
          </div>

          {/* Contatos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                <Phone size={12} /> Telefone
              </label>
              {editing
                ? <input className="atlas-erp-input w-full" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
                : <p className="text-white font-medium text-sm">{s.telefone || "—"}</p>}
            </div>
            <div>
              <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                <Mail size={12} /> E-mail
              </label>
              {editing
                ? <input className="atlas-erp-input w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.com" />
                : <p className="text-white font-medium text-sm">{s.email || "—"}</p>}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Observações Internas</label>
            {editing
              ? <textarea className="atlas-erp-input w-full" rows={3} value={obs} onChange={e => setObs(e.target.value)} placeholder="Anotações sobre este fornecedor..." />
              : <p className="text-slate-400 text-sm min-h-[40px]">{obs || "Nenhuma observação."}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {editing
                ? <>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-500 transition-all">
                    {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} Salvar
                  </button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 text-slate-400 text-sm font-bold border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">Cancelar</button>
                </>
                : <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 text-slate-300 text-sm font-bold border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                  <Edit3 size={14} /> Editar
                </button>
              }
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${confirm ? "bg-red-600 text-white" : "text-red-400 border border-red-500/30 hover:bg-red-500/10"}`}
            >
              {deleting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {confirm ? "Confirmar exclusão" : "Remover"}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>
  );
}

// ─── Supplier Card ─────────────────────────────────────────────────────────────
function SupplierCard({ s, onClick }: { s: Supplier; onClick: () => void }) {
  const badge = situacaoBadge(s.situacao);
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-5 cursor-pointer transition-all group overflow-hidden relative ${
        s.category === "FILIAL" ? "hover:border-blue-500/40 hover:shadow-blue-500/5" : 
        s.category === "CLIENTE" ? "hover:border-emerald-500/40 hover:shadow-emerald-500/5" :
        s.category === "OUTROS" ? "hover:border-slate-500/40 hover:shadow-slate-500/5" :
        "hover:border-orange-500/40 hover:shadow-orange-500/5"} hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-xl ${
          s.category === "FILIAL" ? "bg-blue-500/10" : 
          s.category === "CLIENTE" ? "bg-emerald-500/10" :
          s.category === "OUTROS" ? "bg-slate-500/10" :
          "bg-orange-500/10"}`}>
          <Building2 size={20} className={
            s.category === "FILIAL" ? "text-blue-400" : 
            s.category === "CLIENTE" ? "text-emerald-400" :
            s.category === "OUTROS" ? "text-slate-400" :
            "text-orange-400"} />
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${badge.bg} ${badge.color}`}>{badge.label}</span>
          {s.category && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
              s.category === "FILIAL" ? "border-blue-500/30 text-blue-400 bg-blue-500/5" : 
              s.category === "CLIENTE" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
              s.category === "OUTROS" ? "border-slate-500/30 text-slate-400 bg-slate-500/5" :
              "border-orange-500/30 text-orange-400 bg-orange-500/5"}`}>
              {s.category}
            </span>
          )}
        </div>
      </div>
      <h3 className="font-bold text-white text-sm mb-1 truncate">{s.nome_fantasia || s.razao_social}</h3>
      <p className="text-slate-400 text-xs mb-3 truncate">{s.razao_social}</p>
      <code className={`${
        s.category === "FILIAL" ? "text-blue-400 bg-blue-500/8" : 
        s.category === "CLIENTE" ? "text-emerald-400 bg-emerald-500/8" :
        s.category === "OUTROS" ? "text-slate-400 bg-slate-500/8" :
        "text-orange-400 bg-orange-500/8"} text-xs px-2 py-1 rounded-md`}>{s.cnpj}</code>
      <div className="flex items-center gap-1 mt-3">
        <MapPin size={11} className="text-slate-500" />
        <span className="text-xs text-slate-500">{[s.municipio, s.uf].filter(Boolean).join(" / ") || "—"}</span>
      </div>
      <div className="flex items-center justify-end mt-3">
        <span className={`text-xs ${
          s.category === "FILIAL" ? "text-blue-400" : 
          s.category === "CLIENTE" ? "text-emerald-400" :
          s.category === "OUTROS" ? "text-slate-400" :
          "text-orange-400"} font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <Eye size={12} /> Ver detalhes
        </span>
      </div>
    </div>
  );
}

// ─── CNPJ Lookup Panel ────────────────────────────────────────────────────────
function LookupPanel({ onCadastrado }: { onCadastrado: () => void }) {
  const [cnpj, setCnpj] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [data, setData] = useState<any>(null);
  const [errMsg, setErrMsg] = useState("");
  const [obs, setObs] = useState("");
  const [category, setCategory] = useState<"FORNECEDOR" | "FILIAL" | "CLIENTE" | "OUTROS">("FORNECEDOR");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLookup = async () => {
    const digits = cnpj.replace(/\D/g, "");
    if (digits.length !== 14) { setErrMsg("Digite um CNPJ com 14 dígitos."); setStatus("error"); return; }
    setStatus("loading"); setData(null); setSaved(false); setObs("");
    try {
      const res = await fetch(`/api/atlas/suppliers/cnpj/${digits}`);
      if (!res.ok) throw new Error((await res.json()).detail);
      setData(await res.json()); setStatus("found");
    } catch (e: any) {
      setErrMsg(e?.message || "Erro ao consultar CNPJ."); setStatus("error");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/atlas/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, obs, category }),
      });
      if (!res.ok) throw new Error();
      setSaved(true); onCadastrado();
    } catch { setErrMsg("Erro ao salvar cadastro."); setStatus("error"); }
    setSaving(false);
  };

  return (
    <div className="bg-slate-900/80 border border-orange-500/30 rounded-2xl p-6 mb-6 border-t-[3px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 rounded-xl bg-orange-500/10"><Search size={22} className="text-orange-400" /></div>
        <div>
          <h3 className="font-bold text-white">Consultar CNPJ</h3>
          <p className="text-xs text-slate-500">Powered by BrasilAPI · Receita Federal</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text" className="atlas-erp-input flex-1" placeholder="00.000.000/0000-00"
          value={cnpj} maxLength={18}
          onChange={e => { setCnpj(maskCNPJ(e.target.value)); setStatus("idle"); setSaved(false); }}
          onKeyDown={e => e.key === "Enter" && handleLookup()}
        />
        <button
          onClick={handleLookup} disabled={status === "loading"}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all disabled:opacity-60"
        >
          {status === "loading" ? <><RefreshCw size={16} className="animate-spin" /> Consultando...</> : <><Search size={16} /> Consultar</>}
        </button>
      </div>

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <p className="text-sm text-slate-200">{errMsg}</p>
        </div>
      )}

      {status === "found" && data && (
        <div className="mt-4 space-y-4">
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            {/* Category Selector */}
            <div className="flex flex-wrap items-center gap-2 mb-5 p-2 bg-slate-900/50 rounded-xl w-fit">
              <button 
                onClick={() => setCategory("FORNECEDOR")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${category === "FORNECEDOR" ? "bg-orange-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                FORNECEDOR
              </button>
              <button 
                onClick={() => setCategory("FILIAL")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${category === "FILIAL" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                FILIAL
              </button>
              <button 
                onClick={() => setCategory("CLIENTE")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${category === "CLIENTE" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                CLIENTE
              </button>
              <button 
                onClick={() => setCategory("OUTROS")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${category === "OUTROS" ? "bg-slate-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                OUTROS
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-orange-500/10"><Building2 size={24} className="text-orange-400" /></div>
              <div>
                <h4 className="font-black text-white">{data.nome_fantasia || data.razao_social}</h4>
                <p className="text-sm text-slate-400">{data.razao_social}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <InfoBox label="CNPJ" value={data.cnpj} accent />
              <InfoBox label="Abertura" value={formatDate(data.data_abertura)} />
              <InfoBox label="Porte" value={data.porte} />
              <InfoBox label="Capital" value={formatCapital(data.capital_social)} />
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 text-sm">
              <div className="flex items-center gap-1 mb-1"><MapPin size={12} className="text-orange-400" /><span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Endereço</span></div>
              <p className="text-white">{[data.logradouro, data.numero].filter(Boolean).join(", ")}{data.bairro ? ` — ${data.bairro}` : ""}</p>
              <p className="text-slate-400 text-xs">{[data.municipio, data.uf].filter(Boolean).join(" / ")}</p>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Observações (opcional)</label>
            <textarea className="atlas-erp-input w-full" rows={2} placeholder="Anotações sobre este cadastro..." value={obs} onChange={e => setObs(e.target.value)} />
          </div>
          {saved
            ? <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <p className="font-bold text-white">Cadastro concluído com sucesso!</p>
            </div>
            : <button 
               onClick={handleSave} 
               disabled={saving} 
               className={`w-full flex items-center justify-center gap-2 py-3 text-white font-bold rounded-xl transition-all ${
                 category === "FORNECEDOR" ? "bg-orange-600 hover:bg-orange-500 shadow-orange-600/20" :
                 category === "FILIAL" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20" :
                 category === "CLIENTE" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20" :
                 "bg-slate-600 hover:bg-slate-500 shadow-slate-600/20"
               } shadow-lg`}
             >
              {saving ? <><RefreshCw size={16} className="animate-spin" /> Cadastrando...</> : <><Plus size={18} /> Cadastrar {
                category === "FORNECEDOR" ? "Fornecedor" : 
                category === "FILIAL" ? "Filial" : 
                category === "CLIENTE" ? "Cliente" : 
                "Outro"
              }</>}
            </button>
          }
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FornecedoresPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [showLookup, setShowLookup] = useState(false);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const url = search ? `/api/atlas/suppliers?search=${encodeURIComponent(search)}` : "/api/atlas/suppliers";
      const res = await fetch(url);
      setSuppliers(await res.json());
    } catch { }
    setLoading(false);
  };

  useEffect(() => { loadSuppliers(); }, [search]);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-orange-500/10">
              <Building2 size={28} className="text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Fornecedores</h1>
              <p className="text-sm text-slate-500">Cadastro e gestão via CNPJ · Atlas Enterprise</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold text-white">{suppliers.length} fornecedor{suppliers.length !== 1 ? "es" : ""}</span>
          </div>
          <button
            onClick={() => setShowLookup(v => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${showLookup ? "text-slate-400 border border-slate-700 hover:bg-slate-800" : "bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20"}`}
          >
            {showLookup ? <><X size={16} /> Fechar</> : <><Plus size={16} /> Novo Fornecedor</>}
          </button>
        </div>
      </div>

      {/* Lookup Panel */}
      {showLookup && <LookupPanel onCadastrado={() => { loadSuppliers(); }} />}

      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 max-w-md mb-6">
        <Search size={16} className="text-slate-500" />
        <input
          type="text" className="bg-transparent border-0 outline-none text-white text-sm w-full placeholder:text-slate-600"
          placeholder="Buscar por nome, CNPJ ou cidade..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        {search && <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white transition-colors"><X size={16} /></button>}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <RefreshCw size={40} className="text-orange-500 animate-spin mb-4" />
          <p className="text-slate-500">Carregando fornecedores...</p>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-5 rounded-full bg-orange-500/8 border-2 border-dashed border-orange-500/20 mb-6">
            <Building2 size={48} className="text-orange-400 opacity-40" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">{search ? "Nenhum fornecedor encontrado" : "Nenhum fornecedor cadastrado"}</h3>
          <p className="text-slate-500 mb-6">{search ? `Nenhum resultado para "${search}"` : "Clique em Novo Fornecedor para começar."}</p>
          {!showLookup && (
            <button onClick={() => setShowLookup(true)} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all">
              <Plus size={16} /> Consultar CNPJ
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {suppliers.map(s => (
            <SupplierCard key={s.id} s={s} onClick={() => setSelected(s)} />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <DetailModal
          supplier={selected}
          onClose={() => setSelected(null)}
          onDeleted={loadSuppliers}
        />
      )}

      <style>{`
        .atlas-erp-input {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 10px 14px;
          border-radius: 10px;
          outline: none;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .atlas-erp-input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
        }
        .atlas-erp-input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
}
