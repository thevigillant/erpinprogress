"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Settings,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Shield,
  ChevronRight,
} from "lucide-react";

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-indigo-500/10"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-particle ${
              Math.random() * 20 + 15
            }s linear infinite`,
            animationDelay: `${Math.random() * -20}s`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/configuracoes";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fillDemoCredentials = useCallback(() => {
    setEmail("admin@erp.com");
    setPassword("admin");
    setShowDemo(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Credenciais inválidas");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#040712] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(79,70,229,0.08) 0%, rgba(79,70,229,0.02) 50%, transparent 70%)",
            animation: "pulse-glow 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 60%)",
            animation: "pulse-glow 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 60%)",
            animation: "pulse-glow 12s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(4,7,18,0.8) 100%)",
        }}
      />

      <div
        className={`relative w-full max-w-[420px] transition-all duration-1000 ease-out ${
          mounted
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Security badge */}
        <div
          className={`flex justify-center mb-6 transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400/80 text-[11px] tracking-wide">
            <Shield size={11} />
            <span>Conexão segura · SSL/TLS</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-indigo-500/10 via-transparent to-purple-500/5 p-px">
            <div className="w-full h-full rounded-[28px] bg-[#0a0f1e]" />
          </div>

          {/* Card content */}
          <div className="relative bg-[#0a0f1e]/90 border border-slate-800/60 rounded-[28px] p-8 backdrop-blur-2xl shadow-2xl shadow-black/60">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-5">
                {/* Pulse ring */}
                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl animate-ping opacity-20" />
                {/* Icon container */}
                <div className="relative bg-gradient-to-br from-indigo-600/25 to-purple-600/15 border border-indigo-500/25 p-4.5 rounded-2xl shadow-lg shadow-indigo-600/15">
                  <Settings
                    size={30}
                    className="text-indigo-400"
                    strokeWidth={1.5}
                    style={{
                      animation: "slow-spin 20s linear infinite",
                    }}
                  />
                </div>
              </div>
              <h1 className="text-[26px] font-black tracking-tight text-white">
                ERP{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Global
                </span>
              </h1>
              <p className="text-slate-500 text-sm mt-1.5 text-center leading-relaxed">
                Sistema de Gestão Empresarial
              </p>
            </div>

            {/* Divider */}
            <div className="relative mb-7">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0f1e] px-3">
                <Lock size={10} className="text-slate-600" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400"
                >
                  <Mail size={11} className="text-slate-500" />
                  E-mail
                </label>
                <div className="relative group">
                  <div
                    className={`absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/50 to-purple-500/50 transition-opacity duration-300 ${
                      focusedField === "email"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-30"
                    }`}
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-3.5 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400"
                >
                  <Lock size={11} className="text-slate-500" />
                  Senha
                </label>
                <div className="relative group">
                  <div
                    className={`absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500/50 to-purple-500/50 transition-opacity duration-300 ${
                      focusedField === "password"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-30"
                    }`}
                  />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="relative w-full bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-3.5 pr-12 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800/50 z-10"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label
                  htmlFor="remember-me"
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                        rememberMe
                          ? "bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-600/30"
                          : "border-slate-600 group-hover:border-slate-500"
                      }`}
                    >
                      {rememberMe && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={4}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[12px] text-slate-500 group-hover:text-slate-400 transition-colors select-none">
                    Lembrar-me
                  </span>
                </label>

                <button
                  type="button"
                  className="text-[12px] text-indigo-400/70 hover:text-indigo-400 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2.5 bg-rose-500/8 border border-rose-500/15 rounded-xl px-4 py-3 text-rose-400 text-[13px]"
                  style={{
                    animation:
                      "shake 0.4s ease-in-out, fade-in 0.3s ease-out",
                  }}
                >
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:from-indigo-600/50 disabled:to-indigo-500/50 text-white font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 group"
              >
                {/* Shimmer effect */}
                {!loading && (
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}

                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar no Sistema
                    <ChevronRight
                      size={16}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full text-center text-[11px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
              >
                {showDemo
                  ? "Ocultar credenciais de demonstração"
                  : "Ver credenciais de demonstração"}
              </button>
              {showDemo && (
                <div
                  className="mt-3 bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 space-y-2"
                  style={{ animation: "fade-in 0.3s ease-out" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">E-mail:</span>
                    <code className="text-[11px] text-indigo-400/80 font-mono">
                      admin@erp.com
                    </code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Senha:</span>
                    <code className="text-[11px] text-indigo-400/80 font-mono">
                      admin
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="w-full mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/15 rounded-lg py-2 transition-all"
                  >
                    Preencher automaticamente
                  </button>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="mt-5 text-center">
              <p className="text-[11px] text-slate-700">
                Acesso restrito a usuários autorizados
              </p>
            </div>
          </div>
        </div>

        {/* Version tag */}
        <p
          className={`text-center text-slate-700/60 text-[11px] mt-6 transition-all duration-700 delay-500 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          ERP Global v1.0 · Sistema de Gestão Empresarial
        </p>

    </div>
    </div>
  );
}

