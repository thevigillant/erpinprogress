"use client";

import { useState } from "react";
import {
  BarChart3,
  Calculator,
  FileText,
  FileCode2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import FiscalDashboardTab from "./components/FiscalDashboardTab";
import TaxEngineTab from "./components/TaxEngineTab";
import NotasFiscaisTab from "./components/NotasFiscaisTab";
import XmlStorageTab from "./components/XmlStorageTab";
import AccountingExportTab from "./components/AccountingExportTab";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "motor", label: "Motor Tributário", icon: Calculator },
  { id: "notas", label: "Guias Fiscais", icon: FileText },
  { id: "xmls", label: "XMLs", icon: FileCode2 },
  { id: "exportacao", label: "Exportação Contábil", icon: BookOpen },
];

export default function FiscalPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Fiscal</h1>
        <p className="text-sm text-slate-500">Gestão fiscal, tributária e documentos eletrônicos</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-1.5 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "dashboard" && <FiscalDashboardTab />}
        {activeTab === "motor" && <TaxEngineTab />}
        {activeTab === "notas" && <NotasFiscaisTab />}
        {activeTab === "xmls" && <XmlStorageTab />}
        {activeTab === "exportacao" && <AccountingExportTab />}
      </div>
    </div>
  );
}
