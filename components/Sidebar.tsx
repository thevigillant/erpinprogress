"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Settings, 
  ShieldCheck,
  LogOut,
  Package,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuGroups = [
  {
    label: "ERP",
    items: [
      { 
        id: "configuracoes", 
        label: "Configurações", 
        icon: Settings, 
        href: "/configuracoes",
        activeBg: "bg-indigo-600",
        activeShadow: "shadow-indigo-600/20",
      },
      { 
        id: "fiscal", 
        label: "Fiscal", 
        subtitle: "O Blindado",
        icon: ShieldCheck, 
        href: "/fiscal",
        activeBg: "bg-emerald-600",
        activeShadow: "shadow-emerald-600/20",
      },
    ],
  },
  {
    label: "Atlas · Cadastros",
    items: [
      { 
        id: "atlas-produtos", 
        label: "Produtos", 
        subtitle: "Atlas Inteligente",
        icon: Package, 
        href: "/atlas/produtos",
        activeBg: "bg-orange-600",
        activeShadow: "shadow-orange-600/20",
      },
      { 
        id: "atlas-fornecedores", 
        label: "Fornecedores", 
        subtitle: "Atlas Gestão",
        icon: Building2, 
        href: "/atlas/fornecedores",
        activeBg: "bg-amber-600",
        activeShadow: "shadow-amber-600/20",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };


  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-500 mb-8">
          <div className="bg-indigo-600/10 p-2 rounded-xl">
            <Settings size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            ERP <span className="text-indigo-500">Global</span>
          </span>
        </div>

        <nav className="space-y-4">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 px-4 mb-1">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                        isActive
                          ? `${item.activeBg} text-white shadow-lg ${item.activeShadow}`
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      )}
                    >
                      <Icon size={18} />
                      <div>
                        <div>{item.label}</div>
                        {"subtitle" in item && item.subtitle && (
                          <div className={cn(
                            "text-[9px] font-medium uppercase tracking-wider",
                            isActive ? "text-white/60" : "text-slate-600"
                          )}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
