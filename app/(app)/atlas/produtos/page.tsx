"use client";

import { useState, useEffect, useRef } from "react";
import {
  Barcode, Search, Save, X, Cpu, CheckCircle, Package,
  Tag, Layers, Percent, RefreshCw, Grid, List, Plus, Trash2
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  gtin: string;
  description: string;
  department: string;
  section: string;
  cost: number;
  salePrice: number;
  taxRate: number;
  ncm: string;
  cest: string;
  thumbnail: string | null;
  suggestedPrice: number;
  aiReason: string;
  createdAt: string;
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ p, onDelete }: { p: Product; onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-xl bg-orange-500/10">
          <Package size={20} className="text-orange-400" />
        </div>
        <code className="text-[10px] text-orange-400 bg-orange-500/8 px-2 py-1 rounded-md">{p.gtin}</code>
      </div>
      <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{p.description}</h3>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-800 text-slate-400">{p.department}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-800 text-slate-400">{p.section}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="p-2 rounded-xl bg-slate-800/40">
          <p className="text-[9px] text-slate-500 uppercase font-bold">Custo</p>
          <p className="text-sm font-bold text-white">{p.cost > 0 ? `R$ ${p.cost.toFixed(2)}` : "—"}</p>
        </div>
        <div className="p-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
          <p className="text-[9px] text-orange-400 uppercase font-bold">Venda</p>
          <p className="text-sm font-bold text-orange-400">{p.salePrice > 0 ? `R$ ${p.salePrice.toFixed(2)}` : "—"}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
        <span className="text-[10px] text-slate-600">ICMS: {p.taxRate > 0 ? `${p.taxRate}%` : "—"} · NCM: {p.ncm || "—"}</span>
        <button
          onClick={() => { if (!confirm) setConfirm(true); else onDelete(); }}
          className={`text-xs font-bold px-2 py-1 rounded-lg transition-all ${confirm ? "bg-red-600 text-white" : "text-red-400 hover:bg-red-500/10"}`}
        >
          {confirm ? "Confirmar" : <Trash2 size={12} />}
        </button>
      </div>
    </div>
  );
}

