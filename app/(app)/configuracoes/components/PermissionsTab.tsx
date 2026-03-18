"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Edit3,
  Eye,
  Trash2,
  Plus,
  Users,
  Lock,
  Unlock,
  Settings,
  Database,
  FileText,
  BarChart3,
  UserCog,
  ShieldAlert,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────
interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: any;
}

interface RoleProfile {
  id: string;
  nome: string;
  descricao: string;
  color: string;
  userCount: number;
  permissions: Record<string, boolean>;
  isEditing?: boolean;
}

// ── Dados ──────────────────────────────────────────
const permissions: Permission[] = [
  { id: "users_view", label: "Visualizar Usuários", description: "Ver lista e detalhes de usuários", category: "Usuários", icon: Eye },
  { id: "users_create", label: "Criar Usuários", description: "Cadastrar novos usuários no sistema", category: "Usuários", icon: Plus },
  { id: "users_edit", label: "Editar Usuários", description: "Alterar dados e perfil de usuários", category: "Usuários", icon: Edit3 },
  { id: "users_delete", label: "Excluir Usuários", description: "Remover usuários permanentemente", category: "Usuários", icon: Trash2 },
  { id: "users_reset_pwd", label: "Resetar Senhas", description: "Gerar novas senhas temporárias", category: "Usuários", icon: Lock },
  { id: "config_view", label: "Visualizar Configs", description: "Acessar as configurações do sistema", category: "Configurações", icon: Settings },
  { id: "config_edit", label: "Editar Configs", description: "Alterar configurações do sistema", category: "Configurações", icon: Settings },
  { id: "audit_view", label: "Visualizar Auditoria", description: "Acessar logs de auditoria", category: "Auditoria", icon: FileText },
  { id: "audit_export", label: "Exportar Logs", description: "Baixar relatórios de auditoria", category: "Auditoria", icon: FileText },
  { id: "company_view", label: "Visualizar Empresa", description: "Acessar dados da empresa", category: "Empresa", icon: Database },
  { id: "company_edit", label: "Editar Empresa", description: "Alterar dados e estrutura da empresa", category: "Empresa", icon: Database },
  { id: "reports_view", label: "Visualizar Relatórios", description: "Acessar dashboards e relatórios", category: "Relatórios", icon: BarChart3 },
  { id: "reports_export", label: "Exportar Relatórios", description: "Baixar relatórios em PDF/Excel", category: "Relatórios", icon: BarChart3 },
  { id: "security_manage", label: "Gerenciar Segurança", description: "Configurar políticas de segurança", category: "Segurança", icon: ShieldAlert },
  { id: "roles_manage", label: "Gerenciar Perfis", description: "Criar e editar perfis de acesso", category: "Segurança", icon: UserCog },
];

const initialRoles: RoleProfile[] = [
  {
    id: "role-admin",
    nome: "Admin",
    descricao: "Acesso total ao sistema, incluindo configurações críticas e gestão de segurança.",
    color: "rose",
    userCount: 2,
    permissions: Object.fromEntries(permissions.map((p) => [p.id, true])),
  },
  {
    id: "role-gerente",
    nome: "Gerente",
    descricao: "Gestão operacional com acesso a relatórios, usuários e configurações não-críticas.",
    color: "indigo",
    userCount: 2,
    permissions: {
      users_view: true, users_create: true, users_edit: true, users_delete: false,
      users_reset_pwd: true, config_view: true, config_edit: false,
      audit_view: true, audit_export: true,
      company_view: true, company_edit: false,
      reports_view: true, reports_export: true,
      security_manage: false, roles_manage: false,
    },
  },
  {
    id: "role-operador",
    nome: "Operador",
    descricao: "Execução de operações diárias com acesso limitado às funções essenciais.",
    color: "emerald",
    userCount: 2,
    permissions: {
      users_view: false, users_create: false, users_edit: false, users_delete: false,
      users_reset_pwd: false, config_view: false, config_edit: false,
      audit_view: false, audit_export: false,
      company_view: true, company_edit: false,
      reports_view: true, reports_export: false,
      security_manage: false, roles_manage: false,
    },
  },
  {
    id: "role-auditor",
    nome: "Auditor",
    descricao: "Acesso somente leitura com visibilidade total para fins de auditoria e compliance.",
    color: "amber",
    userCount: 1,
    permissions: {
      users_view: true, users_create: false, users_edit: false, users_delete: false,
      users_reset_pwd: false, config_view: true, config_edit: false,
      audit_view: true, audit_export: true,
      company_view: true, company_edit: false,
      reports_view: true, reports_export: true,
      security_manage: false, roles_manage: false,
    },
  },
  {
    id: "role-visualizador",
    nome: "Visualizador",
    descricao: "Acesso básico somente leitura para consulta de informações.",
    color: "slate",
    userCount: 1,
    permissions: {
      users_view: false, users_create: false, users_edit: false, users_delete: false,
      users_reset_pwd: false, config_view: false, config_edit: false,
      audit_view: false, audit_export: false,
      company_view: true, company_edit: false,
      reports_view: true, reports_export: false,
      security_manage: false, roles_manage: false,
    },
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", dot: "bg-rose-500" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", dot: "bg-indigo-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-500" },
  slate: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20", dot: "bg-slate-500" },
};

