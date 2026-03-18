"use client";

import { useState } from "react";
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  Monitor,
  Clock,
  AlertTriangle,
  Check,
  X,
  Key,
  Fingerprint,
  Globe,
  RefreshCw,
  Zap,
  LogOut,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Tipos ──────────────────────────────────────────
interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expirationDays: number;
  preventReuse: number;
  maxAttempts: number;
  lockoutMinutes: number;
}

interface ActiveSession {
  id: string;
  usuario: string;
  dispositivo: string;
  ip: string;
  localizacao: string;
  iniciadoEm: string;
  ultimaAtividade: string;
  isCurrent: boolean;
}

// ── Dados Mock ──────────────────────────────────────
const initialPolicy: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  expirationDays: 90,
  preventReuse: 5,
  maxAttempts: 3,
  lockoutMinutes: 30,
};

const activeSessions: ActiveSession[] = [
  {
    id: "SES-001",
    usuario: "Bruno Reis",
    dispositivo: "Chrome 134 / Windows 11",
    ip: "192.168.1.100",
    localizacao: "São Paulo, SP",
    iniciadoEm: "2026-03-16T08:30:00",
    ultimaAtividade: "2026-03-16T15:57:00",
    isCurrent: true,
  },
  {
    id: "SES-002",
    usuario: "Ana Carolina Silva",
    dispositivo: "Firefox 135 / macOS 15",
    ip: "192.168.1.105",
    localizacao: "São Paulo, SP",
    iniciadoEm: "2026-03-16T09:00:00",
    ultimaAtividade: "2026-03-16T15:45:00",
    isCurrent: false,
  },
  {
    id: "SES-003",
    usuario: "Rafael Almeida",
    dispositivo: "Chrome 134 / Linux",
    ip: "192.168.1.112",
    localizacao: "São Paulo, SP",
    iniciadoEm: "2026-03-16T10:15:00",
    ultimaAtividade: "2026-03-16T15:55:00",
    isCurrent: false,
  },
  {
    id: "SES-004",
    usuario: "Pedro Henrique Costa",
    dispositivo: "Chrome 134 / Windows 11",
    ip: "192.168.1.110",
    localizacao: "Rio de Janeiro, RJ",
    iniciadoEm: "2026-03-16T11:00:00",
    ultimaAtividade: "2026-03-16T14:30:00",
    isCurrent: false,
  },
  {
    id: "SES-005",
    usuario: "Maria Fernanda Oliveira",
    dispositivo: "Safari 19 / macOS 15",
    ip: "192.168.1.108",
    localizacao: "São Paulo, SP",
    iniciadoEm: "2026-03-16T10:00:00",
    ultimaAtividade: "2026-03-16T15:30:00",
    isCurrent: false,
  },
  {
    id: "SES-006",
    usuario: "Juliana Santos",
    dispositivo: "Edge 134 / Windows 11",
    ip: "192.168.1.115",
    localizacao: "Campinas, SP",
    iniciadoEm: "2026-03-16T08:00:00",
    ultimaAtividade: "2026-03-16T13:00:00",
    isCurrent: false,
  },
];

