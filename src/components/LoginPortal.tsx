import React, { useState } from "react";
import { motion } from "motion/react";
import { FileText, User as UserIcon, Shield, AlertCircle, LogIn } from "lucide-react";
import { User, AuditLog } from "../types";

interface LoginPortalProps {
  setCurrentUser: (u: User) => void;
  triggerToast: (msg: string) => void;
  auditLogs: AuditLog[];
  setAuditLogs: (logs: AuditLog[]) => void;
}

export default function LoginPortal({ setCurrentUser, triggerToast, auditLogs, setAuditLogs }: LoginPortalProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"admin" | "user">("admin");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError("Por favor ingrese un correo válido.");
      return;
    }
    
    const name = loginEmail.split("@")[0];
    const userObj: User = {
      id: "usr_" + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: loginEmail.toLowerCase(),
      role: loginRole,
    };

    setCurrentUser(userObj);
    localStorage.setItem("docuocr_user", JSON.stringify(userObj));
    triggerToast(`¡Bienvenido de nuevo, ${userObj.name}!`);

    // Log to audit
    const details = `Usuario ingresó al sistema con rol de ${loginRole.toUpperCase()}`;
    const newLog: AuditLog = {
      id: "log_" + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: userObj.email,
      userRole: userObj.role,
      action: "INICIO SESIÓN",
      fileName: "Seguridad",
      details,
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem("docuocr_logs", JSON.stringify(updated));
  };

  const handleQuickLogin = (role: "admin" | "user", email: string, name: string) => {
    const userObj: User = {
      id: role === "admin" ? "usr_admin" : "usr_user",
      name,
      email,
      role,
    };
    setCurrentUser(userObj);
    localStorage.setItem("docuocr_user", JSON.stringify(userObj));
    triggerToast(`Acceso de prueba como ${role === "admin" ? "Administrador" : "Usuario estándar"} concedido.`);

    const newLog: AuditLog = {
      id: "log_" + Date.now(),
      timestamp: new Date().toISOString(),
      userEmail: userObj.email,
      userRole: userObj.role,
      action: "ACCESO PRUEBA",
      fileName: "Seguridad",
      details: `Ingresó ${name} de prueba.`,
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem("docuocr_logs", JSON.stringify(updated));
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950" id="login_portal">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <FileText className="w-9 h-9 text-slate-905" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">PSV FormOCR</h1>
          <p className="text-slate-400 text-sm">
            Extractor del Estudio Socioeconómico Laboral a Word (.docx)
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="evaluador@psvasesores.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-100 transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Contraseña (Cualquiera para demo)
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-100 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Rol de Acceso
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginRole("admin")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition ${
                  loginRole === "admin"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Shield className="w-4 h-4" />
                Administrador
              </button>
              <button
                type="button"
                onClick={() => setLoginRole("user")}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium text-sm transition ${
                  loginRole === "user"
                    ? "bg-orange-500/20 border-orange-500 text-orange-300"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Evaluador Estándar
              </button>
            </div>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-950/40 border border-red-900 p-3.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Iniciar Sesión Evaluador
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-900 px-3 text-slate-500 font-semibold tracking-wider">
              Acceso Rápido de Prueba
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={() => handleQuickLogin("admin", "administrador@psvasesores.com", "Administrador")}
            className="py-2.5 px-3 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl text-amber-400 transition font-medium cursor-pointer"
          >
            Admin Demo
          </button>
          <button
            onClick={() => handleQuickLogin("user", "evaluador@psvasesores.com", "Evaluador")}
            className="py-2.5 px-3 bg-slate-950 border border-slate-800 hover:border-orange-500/40 rounded-xl text-orange-400 transition font-medium cursor-pointer"
          >
            Evaluador Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