// ── Componente principal ──────────────────────────────
export default function PermissionsTab() {
  const [roles, setRoles] = useState<RoleProfile[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<string>("role-admin");
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({ nome: "", descricao: "", color: "slate" });

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `role-${newRole.nome.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const role: RoleProfile = {
      id,
      nome: newRole.nome,
      descricao: newRole.descricao,
      color: newRole.color,
      userCount: 0,
      permissions: Object.fromEntries(permissions.map((p) => [p.id, false])),
    };
    setRoles((prev) => [...prev, role]);
    setIsNewRoleModalOpen(false);
    setNewRole({ nome: "", descricao: "", color: "slate" });
    setSelectedRole(id);
  };

  const handleDeleteRole = (id: string) => {
    if (roles.length === 1) {
      alert("Não é possível excluir o único perfil existente.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este perfil?")) {
      const updatedRoles = roles.filter(r => r.id !== id);
      setRoles(updatedRoles);
      if (selectedRole === id) {
         setSelectedRole(updatedRoles[0].id);
      }
    }
  };

  const activeRole = roles.find((r) => r.id === selectedRole)!;
  const c = colorClasses[activeRole.color];

  const categories = [...new Set(permissions.map((p) => p.category))];

  const handleTogglePermission = (permId: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [permId]: !r.permissions[permId],
              },
            }
          : r
      )
    );
  };

  const handleToggleAll = (grant: boolean) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedRole
          ? {
              ...r,
              permissions: Object.fromEntries(
                permissions.map((p) => [p.id, grant])
              ),
            }
          : r
      )
    );
  };

  const totalGranted = Object.values(activeRole.permissions).filter(Boolean).length;
  const totalPermissions = permissions.length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            Perfis & Permissões
          </h2>
          <p className="text-sm text-slate-500">
            Gerencie os níveis de acesso de cada perfil do sistema
          </p>
        </div>
        <button
          onClick={() => setIsNewRoleModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={18} />
          Novo Perfil
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lista de perfis */}
        <div className="w-full lg:w-72 space-y-3">
          {roles.map((role) => {
            const rc = colorClasses[role.color];
            const isActive = selectedRole === role.id;
            const granted = Object.values(role.permissions).filter(Boolean).length;
            return (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                }}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all",
                  isActive
                    ? `${rc.bg} ${rc.border} shadow-lg`
                    : "bg-slate-900/40 border-slate-800 hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("h-3 w-3 rounded-full", rc.dot)} />
                  <span className={cn("text-sm font-black", isActive ? rc.text : "text-white")}>
                    {role.nome}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {role.descricao}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                    <Users size={10} /> {role.userCount} usuário(s)
                  </span>
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded border", rc.bg, rc.text, rc.border)}>
                    {granted}/{totalPermissions}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel de permissões */}
        <div className="flex-1 bg-slate-900/30 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", c.bg)}>
                <ShieldCheck className={c.text} size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Permissões: {activeRole.nome}
                </h3>
                <p className="text-xs text-slate-500">
                  {totalGranted} de {totalPermissions} permissões ativas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteRole(selectedRole)}
                className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-rose-500/20 transition-all ml-2 lg:ml-4"
              >
                <Trash2 size={12} className="inline mr-1" /> Excluir
              </button>
              <button
                onClick={() => handleToggleAll(true)}
                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-all"
              >
                <Unlock size={12} className="inline mr-1" /> Conceder Todas
              </button>
              <button
                onClick={() => handleToggleAll(false)}
                className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:text-white transition-all"
              >
                <Lock size={12} className="inline mr-1" /> Revogar Todas
              </button>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mb-8">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", `bg-${activeRole.color}-500`)}
                style={{ width: `${(totalGranted / totalPermissions) * 100}%`, backgroundColor: activeRole.color === 'rose' ? 'rgb(244 63 94)' : activeRole.color === 'indigo' ? 'rgb(99 102 241)' : activeRole.color === 'emerald' ? 'rgb(16 185 129)' : activeRole.color === 'amber' ? 'rgb(245 158 11)' : 'rgb(100 116 139)' }}
              />
            </div>
          </div>

          {/* Permissões por categoria */}
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryPerms = permissions.filter((p) => p.category === category);
              return (
                <div key={category}>
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    {category}
                    <span className="text-slate-700">
                      ({categoryPerms.filter((p) => activeRole.permissions[p.id]).length}/{categoryPerms.length})
                    </span>
                  </h4>
                  <div className="space-y-2">
                    {categoryPerms.map((perm) => {
                      const isGranted = activeRole.permissions[perm.id];
                      const Icon = perm.icon;
                      return (
                        <div
                          key={perm.id}
                          onClick={() => handleTogglePermission(perm.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                            isGranted
                              ? "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                              : "bg-slate-950/30 border-slate-800/50 opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={14} className={isGranted ? "text-slate-400" : "text-slate-600"} />
                            <div>
                              <div className={cn("text-sm font-bold", isGranted ? "text-white" : "text-slate-500")}>
                                {perm.label}
                              </div>
                              <div className="text-[10px] text-slate-600">{perm.description}</div>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "h-6 w-11 rounded-full flex items-center px-0.5 transition-all",
                              isGranted ? "bg-emerald-600 justify-end" : "bg-slate-700 justify-start"
                            )}
                          >
                            <div className="h-5 w-5 rounded-full bg-white shadow-md flex items-center justify-center">
                              {isGranted ? (
                                <Check size={10} className="text-emerald-600" />
                              ) : (
                                <X size={10} className="text-slate-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Criar Perfil */}
      {isNewRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsNewRoleModalOpen(false)}
          />
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-white">Novo Perfil</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Crie um novo perfil de acesso personalizado
                </p>
              </div>
              <button
                onClick={() => setIsNewRoleModalOpen(false)}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRole} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Nome do Perfil
                </label>
                <input
                  type="text"
                  value={newRole.nome}
                  onChange={(e) => setNewRole({ ...newRole, nome: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Ex: Suporte Técnico"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Descrição
                </label>
                <textarea
                  value={newRole.descricao}
                  onChange={(e) => setNewRole({ ...newRole, descricao: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600 min-h-[80px]"
                  placeholder="Descreva o propósito deste perfil..."
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Cor de Destaque
                </label>
                <div className="flex items-center gap-3">
                  {Object.keys(colorClasses).map((color) => {
                    const rc = colorClasses[color];
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewRole({ ...newRole, color })}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                          rc.bg,
                          newRole.color === color ? rc.border : "border-slate-800 hover:border-slate-600"
                        )}
                      >
                        <div className={cn("w-3 h-3 rounded-full", rc.dot)} />
                      </button>
                    )
                  })}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewRoleModalOpen(false)}
                  className="flex-1 bg-slate-800 text-slate-300 hover:text-white py-3 rounded-xl font-bold text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Criar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
