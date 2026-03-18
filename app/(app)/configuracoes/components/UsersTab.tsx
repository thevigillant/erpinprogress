"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  X,
  Check,
  Copy,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────
interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  perfil: "Admin" | "Gerente" | "Operador" | "Auditor" | "Visualizador";
  status: "Ativo" | "Inativo" | "Bloqueado";
  ultimoAcesso: string;
  criadoEm: string;
  avatar: string;
}

const profileColors: Record<string, string> = {
  Admin: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Gerente: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Operador: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Auditor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Visualizador: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Inativo: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Bloqueado: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const statusDot: Record<string, string> = {
  Ativo: "bg-emerald-500",
  Inativo: "bg-slate-500",
  Bloqueado: "bg-rose-500",
};

// ── Dados Mock ──────────────────────────────────────
const initialUsers: User[] = [
  {
    id: "USR-001",
    nome: "Bruno Reis",
    email: "bruno.reis@erp.com.br",
    telefone: "(11) 98765-4321",
    cargo: "Administrador do Sistema",
    perfil: "Admin",
    status: "Ativo",
    ultimoAcesso: "2026-03-16T15:30:00",
    criadoEm: "2025-01-15",
    avatar: "BR",
  },
  {
    id: "USR-002",
    nome: "Ana Carolina Silva",
    email: "ana.silva@erp.com.br",
    telefone: "(11) 91234-5678",
    cargo: "Gerente de Operações",
    perfil: "Gerente",
    status: "Ativo",
    ultimoAcesso: "2026-03-16T14:22:00",
    criadoEm: "2025-02-10",
    avatar: "AC",
  },
  {
    id: "USR-003",
    nome: "Pedro Henrique Costa",
    email: "pedro.costa@erp.com.br",
    telefone: "(21) 99876-5432",
    cargo: "Operador de Caixa",
    perfil: "Operador",
    status: "Ativo",
    ultimoAcesso: "2026-03-16T12:45:00",
    criadoEm: "2025-03-20",
    avatar: "PH",
  },
  {
    id: "USR-004",
    nome: "Maria Fernanda Oliveira",
    email: "maria.oliveira@erp.com.br",
    telefone: "(11) 97654-3210",
    cargo: "Auditora Fiscal",
    perfil: "Auditor",
    status: "Ativo",
    ultimoAcesso: "2026-03-15T18:30:00",
    criadoEm: "2025-04-05",
    avatar: "MF",
  },
  {
    id: "USR-005",
    nome: "Lucas Martins",
    email: "lucas.martins@erp.com.br",
    telefone: "(31) 98765-1234",
    cargo: "Auxiliar Administrativo",
    perfil: "Visualizador",
    status: "Inativo",
    ultimoAcesso: "2026-02-28T10:00:00",
    criadoEm: "2025-05-12",
    avatar: "LM",
  },
  {
    id: "USR-006",
    nome: "Camila Rodrigues",
    email: "camila.rodrigues@erp.com.br",
    telefone: "(11) 91111-2222",
    cargo: "Gerente Financeiro",
    perfil: "Gerente",
    status: "Bloqueado",
    ultimoAcesso: "2026-03-10T09:15:00",
    criadoEm: "2025-06-01",
    avatar: "CR",
  },
  {
    id: "USR-007",
    nome: "Rafael Almeida",
    email: "rafael.almeida@erp.com.br",
    telefone: "(21) 93333-4444",
    cargo: "Supervisor de TI",
    perfil: "Admin",
    status: "Ativo",
    ultimoAcesso: "2026-03-16T15:55:00",
    criadoEm: "2025-07-20",
    avatar: "RA",
  },
  {
    id: "USR-008",
    nome: "Juliana Santos",
    email: "juliana.santos@erp.com.br",
    telefone: "(11) 95555-6666",
    cargo: "Operadora de Estoque",
    perfil: "Operador",
    status: "Ativo",
    ultimoAcesso: "2026-03-16T11:30:00",
    criadoEm: "2025-08-15",
    avatar: "JS",
  },
];

// ── Componente principal ──────────────────────────────
export default function UsersTab() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [filterPerfil, setFilterPerfil] = useState<string>("Todos");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Filtros
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Todos" || u.status === filterStatus;
    const matchPerfil = filterPerfil === "Todos" || u.perfil === filterPerfil;
    return matchSearch && matchStatus && matchPerfil;
  });

  // Stats
  const totalAtivos = users.filter((u) => u.status === "Ativo").length;
  const totalInativos = users.filter((u) => u.status === "Inativo").length;
  const totalBloqueados = users.filter((u) => u.status === "Bloqueado").length;

  // Ações
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Ativo" ? "Inativo" : "Ativo" }
          : u
      )
    );
    setActionMenu(null);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário permanentemente?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    setActionMenu(null);
  };

  const handleResetPassword = (user: User) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setGeneratedPassword(pwd);
    setSelectedUser(user);
    setShowResetPassword(true);
    setActionMenu(null);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
    setActionMenu(null);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (isEditing && selectedUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u))
      );
    } else {
      const newId = `USR-${String(users.length + 1).padStart(3, "0")}`;
      const initials = (userData.nome || "NN")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
      const newUser: User = {
        id: newId,
        nome: userData.nome || "",
        email: userData.email || "",
        telefone: userData.telefone || "",
        cargo: userData.cargo || "",
        perfil: (userData.perfil as User["perfil"]) || "Operador",
        status: "Ativo",
        ultimoAcesso: "Nunca",
        criadoEm: new Date().toISOString().split("T")[0],
        avatar: initials,
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      {/* Header com stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            Gerenciamento de Usuários
          </h2>
          <p className="text-sm text-slate-500">
            Crie, edite e controle todos os acessos do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5">
            <div className="text-center">
              <div className="text-lg font-black text-emerald-400">{totalAtivos}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Ativos
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-lg font-black text-slate-400">{totalInativos}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Inativos
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-lg font-black text-rose-400">{totalBloqueados}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Bloqueados
              </div>
            </div>
          </div>
          <button
            onClick={handleCreateUser}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, email ou ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner placeholder:text-slate-600"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Bloqueado">Bloqueado</option>
        </select>
        <select
          value={filterPerfil}
          onChange={(e) => setFilterPerfil(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="Todos">Todos os Perfis</option>
          <option value="Admin">Admin</option>
          <option value="Gerente">Gerente</option>
          <option value="Operador">Operador</option>
          <option value="Auditor">Auditor</option>
          <option value="Visualizador">Visualizador</option>
        </select>
        <div className="flex items-center gap-2 ml-auto">
          <button className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2.5 rounded-xl transition-all" title="Exportar">
            <Download size={18} />
          </button>
          <button className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2.5 rounded-xl transition-all" title="Importar">
            <Upload size={18} />
          </button>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Usuário
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Perfil
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Cargo
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Último Acesso
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-slate-500"
                  >
                    <Search size={40} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-sm font-bold">Nenhum usuário encontrado</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Ajuste os filtros ou crie um novo usuário
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-black">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                            {user.nome}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider",
                          profileColors[user.perfil]
                        )}
                      >
                        {user.perfil}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            statusDot[user.status],
                            user.status === "Ativo" && "animate-pulse"
                          )}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-black px-2 py-0.5 rounded border uppercase",
                            statusColors[user.status]
                          )}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {user.cargo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-400">
                        {user.ultimoAcesso === "Nunca"
                          ? "Nunca acessou"
                          : new Date(user.ultimoAcesso).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end relative">
                        <button
                          onClick={() =>
                            setActionMenu(
                              actionMenu === user.id ? null : user.id
                            )
                          }
                          className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown de ações */}
                        {actionMenu === user.id && (
                          <div className="absolute right-0 top-full mt-1 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 py-2 w-52 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 transition-colors"
                            >
                              <Edit3 size={15} /> Editar Usuário
                            </button>
                            <button
                              onClick={() => handleResetPassword(user)}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-colors"
                            >
                              <Key size={15} /> Resetar Senha
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                            >
                              {user.status === "Ativo" ? (
                                <>
                                  <UserX size={15} /> Desativar
                                </>
                              ) : (
                                <>
                                  <UserCheck size={15} /> Ativar
                                </>
                              )}
                            </button>
                            <div className="border-t border-slate-800 my-1" />
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 size={15} /> Excluir Permanente
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer da tabela */}
        <div className="px-6 py-3 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-bold">
            {filteredUsers.length} de {users.length} usuários
          </span>
          <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">
            Dados em tempo real
          </span>
        </div>
      </div>

      {/* Modal de Criar/Editar Usuário */}
      {isModalOpen && (
        <UserFormModal
          user={isEditing ? selectedUser : null}
          onSave={handleSaveUser}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Modal de Reset de Senha */}
      {showResetPassword && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          password={generatedPassword}
          onClose={() => {
            setShowResetPassword(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

// ── Modal de Formulário de Usuário ──────────────────
function UserFormModal({
  user,
  onSave,
  onClose,
}: {
  user: User | null;
  onSave: (data: Partial<User>) => void;
  onClose: () => void;
}) {
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");
  const [cargo, setCargo] = useState(user?.cargo || "");
  const [perfil, setPerfil] = useState(user?.perfil || "Operador");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nome, email, telefone, cargo, perfil: perfil as User["perfil"] });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-white">
              {user ? "Editar Usuário" : "Novo Usuário"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {user
                ? `Editando ${user.nome}`
                : "Preencha os dados para criar um novo acesso"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              placeholder="Ex: João Pedro Silva"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                <Mail size={10} className="inline mr-1" /> E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                placeholder="email@empresa.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                <Phone size={10} className="inline mr-1" /> Telefone
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Cargo
            </label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              placeholder="Ex: Gerente Comercial"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              <Shield size={10} className="inline mr-1" /> Perfil de Acesso
            </label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
            >
              <option value="Admin">Admin — Acesso Total</option>
              <option value="Gerente">Gerente — Gestão Operacional</option>
              <option value="Operador">Operador — Execução Padrão</option>
              <option value="Auditor">Auditor — Somente Leitura + Logs</option>
              <option value="Visualizador">Visualizador — Somente Leitura</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 text-slate-300 hover:text-white py-3 rounded-xl font-bold text-sm transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <Check size={18} />
              {user ? "Salvar Alterações" : "Criar Usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Modal de Reset de Senha ──────────────────────────
function ResetPasswordModal({
  user,
  password,
  onClose,
}: {
  user: User;
  password: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Key className="text-amber-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Senha Resetada</h3>
              <p className="text-xs text-slate-500">{user.nome}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
            Nova Senha Temporária
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-lg text-white bg-transparent">
              {showPwd ? password : "••••••••••••"}
            </div>
            <button
              onClick={() => setShowPwd(!showPwd)}
              className="p-2 text-slate-500 hover:text-white transition-colors"
            >
              {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button
              onClick={handleCopy}
              className={cn(
                "p-2 rounded-lg transition-all",
                copied
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-slate-500 hover:text-white"
              )}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
          <p className="text-xs text-amber-400 leading-relaxed">
            <strong>⚠ Atenção:</strong> O usuário deverá trocar esta senha no
            próximo login. Envie-a de forma segura.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