// ── Componente principal ──────────────────────────────
export default function SecurityTab() {
  const [policy, setPolicy] = useState<PasswordPolicy>(initialPolicy);
  const [sessions, setSessions] = useState<ActiveSession[]>(activeSessions);
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleRevokeAll = () => {
    if (confirm("Tem certeza que deseja encerrar todas as sessões (exceto a sua)?")) {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">
            Segurança do Sistema
          </h2>
          <p className="text-sm text-slate-500">
            Políticas de acesso, sessões ativas e configurações de segurança
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Políticas de Senha */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Key size={16} className="text-rose-400" /> Política de Senhas
            </h3>
            {isEditingPolicy ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditingPolicy(false)}
                  className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setIsEditingPolicy(false)}
                  className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <Check size={12} /> Salvar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingPolicy(true)}
                className="bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              >
                Editar
              </button>
            )}
          </div>

          <div className="space-y-4">
            <PolicyRow
              label="Comprimento Mínimo"
              value={`${policy.minLength} caracteres`}
              icon={<Lock size={14} />}
              editing={isEditingPolicy}
              editComponent={
                <input
                  type="number"
                  value={policy.minLength}
                  onChange={(e) => setPolicy({ ...policy, minLength: parseInt(e.target.value) })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white text-center focus:outline-none focus:border-rose-500/50"
                />
              }
            />
            <PolicyToggle
              label="Exigir Maiúsculas"
              enabled={policy.requireUppercase}
              onChange={(v) => setPolicy({ ...policy, requireUppercase: v })}
              editing={isEditingPolicy}
            />
            <PolicyToggle
              label="Exigir Minúsculas"
              enabled={policy.requireLowercase}
              onChange={(v) => setPolicy({ ...policy, requireLowercase: v })}
              editing={isEditingPolicy}
            />
            <PolicyToggle
              label="Exigir Números"
              enabled={policy.requireNumbers}
              onChange={(v) => setPolicy({ ...policy, requireNumbers: v })}
              editing={isEditingPolicy}
            />
            <PolicyToggle
              label="Exigir Caracteres Especiais"
              enabled={policy.requireSpecialChars}
              onChange={(v) => setPolicy({ ...policy, requireSpecialChars: v })}
              editing={isEditingPolicy}
            />
            <PolicyRow
              label="Expiração da Senha"
              value={`${policy.expirationDays} dias`}
              icon={<Clock size={14} />}
              editing={isEditingPolicy}
              editComponent={
                <input
                  type="number"
                  value={policy.expirationDays}
                  onChange={(e) => setPolicy({ ...policy, expirationDays: parseInt(e.target.value) })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white text-center focus:outline-none focus:border-rose-500/50"
                />
              }
            />
            <PolicyRow
              label="Impedir Reutilização"
              value={`Últimas ${policy.preventReuse} senhas`}
              icon={<RefreshCw size={14} />}
              editing={isEditingPolicy}
              editComponent={
                <input
                  type="number"
                  value={policy.preventReuse}
                  onChange={(e) => setPolicy({ ...policy, preventReuse: parseInt(e.target.value) })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white text-center focus:outline-none focus:border-rose-500/50"
                />
              }
            />
            <PolicyRow
              label="Tentativas Máximas de Login"
              value={`${policy.maxAttempts} tentativas`}
              icon={<AlertTriangle size={14} />}
              editing={isEditingPolicy}
              editComponent={
                <input
                  type="number"
                  value={policy.maxAttempts}
                  onChange={(e) => setPolicy({ ...policy, maxAttempts: parseInt(e.target.value) })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white text-center focus:outline-none focus:border-rose-500/50"
                />
              }
            />
            <PolicyRow
              label="Bloqueio após Exceder"
              value={`${policy.lockoutMinutes} minutos`}
              icon={<Lock size={14} />}
              editing={isEditingPolicy}
              editComponent={
                <input
                  type="number"
                  value={policy.lockoutMinutes}
                  onChange={(e) => setPolicy({ ...policy, lockoutMinutes: parseInt(e.target.value) })}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white text-center focus:outline-none focus:border-rose-500/50"
                />
              }
            />
          </div>
        </div>

        {/* Configurações de Segurança Avançada */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-black text-white flex items-center gap-2 mb-6">
              <Shield size={16} className="text-rose-400" /> Segurança Avançada
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Fingerprint size={20} className="text-indigo-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Autenticação de 2 Fatores (2FA)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Exigir código OTP para todos os logins
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={cn(
                    "h-7 w-12 rounded-full flex items-center px-0.5 transition-all",
                    twoFactorEnabled
                      ? "bg-emerald-600 justify-end"
                      : "bg-slate-700 justify-start"
                  )}
                >
                  <div className="h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {twoFactorEnabled ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <X size={12} className="text-slate-500" />
                    )}
                  </div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Whitelist de IP
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Permitir acesso apenas de IPs autorizados
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIpWhitelist(!ipWhitelist)}
                  className={cn(
                    "h-7 w-12 rounded-full flex items-center px-0.5 transition-all",
                    ipWhitelist
                      ? "bg-emerald-600 justify-end"
                      : "bg-slate-700 justify-start"
                  )}
                >
                  <div className="h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center">
                    {ipWhitelist ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <X size={12} className="text-slate-500" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Resumo de Segurança */}
          <div className="bg-rose-600 rounded-2xl p-6 text-white shadow-2xl shadow-rose-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black mb-2 flex items-center gap-2">
                <Zap size={18} /> Nível de Segurança
              </h3>
              <p className="text-rose-100 text-sm mb-6 opacity-80">
                Avaliação geral da sua infraestrutura de segurança
              </p>

              <div className="flex items-center gap-4">
                <div className="text-5xl font-black">92%</div>
                <div className="flex-1">
                  <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: "92%" }}
                    />
                  </div>
                  <p className="text-[10px] mt-2 uppercase tracking-wider opacity-60 font-bold">
                    Excelente — Todas as políticas ativas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessões Ativas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Monitor size={18} className="text-rose-400" /> Sessões Ativas
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black uppercase">
              {sessions.length} online
            </span>
          </h3>
          <button
            onClick={handleRevokeAll}
            className="bg-rose-600/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-600/20 transition-all flex items-center gap-2"
          >
            <LogOut size={14} /> Encerrar Todas
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center justify-between p-4 bg-slate-900/40 border rounded-2xl transition-all",
                session.isCurrent
                  ? "border-emerald-500/30"
                  : "border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-2.5 rounded-xl",
                    session.isCurrent
                      ? "bg-emerald-500/10"
                      : "bg-slate-800"
                  )}
                >
                  {session.dispositivo.includes("Chrome") ? (
                    <Monitor
                      size={18}
                      className={
                        session.isCurrent ? "text-emerald-400" : "text-slate-400"
                      }
                    />
                  ) : session.dispositivo.includes("Safari") ? (
                    <Globe
                      size={18}
                      className={
                        session.isCurrent ? "text-emerald-400" : "text-slate-400"
                      }
                    />
                  ) : (
                    <Smartphone
                      size={18}
                      className={
                        session.isCurrent ? "text-emerald-400" : "text-slate-400"
                      }
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {session.usuario}
                    </span>
                    {session.isCurrent && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-black uppercase">
                        Sessão Atual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                    <span>{session.dispositivo}</span>
                    <span>•</span>
                    <span className="font-mono">{session.ip}</span>
                    <span>•</span>
                    <span>{session.localizacao}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Última atividade
                  </div>
                  <div className="text-xs text-white font-mono">
                    {new Date(session.ultimaAtividade).toLocaleString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Encerrar sessão"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componentes auxiliares ──────────────────────────
function PolicyRow({
  label,
  value,
  icon,
  editing,
  editComponent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  editing: boolean;
  editComponent: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="text-slate-500">{icon}</div>
        <span className="text-sm text-slate-300 font-medium">{label}</span>
      </div>
      {editing ? (
        editComponent
      ) : (
        <span className="text-sm text-white font-bold">{value}</span>
      )}
    </div>
  );
}

function PolicyToggle({
  label,
  enabled,
  onChange,
  editing,
}: {
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  editing: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-slate-800/50">
      <div className="flex items-center gap-3">
        <div className="text-slate-500">
          {enabled ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-slate-600" />}
        </div>
        <span className="text-sm text-slate-300 font-medium">{label}</span>
      </div>
      {editing ? (
        <button
          onClick={() => onChange(!enabled)}
          className={cn(
            "h-6 w-11 rounded-full flex items-center px-0.5 transition-all",
            enabled ? "bg-emerald-600 justify-end" : "bg-slate-700 justify-start"
          )}
        >
          <div className="h-5 w-5 rounded-full bg-white shadow-md" />
        </button>
      ) : (
        <span
          className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded border uppercase",
            enabled
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
          )}
        >
          {enabled ? "Ativo" : "Inativo"}
        </span>
      )}
    </div>
  );
}