// ─── Catalog Search Form ────────────────────────────────────────────────────────
function CatalogForm({ onSaved }: { onSaved: () => void }) {
  const [gtin, setGtin] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [desc, setDesc] = useState("");
  const [dept, setDept] = useState("DIVERSOS");
  const [sect, setSect] = useState("OUTROS");
  const [cost, setCost] = useState("");
  const [sale, setSale] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [ncm, setNcm] = useState("");
  const [cest, setCest] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gtin) return;
    setLoading(true); setProductData(null); setSuccess(false);
    try {
      const res = await fetch(`/api/atlas/products/search/${gtin}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setProductData(data);
      setDesc(data.description || "");
      setDept(data.department || "DIVERSOS");
      setSect(data.section || "OUTROS");
      setNcm(data.ncm || "");
      setCest(data.cest || "");
    } catch (err: any) {
      alert(err.message || "GTIN não encontrado");
    } finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/atlas/products/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gtin, description: desc, department: dept, section: sect,
          cost: parseFloat(cost) || 0, sale_price: parseFloat(sale) || 0,
          tax_rate: parseFloat(taxRate.replace(",", ".")) || 0, ncm, cest,
          suggested_price: productData?.suggested_price || 0,
          ai_reason: productData?.ai_reason || "",
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      onSaved();
      setTimeout(() => { setProductData(null); setGtin(""); setSuccess(false); }, 2500);
    } catch { alert("Erro ao salvar produto"); }
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Busca */}
      <div className="lg:col-span-2">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Barcode size={18} className="text-orange-400" /> Busca Rápida por GTIN</h3>
          <form onSubmit={handleSearch}>
            <input
              type="text" className="atlas-erp-input w-full mb-3"
              placeholder="Código GTIN / EAN (ex: 789...)"
              value={gtin} onChange={e => setGtin(e.target.value)} disabled={loading}
            />
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all"
            >
              {loading ? <><RefreshCw size={16} className="animate-spin" /> Identificando...</> : <><Search size={16} /> Identificar Produto</>}
            </button>
          </form>

          {success && (
            <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle size={20} className="text-emerald-400" />
              <p className="font-bold text-white text-sm">Produto gravado com sucesso!</p>
            </div>
          )}

          {productData && !success && (
            <div className="mt-6 text-center">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-3 flex items-center justify-center h-48">
                {productData.thumbnail
                  ? <img src={productData.thumbnail} alt="Produto" className="max-h-full object-contain rounded" />
                  : <div className="text-slate-600"><Package size={56} className="mx-auto opacity-20" /><p className="text-xs mt-2">Sem imagem</p></div>
                }
              </div>
              <p className="text-sm font-bold text-white line-clamp-2">{productData.description}</p>
              <p className="text-xs text-orange-400 mt-1">Classificação identificada</p>
            </div>
          )}

          {!productData && !loading && (
            <div className="mt-8 text-center opacity-20">
              <Barcode size={72} className="mx-auto text-slate-400 mb-3" />
              <p className="text-sm text-slate-400">Aguardando entrada de dados...</p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="lg:col-span-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full">
          {!productData ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <Search size={56} className="text-slate-700 mb-4" />
              <h4 className="text-slate-500 font-bold">Nenhum produto em edição</h4>
              <p className="text-slate-600 text-sm mt-1">Pesquise por GTIN ao lado para liberar o formulário.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="label-atlas">Descrição de Cadastro</label>
                <input type="text" className="atlas-erp-input w-full text-lg font-bold" value={desc} onChange={e => setDesc(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-atlas">Departamento</label>
                  <input type="text" className="atlas-erp-input w-full" value={dept} onChange={e => setDept(e.target.value)} />
                </div>
                <div>
                  <label className="label-atlas">Seção</label>
                  <input type="text" className="atlas-erp-input w-full" value={sect} onChange={e => setSect(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-atlas">Custo (R$)</label>
                  <input type="number" step="0.01" className="atlas-erp-input w-full" placeholder="0.00" value={cost} onChange={e => setCost(e.target.value)} />
                </div>
                <div>
                  <label className="label-atlas text-orange-400">Preço de Venda (R$)</label>
                  <input type="number" step="0.01" className="atlas-erp-input w-full" placeholder="0.00" value={sale} onChange={e => setSale(e.target.value)} />
                </div>
              </div>

              {productData.suggested_price > 0 && (
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-600"><Cpu size={18} className="text-white" /></div>
                    <div>
                      <p className="text-sm font-bold text-white">Sugestão Atlas AI: <span className="text-orange-400">R$ {productData.suggested_price.toFixed(2)}</span></p>
                      <p className="text-xs text-slate-500 italic">{productData.ai_reason}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSale(productData.suggested_price.toFixed(2))} className="px-4 py-1.5 text-xs font-bold border border-orange-500/40 text-orange-400 rounded-full hover:bg-orange-500/10 transition-all">APLICAR</button>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 border-t border-slate-800 pt-4">
                  <span className="text-orange-500">|</span> Tributação
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label-atlas">Alíquota ICMS (%)</label>
                    <input type="number" step="0.01" className="atlas-erp-input w-full" placeholder="18.00" value={taxRate} onChange={e => setTaxRate(e.target.value)} required />
                  </div>
                  <div>
                    <label className="label-atlas">NCM</label>
                    <input type="text" className="atlas-erp-input w-full" value={ncm} onChange={e => setNcm(e.target.value)} />
                  </div>
                  <div>
                    <label className="label-atlas">CEST</label>
                    <input type="text" className="atlas-erp-input w-full" value={cest} onChange={e => setCest(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all text-base">
                  <Save size={18} /> {saving ? "Salvando..." : "Efetuar Cadastro Oficial"}
                </button>
                <button type="button" onClick={() => setProductData(null)} className="px-4 py-3 border border-slate-700 text-slate-400 rounded-xl hover:bg-slate-800 transition-all">
                  <X size={18} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"catalogo" | "lista">("catalogo");
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/atlas/products");
      if (res.ok) setProducts(await res.json());
    } catch { }
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/atlas/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  const filtered = products.filter(p =>
    !search ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.gtin.includes(search) ||
    p.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-orange-500/10">
            <Package size={28} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Produtos</h1>
            <p className="text-sm text-slate-500">Catalogação inteligente via GTIN · Atlas Enterprise</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-1.5">
          {[{ id: "catalogo", label: "Catalogar", icon: Barcode }, { id: "lista", label: "Catálogo", icon: Grid }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-slate-400 hover:text-white"}`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "catalogo" && <CatalogForm onSaved={loadProducts} />}

      {activeTab === "lista" && (
        <>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 max-w-md mb-6">
            <Search size={16} className="text-slate-500" />
            <input type="text" className="bg-transparent border-0 outline-none text-white text-sm w-full placeholder:text-slate-600"
              placeholder="Buscar por descrição, GTIN ou departamento..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} className="text-slate-500 hover:text-white"><X size={16} /></button>}
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <RefreshCw size={40} className="text-orange-500 animate-spin mb-4" />
              <p className="text-slate-500">Carregando produtos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="p-5 rounded-full bg-orange-500/8 border-2 border-dashed border-orange-500/20 mb-6">
                <Package size={48} className="text-orange-400 opacity-40" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}</h3>
              <p className="text-slate-500">
                {search ? `Nenhum resultado para "${search}"` : "Vá para a aba Catalogar para adicionar produtos."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} p={p} onDelete={() => handleDelete(p.id)} />
              ))}
            </div>
          )}
        </>
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
        .label-atlas {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
