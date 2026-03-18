"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit3,
  Save,
  X,
  Plus,
  Database,
  FileText,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────
interface Empresa {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  email: string;
  telefone: string;
  website: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  regimeTributario: string;
}

interface Unidade {
  id: string;
  nome: string;
  cnpj: string;
  tipo: "Matriz" | "Filial" | "CD";
  status: "Ativa" | "Inativa" | "Manutenção";
  endereco: string;
  responsavel: string;
}

// ── Dados Mock ──────────────────────────────────────
const initialEmpresa: Empresa = {
  razaoSocial: "ERP Varejo Global S.A",
  nomeFantasia: "ERP Global",
  cnpj: "12.345.678/0001-90",
  inscricaoEstadual: "123.456.789.000",
  email: "contato@erpglobal.com.br",
  telefone: "(11) 3000-4000",
  website: "www.erpglobal.com.br",
  endereco: "Av. Paulista, 1500 - 20° Andar",
  cidade: "São Paulo",
  estado: "SP",
  cep: "01310-100",
  regimeTributario: "Lucro Real",
};

const initialUnidades: Unidade[] = [
  {
    id: "UNI-001",
    nome: "Loja 01 - Matriz Centro",
    cnpj: "12.345.678/0001-90",
    tipo: "Matriz",
    status: "Ativa",
    endereco: "Av. Paulista, 1500 - São Paulo/SP",
    responsavel: "Bruno Reis",
  },
  {
    id: "UNI-002",
    nome: "Loja 02 - Filial Shopping",
    cnpj: "12.345.678/0002-71",
    tipo: "Filial",
    status: "Ativa",
    endereco: "Shopping Center Sul, Lj 45 - São Paulo/SP",
    responsavel: "Ana Carolina Silva",
  },
  {
    id: "UNI-003",
    nome: "Centro de Distribuição",
    cnpj: "12.345.678/0003-52",
    tipo: "CD",
    status: "Manutenção",
    endereco: "Rod. Anchieta, Km 40 - São Bernardo/SP",
    responsavel: "Rafael Almeida",
  },
];

