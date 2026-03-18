"use client";

import { useState, useEffect } from "react";
import {
  Calculator,
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  X,
  ArrowRightLeft,
  TrendingUp,
  Percent,
  Filter,
  MoreVertical,
  Save,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxRule {
  id: string;
  name: string;
  type: string;
  rate: number;
  cst: string;
  cfop: string;
  ncm: string;
  ufOrigem: string;
  ufDestino: string;
  active: boolean;
  description: string;
}

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  ICMS: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  PIS: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  COFINS: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  IPI: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  ISS: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

export default function TaxEngineTab() {
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [formData, setFormData] = useState({
    name: "", type: "ICMS", rate: 0, cst: "", cfop: "", ncm: "",
    ufOrigem: "", ufDestino: "", description: "",
  });

  useEffect(() => {
    fetch("/api/fiscal/tax-rules")
      .then((r) => r.json())
      .then((data) => { setRules(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredRules = rules.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Todos" || r.type === filterType;
    return matchSearch && matchType;
  });

  const handleSave = async () => {
    const url = editingRule
      ? `/api/fiscal/tax-rules/${editingRule.id}`
      : "/api/fiscal/tax-rules";
    const method = editingRule ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const updated = await res.json();
      if (editingRule) {
        setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        setRules((prev) => [updated, ...prev]);
      }
      closeModal();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/fiscal/tax-rules/${id}`, { method: "DELETE" });
    if (res.ok) setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggle = async (rule: TaxRule) => {
    const res = await fetch(`/api/fiscal/tax-rules/${rule.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rule, active: !rule.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    }
  };

  const openCreate = () => {
    setEditingRule(null);
    setFormData({ name: "", type: "ICMS", rate: 0, cst: "", cfop: "", ncm: "", ufOrigem: "", ufDestino: "", description: "" });
    setShowModal(true);
  };

  const openEdit = (rule: TaxRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name, type: rule.type, rate: rule.rate, cst: rule.cst, cfop: rule.cfop,
      ncm: rule.ncm, ufOrigem: rule.ufOrigem, ufDestino: rule.ufDestino, description: rule.description,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
  };

  // Estatísticas
  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.active).length;
  const avgIcms = rules.filter((r) => r.type === "ICMS" && r.active).reduce((acc, r) => acc + r.rate, 0) /
    (rules.filter((r) => r.type === "ICMS" && r.active).length || 1);

  const stats = [
    { label: "Total de Regras", value: totalRules, icon: Calculator, color: "text-emerald-400" },
    { label: "Regras Ativas", value: activeRules, icon: Check, color: "text-blue-400" },
    { label: "ICMS Médio", value: `${avgIcms.toFixed(1)}%`, icon: Percent, color: "text-amber-400" },
    { label: "Tipos", value: new Set(rules.map((r) => r.type)).size, icon: ArrowRightLeft, color: "text-violet-400" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Motor Tributário</h2>
          <p className="text-sm text-slate-500">Gerencie regras de ICMS, PIS, COFINS, IPI e ISS</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} /> Nova Regra
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
            placeholder="Pesquisar regra tributária..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-600"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/40 appearance-none cursor-pointer"
        >
          <option value="Todos">Todos os Tipos</option>
          <option value="ICMS">ICMS</option>
          <option value="PIS">PIS</option>
          <option value="COFINS">COFINS</option>
          <option value="IPI">IPI</option>
          <option value="ISS">ISS</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Regra</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tipo</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Alíquota</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CST</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CFOP</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">UF</th>
              <th className="text-left px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">Carregando...</td></tr>
            ) : filteredRules.length === 0 ? (
              <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-500 text-sm">Nenhuma regra encontrada</td></tr>
            ) : (
              filteredRules.map((rule) => {
                const tc = typeColors[rule.type] || typeColors.ICMS;
                return (
                  <tr key={rule.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">{rule.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{rule.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider", tc.bg, tc.text, tc.border)}>
                        {rule.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white font-mono">{rule.rate.toFixed(2)}%</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">{rule.cst || "—"}</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-400">{rule.cfop || "—"}</td>
                    <td className="px-6 py-4">
                      {rule.ufOrigem && rule.ufDestino ? (
                        <div className="flex items-center gap-1 text-sm text-slate-300">
                          <span className="font-bold">{rule.ufOrigem}</span>
                          <ArrowRightLeft size={12} className="text-slate-600" />
                          <span className="font-bold">{rule.ufDestino}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(rule)}
                        className={cn(
                          "text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider cursor-pointer transition-all",
                          rule.active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}
                      >
                        {rule.active ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(rule)} className="p-2 text-slate-500 hover:text-emerald-400 transition-colors rounded-lg hover:bg-slate-800">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(rule.id)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800">
                          <Trash2 size={14} />
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

      {/* Aliquotas Card */}
      <div className="mt-8 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl p-6">
        <h3 className="text-sm font-black text-emerald-400 mb-4 flex items-center gap-2">
          <TrendingUp size={16} /> Resumo Tributário por Tipo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["ICMS", "PIS", "COFINS", "IPI", "ISS"].map((type) => {
            const typeRules = rules.filter((r) => r.type === type && r.active);
            const avg = typeRules.length > 0
              ? typeRules.reduce((a, r) => a + r.rate, 0) / typeRules.length
              : 0;
            const tc = typeColors[type];
            return (
              <div key={type} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded border uppercase", tc.bg, tc.text, tc.border)}>
                  {type}
                </span>
                <div className="text-xl font-black text-white mt-3">{avg.toFixed(2)}%</div>
                <div className="text-[10px] text-slate-500 mt-1">{typeRules.length} regra(s)</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white">
                {editingRule ? "Editar Regra" : "Nova Regra Tributária"}
              </h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nome</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="Ex: ICMS SP Interno" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tipo</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                    <option value="ICMS">ICMS</option>
                    <option value="PIS">PIS</option>
                    <option value="COFINS">COFINS</option>
                    <option value="IPI">IPI</option>
                    <option value="ISS">ISS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Alíquota (%)</label>
                  <input type="number" step="0.01" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">CST</label>
                  <input type="text" value={formData.cst} onChange={(e) => setFormData({ ...formData, cst: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50" placeholder="00" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">CFOP</label>
                  <input type="text" value={formData.cfop} onChange={(e) => setFormData({ ...formData, cfop: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50" placeholder="5102" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">NCM</label>
                  <input type="text" value={formData.ncm} onChange={(e) => setFormData({ ...formData, ncm: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">UF Origem</label>
                  <input type="text" maxLength={2} value={formData.ufOrigem} onChange={(e) => setFormData({ ...formData, ufOrigem: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50" placeholder="SP" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">UF Destino</label>
                  <input type="text" maxLength={2} value={formData.ufDestino} onChange={(e) => setFormData({ ...formData, ufDestino: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50" placeholder="RJ" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Descrição</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 bg-slate-800 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm font-bold transition-all">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20">
                <Save size={16} /> {editingRule ? "Atualizar" : "Criar Regra"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
