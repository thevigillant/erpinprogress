"use client";

import { useState } from "react";
import {
  ScrollText,
  Search,
  Filter,
  Calendar,
  User,
  Shield,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  UserMinus,
  Edit3,
  Key,
  AlertTriangle,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────
interface AuditLog {
  id: string;
  timestamp: string;
  usuario: string;
  acao: string;
  tipo: "auth" | "user" | "config" | "security" | "data";
  severidade: "info" | "warning" | "critical";
  detalhes: string;
  ip: string;
  userAgent: string;
  modulo: string;
}

const tipoIcons: Record<string, any> = {
  auth: LogIn,
  user: User,
  config: Settings,
  security: Shield,
  data: Edit3,
};

const tipoLabels: Record<string, string> = {
  auth: "Autenticação",
  user: "Usuário",
  config: "Configuração",
  security: "Segurança",
  data: "Dados",
};

const tipoColors: Record<string, string> = {
  auth: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  user: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  config: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  security: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  data: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const severidadeColors: Record<string, string> = {
  info: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  critical: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const severidadeDot: Record<string, string> = {
  info: "bg-slate-500",
  warning: "bg-amber-500 animate-pulse",
  critical: "bg-rose-500 animate-pulse",
};

// ── Dados Mock ──────────────────────────────────────
const mockLogs: AuditLog[] = [
  {
    id: "LOG-001",
    timestamp: "2026-03-16T15:55:00",
    usuario: "Bruno Reis",
    acao: "Login realizado com sucesso",
    tipo: "auth",
    severidade: "info",
    detalhes: "Autenticação via credenciais padrão. Sessão iniciada com token JWT válido por 24h.",
    ip: "192.168.1.100",
    userAgent: "Chrome 134 / Windows 11",
    modulo: "Auth Gateway",
  },
  {
    id: "LOG-002",
    timestamp: "2026-03-16T15:50:00",
    usuario: "Bruno Reis",
    acao: "Usuário 'Camila Rodrigues' bloqueado",
    tipo: "user",
    severidade: "warning",
    detalhes: "Status alterado de Ativo para Bloqueado. Motivo: Tentativas de acesso irregulares detectadas.",
    ip: "192.168.1.100",
    userAgent: "Chrome 134 / Windows 11",
    modulo: "Gerenciamento de Usuários",
  },
  {
    id: "LOG-003",
    timestamp: "2026-03-16T15:45:00",
    usuario: "Ana Carolina Silva",
    acao: "Permissão de perfil alterada",
    tipo: "security",
    severidade: "critical",
    detalhes: "Perfil 'Operador' teve a permissão 'Excluir Registros' removida pelo administrador.",
    ip: "192.168.1.105",
    userAgent: "Firefox 135 / macOS 15",
    modulo: "Controle de Permissões",
  },
  {
    id: "LOG-004",
    timestamp: "2026-03-16T15:30:00",
    usuario: "Rafael Almeida",
    acao: "Backup automático executado",
    tipo: "config",
    severidade: "info",
    detalhes: "Backup completo do banco de dados realizado. Tamanho: 2.4GB. Duração: 3min 22s.",
    ip: "10.0.0.1",
    userAgent: "Sistema Automatizado",
    modulo: "Infraestrutura",
  },
  {
    id: "LOG-005",
    timestamp: "2026-03-16T14:22:00",
    usuario: "Ana Carolina Silva",
    acao: "Novo usuário criado: Pedro Henrique Costa",
    tipo: "user",
    severidade: "info",
    detalhes: "Usuário criado com perfil 'Operador'. E-mail de boas-vindas enviado. Senha temporária gerada.",
    ip: "192.168.1.105",
    userAgent: "Firefox 135 / macOS 15",
    modulo: "Gerenciamento de Usuários",
  },
  {
    id: "LOG-006",
    timestamp: "2026-03-16T13:45:00",
    usuario: "Sistema",
    acao: "Tentativa de login falha (3x) - camila.rodrigues@erp.com.br",
    tipo: "security",
    severidade: "critical",
    detalhes: "3 tentativas consecutivas de login com senha incorreta. Conta bloqueada automaticamente por política de segurança.",
    ip: "200.123.45.67",
    userAgent: "Chrome 134 / Android 16",
    modulo: "Auth Gateway",
  },
  {
    id: "LOG-007",
    timestamp: "2026-03-16T12:00:00",
    usuario: "Pedro Henrique Costa",
    acao: "Senha alterada pelo próprio usuário",
    tipo: "auth",
    severidade: "info",
    detalhes: "Senha temporária substituída por senha definitiva. Política de complexidade atendida.",
    ip: "192.168.1.110",
    userAgent: "Chrome 134 / Windows 11",
    modulo: "Auth Gateway",
  },
  {
    id: "LOG-008",
    timestamp: "2026-03-16T11:30:00",
    usuario: "Maria Fernanda Oliveira",
    acao: "Relatório de auditoria exportado",
    tipo: "data",
    severidade: "info",
    detalhes: "Exportação de logs do período 01/03 a 16/03. Formato: PDF. Total de 342 registros.",
    ip: "192.168.1.108",
    userAgent: "Safari 19 / macOS 15",
    modulo: "Auditoria",
  },
  {
    id: "LOG-009",
    timestamp: "2026-03-16T10:15:00",
    usuario: "Bruno Reis",
    acao: "Configuração de empresa atualizada",
    tipo: "config",
    severidade: "warning",
    detalhes: "Razão social alterada de 'ERP Varejo S.A' para 'ERP Varejo Global S.A'. CNPJ mantido.",
    ip: "192.168.1.100",
    userAgent: "Chrome 134 / Windows 11",
    modulo: "Dados da Empresa",
  },
  {
    id: "LOG-010",
    timestamp: "2026-03-16T09:00:00",
    usuario: "Rafael Almeida",
    acao: "Política de senha atualizada",
    tipo: "security",
    severidade: "critical",
    detalhes: "Comprimento mínimo alterado de 8 para 12 caracteres. Exigência de caractere especial habilitada.",
    ip: "192.168.1.100",
    userAgent: "Chrome 134 / Windows 11",
    modulo: "Políticas de Segurança",
  },
  {
    id: "LOG-011",
    timestamp: "2026-03-15T18:30:00",
    usuario: "Maria Fernanda Oliveira",
    acao: "Logout realizado",
    tipo: "auth",
    severidade: "info",
    detalhes: "Sessão encerrada pelo usuário. Duração total: 8h 15min.",
    ip: "192.168.1.108",
    userAgent: "Safari 19 / macOS 15",
    modulo: "Auth Gateway",
  },
  {
    id: "LOG-012",
    timestamp: "2026-03-15T16:00:00",
    usuario: "Bruno Reis",
    acao: "Senha de 'Lucas Martins' resetada",
    tipo: "user",
    severidade: "warning",
    detalhes: "Senha resetada manualmente pelo administrador. Nova senha temporária gerada e enviada por e-mail.",
    ip: "192.168.1.100",
    userAgent: "Chrome 134 / Windows 11",
    modulo: "Gerenciamento de Usuários",
  },
];

// ── Componente principal ──────────────────────────────
export default function AuditTab() {
  const [logs] = useState<AuditLog[]>(mockLogs);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("Todos");
  const [filterSeveridade, setFilterSeveridade] = useState("Todos");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.acao.toLowerCase().includes(search.toLowerCase()) ||
      log.usuario.toLowerCase().includes(search.toLowerCase()) ||
      log.modulo.toLowerCase().includes(search.toLowerCase());
    const matchTipo = filterTipo === "Todos" || log.tipo === filterTipo;
    const matchSeveridade = filterSeveridade === "Todos" || log.severidade === filterSeveridade;
    return matchSearch && matchTipo && matchSeveridade;
  });

  // Stats
  const totalCritical = logs.filter((l) => l.severidade === "critical").length;
  const totalWarning = logs.filter((l) => l.severidade === "warning").length;
  const totalToday = logs.filter((l) => l.timestamp.startsWith("2026-03-16")).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            Log de Auditoria
          </h2>
          <p className="text-sm text-slate-500">
            Rastreamento completo de todas as ações do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5">
            <div className="text-center">
              <div className="text-lg font-black text-white">{totalToday}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Hoje
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-lg font-black text-amber-400">{totalWarning}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Alertas
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-lg font-black text-rose-400">{totalCritical}</div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                Críticos
              </div>
            </div>
          </div>
          <button className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-600/20">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por ação, usuário ou módulo..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 transition-all shadow-inner placeholder:text-slate-600"
          />
        </div>
        <select
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
        >
          <option value="Todos">Todos os Tipos</option>
          <option value="auth">Autenticação</option>
          <option value="user">Usuário</option>
          <option value="config">Configuração</option>
          <option value="security">Segurança</option>
          <option value="data">Dados</option>
        </select>
        <select
          value={filterSeveridade}
          onChange={(e) => setFilterSeveridade(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
        >
          <option value="Todos">Todas as Severidades</option>
          <option value="info">Informativo</option>
          <option value="warning">Alerta</option>
          <option value="critical">Crítico</option>
        </select>
      </div>

      {/* Timeline de Logs */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
            <ScrollText size={40} className="mx-auto mb-4 text-slate-700" />
            <p className="text-sm font-bold text-white">Nenhum log encontrado</p>
            <p className="text-xs text-slate-600 mt-1">
              Ajuste os filtros para visualizar os registros
            </p>
          </div>
        ) : (
          filtered.map((log) => {
            const Icon = tipoIcons[log.tipo] || ScrollText;
            const isExpanded = expandedLog === log.id;
            return (
              <div
                key={log.id}
                className={cn(
                  "bg-slate-900/40 border rounded-2xl transition-all overflow-hidden",
                  log.severidade === "critical"
                    ? "border-rose-500/30 hover:border-rose-500/50"
                    : log.severidade === "warning"
                    ? "border-amber-500/20 hover:border-amber-500/40"
                    : "border-slate-800 hover:border-slate-700"
                )}
              >
                <button
                  onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  className="w-full px-5 py-4 flex items-center gap-4 text-left"
                >
                  {/* Indicador de severidade */}
                  <div className={cn("h-2 w-2 rounded-full flex-shrink-0", severidadeDot[log.severidade])} />

                  {/* Ícone do tipo */}
                  <div className={cn("p-2 rounded-lg flex-shrink-0 border", tipoColors[log.tipo])}>
                    <Icon size={16} />
                  </div>

                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white truncate">
                        {log.acao}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User size={10} /> {log.usuario}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(log.timestamp).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Settings size={10} /> {log.modulo}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider", tipoColors[log.tipo])}>
                      {tipoLabels[log.tipo]}
                    </span>
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider", severidadeColors[log.severidade])}>
                      {log.severidade}
                    </span>
                  </div>

                  {/* Expand icon */}
                  <div className="flex-shrink-0 text-slate-500">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Detalhes expandidos */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-slate-950/50 rounded-xl p-4">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                          Detalhes
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {log.detalhes}
                        </p>
                      </div>
                      <div className="bg-slate-950/50 rounded-xl p-4">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                          Informações Técnicas
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <MapPin size={12} className="text-slate-600" />
                            <span>IP: <span className="text-white font-mono">{log.ip}</span></span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Monitor size={12} className="text-slate-600" />
                            <span>{log.userAgent}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Calendar size={12} className="text-slate-600" />
                            <span>
                              {new Date(log.timestamp).toLocaleString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-950/50 rounded-xl p-4">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                          Identificação
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-slate-400">
                            ID: <span className="text-white font-mono text-[11px]">{log.id}</span>
                          </div>
                          <div className="text-xs text-slate-400">
                            Módulo: <span className="text-white">{log.modulo}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <span className={cn("text-[9px] font-black px-2 py-0.5 rounded border uppercase", tipoColors[log.tipo])}>
                              {tipoLabels[log.tipo]}
                            </span>
                            <span className={cn("text-[9px] font-black px-2 py-0.5 rounded border uppercase", severidadeColors[log.severidade])}>
                              {log.severidade}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 px-4 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-bold">
          {filtered.length} registros encontrados
        </span>
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">
          Logs retidos por 90 dias
        </span>
      </div>
    </div>
  );
}