const statusColors: Record<string, string> = {
  Ativa: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inativa: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Manutenção: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const tipoColors: Record<string, string> = {
  Matriz: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Filial: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  CD: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

// ── Componente principal ──────────────────────────────
export default function CompanyTab() {
  const [empresa, setEmpresa] = useState<Empresa>(initialEmpresa);
  const [unidades] = useState<Unidade[]>(initialUnidades);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Empresa>(initialEmpresa);

  const handleSave = () => {
    setEmpresa(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(empresa);
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            Dados da Empresa
          </h2>
          <p className="text-sm text-slate-500">
            Informações cadastrais e estrutura organizacional
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <X size={18} /> Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
              >
                <Save size={18} /> Salvar
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEditData(empresa);
                setIsEditing(true);
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
            >
              <Edit3 size={18} /> Editar Dados
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Dados principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Building2 size={12} /> Informações Corporativas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldDisplay
                label="Razão Social"
                value={empresa.razaoSocial}
                editing={isEditing}
                editValue={editData.razaoSocial}
                onChange={(v) => setEditData({ ...editData, razaoSocial: v })}
              />
              <FieldDisplay
                label="Nome Fantasia"
                value={empresa.nomeFantasia}
                editing={isEditing}
                editValue={editData.nomeFantasia}
                onChange={(v) => setEditData({ ...editData, nomeFantasia: v })}
              />
              <FieldDisplay
                label="CNPJ"
                value={empresa.cnpj}
                editing={isEditing}
                editValue={editData.cnpj}
                onChange={(v) => setEditData({ ...editData, cnpj: v })}
                mono
              />
              <FieldDisplay
                label="Inscrição Estadual"
                value={empresa.inscricaoEstadual}
                editing={isEditing}
                editValue={editData.inscricaoEstadual}
                onChange={(v) => setEditData({ ...editData, inscricaoEstadual: v })}
                mono
              />
              <FieldDisplay
                label="Regime Tributário"
                value={empresa.regimeTributario}
                editing={isEditing}
                editValue={editData.regimeTributario}
                onChange={(v) => setEditData({ ...editData, regimeTributario: v })}
              />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={12} /> Contato & Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FieldDisplay
                label="E-mail"
                value={empresa.email}
                editing={isEditing}
                editValue={editData.email}
                onChange={(v) => setEditData({ ...editData, email: v })}
                icon={<Mail size={12} />}
              />
              <FieldDisplay
                label="Telefone"
                value={empresa.telefone}
                editing={isEditing}
                editValue={editData.telefone}
                onChange={(v) => setEditData({ ...editData, telefone: v })}
                icon={<Phone size={12} />}
              />
              <FieldDisplay
                label="Website"
                value={empresa.website}
                editing={isEditing}
                editValue={editData.website}
                onChange={(v) => setEditData({ ...editData, website: v })}
                icon={<Globe size={12} />}
              />
              <FieldDisplay
                label="CEP"
                value={empresa.cep}
                editing={isEditing}
                editValue={editData.cep}
                onChange={(v) => setEditData({ ...editData, cep: v })}
                mono
              />
              <div className="md:col-span-2">
                <FieldDisplay
                  label="Endereço"
                  value={empresa.endereco}
                  editing={isEditing}
                  editValue={editData.endereco}
                  onChange={(v) => setEditData({ ...editData, endereco: v })}
                  icon={<MapPin size={12} />}
                />
              </div>
              <FieldDisplay
                label="Cidade"
                value={empresa.cidade}
                editing={isEditing}
                editValue={editData.cidade}
                onChange={(v) => setEditData({ ...editData, cidade: v })}
              />
              <FieldDisplay
                label="Estado"
                value={empresa.estado}
                editing={isEditing}
                editValue={editData.estado}
                onChange={(v) => setEditData({ ...editData, estado: v })}
              />
            </div>
          </div>
        </div>

        {/* Card lateral */}
        <div className="space-y-6">
          <div className="bg-purple-600 rounded-2xl p-6 text-white shadow-2xl shadow-purple-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Building2 size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">{empresa.nomeFantasia}</h3>
              <p className="text-purple-100 text-sm mb-6 opacity-80">
                {empresa.razaoSocial}
              </p>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
                    CNPJ
                  </div>
                  <div className="font-mono font-bold text-sm">{empresa.cnpj}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
                    Regime
                  </div>
                  <div className="font-bold text-sm">{empresa.regimeTributario}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
                    Unidades
                  </div>
                  <div className="font-bold text-sm">{unidades.length} unidades cadastradas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Clock size={12} /> Última Atualização
            </h3>
            <p className="text-sm text-white font-bold">16/03/2026 - 10:15</p>
            <p className="text-xs text-slate-500 mt-1">por Bruno Reis</p>
          </div>
        </div>
      </div>

      {/* Seção de Unidades */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Database size={18} className="text-purple-500" /> Unidades de Negócio
          </h3>
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
            <Plus size={16} /> Nova Unidade
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {unidades.map((uni) => (
            <div
              key={uni.id}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider",
                      tipoColors[uni.tipo]
                    )}
                  >
                    {uni.tipo}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider",
                      statusColors[uni.status]
                    )}
                  >
                    {uni.status}
                  </span>
                </div>
                <button className="p-1.5 text-slate-600 hover:text-white transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                {uni.nome}
              </h4>
              <p className="text-[11px] text-slate-500 font-mono mb-2">{uni.cnpj}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
                <MapPin size={10} /> {uni.endereco}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <FileText size={10} /> Responsável: {uni.responsavel}
              </div>
            </div>
          ))}

          {/* Card para adicionar */}
          <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 opacity-50 hover:opacity-75 transition-opacity cursor-pointer min-h-[180px]">
            <div className="p-3 bg-slate-800 rounded-full">
              <Plus size={20} className="text-slate-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
              Adicionar Nova Unidade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente de campo editável ──────────────────────
function FieldDisplay({
  label,
  value,
  editing,
  editValue,
  onChange,
  icon,
  mono,
}: {
  label: string;
  value: string;
  editing: boolean;
  editValue: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
        {icon} {label}
      </label>
      {editing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all"
        />
      ) : (
        <p className={cn("text-sm text-white font-semibold", mono && "font-mono")}>
          {value}
        </p>
      )}
    </div>
  );
}
