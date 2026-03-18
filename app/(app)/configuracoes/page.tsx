
"use client";

import { useState } from "react";
import {
  Settings,
  Users,
  ShieldCheck,
  ScrollText,
  Building2,
  Lock,
  ChevronRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UsersTab from "./components/UsersTab";
import AuditTab from "./components/AuditTab";
import PermissionsTab from "./components/PermissionsTab";
import CompanyTab from "./components/CompanyTab";
import SecurityTab from "./components/SecurityTab";

type ConfigTab = "usuarios" | "permissoes" | "auditoria" | "empresa" | "seguranca";

const tabs = [
  {
    id: "usuarios" as ConfigTab,
    label: "Usuários",
    description: "Criar, editar e gerenciar contas",
    icon: Users,
    color: "indigo",
  },
  {
    id: "permissoes" as ConfigTab,
    label: "Permissões",
    description: "Perfis e controle de acesso",
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    id: "auditoria" as ConfigTab,
    label: "Auditoria",
    description: "Logs e rastreamento de ações",
    icon: ScrollText,
    color: "amber",
  },
  {
    id: "empresa" as ConfigTab,
    label: "Empresa",
    description: "Dados organizacionais",
    icon: Building2,
    color: "purple",
  },
  {
    id: "seguranca" as ConfigTab,
    label: "Segurança",
    description: "Políticas e sessões ativas",
    icon: Lock,
    color: "rose",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; shadow: string; activeBg: string; activeText: string; glow: string }> = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    shadow: "shadow-indigo-600/20",
    activeBg: "bg-indigo-600",
    activeText: "text-white",
    glow: "shadow-[0_0_20px_rgba(99,102,241,0.3)]",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    shadow: "shadow-emerald-600/20",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    shadow: "shadow-amber-600/20",
    activeBg: "bg-amber-600",
    activeText: "text-white",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    shadow: "shadow-purple-600/20",
    activeBg: "bg-purple-600",
    activeText: "text-white",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    shadow: "shadow-rose-600/20",
    activeBg: "bg-rose-600",
    activeText: "text-white",
    glow: "shadow-[0_0_20px_rgba(244,63,94,0.3)]",
  },
};

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<ConfigTab>("usuarios");

  const activeTabData = tabs.find((t) => t.id === activeTab)!;
  const colors = colorMap[activeTabData.color];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 mb-3">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Painel de Governança
          </span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Settings className="text-indigo-500" size={32} />
              Configurações
              <span className="text-indigo-500/50 text-xl lg:text-2xl font-normal">
                / Central de Controle
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              Gerencie usuários, permissões, auditoria e toda a infraestrutura
              de segurança do sistema.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5">
            <Activity size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Sistema Operacional
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const c = colorMap[tab.color];
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 border",
                isActive
                  ? `${c.activeBg} ${c.activeText} border-transparent shadow-xl ${c.shadow} ${c.glow} scale-[1.02]`
                  : `bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-700`
              )}
            >
              <Icon size={18} />
              <div className="text-left">
                <div>{tab.label}</div>
                <div
                  className={cn(
                    "text-[10px] font-medium mt-0.5 hidden sm:block",
                    isActive ? "opacity-80" : "opacity-50"
                  )}
                >
                  {tab.description}
                </div>
              </div>
              {isActive && <ChevronRight size={14} className="ml-2 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-6 lg:p-8 backdrop-blur-sm min-h-[600px]">
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "usuarios" && <UsersTab />}
          {activeTab === "permissoes" && <PermissionsTab />}
          {activeTab === "auditoria" && <AuditTab />}
          {activeTab === "empresa" && <CompanyTab />}
          {activeTab === "seguranca" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
