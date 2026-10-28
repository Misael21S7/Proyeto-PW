import React from "react";
import { Settings, Shield, AlertCircle, Clock } from "lucide-react";
import { User, ExportPermissions, AuditLog } from "../types";

interface SettingsPanelProps {
  currentUser: User;
  exportPermissions: ExportPermissions;
  savePermissionsToStorage: (p: ExportPermissions) => void;
  addAuditLog: (action: string, file: string, detail: string) => void;
  triggerToast: (msg: string) => void;
  auditLogs: AuditLog[];
  setAuditLogs: (logs: AuditLog[]) => void;
}

export default function SettingsPanel({
  currentUser,
  exportPermissions,
  savePermissionsToStorage,
  addAuditLog,
  triggerToast,
  auditLogs,
  setAuditLogs,
}: SettingsPanelProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-8 animate-fade-in" id="settings_panel">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5.5 h-5.5 text-amber-500" />
          Configuración Avanzada del Sistema
        </h3>
        <p className="text-slate-400 text-xs mt-1">
          Gestiona los permisos globales de exportación de la plataforma, límites de tamaño e inspecciona la bitácora de auditoría.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL 1: CONTROL DE PERMISOS DE EXPORTACIÓN */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-amber-500 animate-pulse" />
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Permisos de Exportación
            </h4>
          </div>

          {currentUser.role !== "admin" && (
            <div className="bg-amber-950/40 border border-amber-900/60 rounded-xl p-4 flex gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Modo de Vista Protegida</p>
                <p className="text-amber-400/80 mt-0.5 leading-relaxed">
                  Solo los administradores del sistema pueden modificar estas configuraciones de permisos globales de Word.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Standard User Download Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Descargas a Evaluadores Estándar
                </label>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  Permitir que roles estándar descarguen en Word.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={currentUser.role !== "admin"}
                checked={exportPermissions.allowUserDownload}
                onChange={(e) => {
                  const updated = { ...exportPermissions, allowUserDownload: e.target.checked };
                  savePermissionsToStorage(updated);
                  addAuditLog("CAMBIO PERMISOS", "Configuración", `Descargas a usuarios normales: ${e.target.checked ? "HABILITADO" : "DESHABILITADO"}`);
                  triggerToast("Permiso de descargas estándar actualizado.");
                }}
                className="w-10 h-5 bg-slate-950 checked:bg-amber-500 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Admin Approval Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Requerir Firma de Admin
                </label>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  Obligatoria aprobación antes de bajar el archivo .docx.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={currentUser.role !== "admin"}
                checked={exportPermissions.requireAdminApproval}
                onChange={(e) => {
                  const updated = { ...exportPermissions, requireAdminApproval: e.target.checked };
                  savePermissionsToStorage(updated);
                  addAuditLog("CAMBIO PERMISOS", "Configuración", `Requerir aprobación admin: ${e.target.checked ? "SÍ" : "NO"}`);
                  triggerToast("Requisito de firma admin actualizado.");
                }}
                className="w-10 h-5 bg-slate-950 checked:bg-amber-500 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Format word Enabled Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <label className="text-xs font-semibold text-slate-200 block">
                  Formato Word (.docx) Habilitado
                </label>
                <span className="text-[10px] text-slate-500 leading-normal block">
                  Habilita el empaquetador del motor Office Docx.
                </span>
              </div>
              <input
                type="checkbox"
                disabled={currentUser.role !== "admin"}
                checked={exportPermissions.docxFormatEnabled}
                onChange={(e) => {
                  const updated = { ...exportPermissions, docxFormatEnabled: e.target.checked };
                  savePermissionsToStorage(updated);
                  addAuditLog("CAMBIO PERMISOS", "Configuración", `Empaquetador Word habilitado: ${e.target.checked ? "SÍ" : "NO"}`);
                  triggerToast("Estado del empaquetador Word modificado.");
                }}
                className="w-10 h-5 bg-slate-950 checked:bg-amber-500 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Limit Input */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block">
                Límite de Imágenes por Documento
              </label>
              <input
                type="number"
                disabled={currentUser.role !== "admin"}
                value={exportPermissions.maxImageLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  const updated = { ...exportPermissions, maxImageLimit: val };
                  savePermissionsToStorage(updated);
                  addAuditLog("CAMBIO CONFIG", "Límites", `Límite de imágenes modificado a: ${val}`);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                min="1"
                max="15"
              />
            </div>
          </div>
        </div>

        {/* PANEL 2: COMPREHENSIVE AUDIT LOGS (RIGHT / SPAN-2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-white text-sm uppercase tracking-wider">
                Bitácora de Auditoría Integral
              </h4>
            </div>

            {currentUser.role === "admin" && (
              <button
                onClick={() => {
                  if (confirm("¿Seguro que desea limpiar la bitácora de auditoría? Esta acción es irreversible.")) {
                    setAuditLogs([]);
                    localStorage.removeItem("docuocr_logs");
                    triggerToast("Bitácora de auditoría limpiada.");
                  }
                }}
                className="text-[10px] bg-red-600/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white font-bold px-2.5 py-1 rounded-lg transition duration-150 cursor-pointer"
              >
                Limpiar Bitácora
              </button>
            )}
          </div>

          {/* Table View of Logs */}
          <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto border border-slate-800 rounded-xl bg-slate-950/30">
            {auditLogs.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 font-mono">
                No hay logs de auditoría disponibles en esta sesión.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold select-none">
                    <th className="p-3">Marca Temporal</th>
                    <th className="p-3">Usuario / Email</th>
                    <th className="p-3">Acción</th>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/30 transition-all text-slate-300">
                      <td className="p-3 whitespace-nowrap text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${log.userRole === "admin" ? "bg-amber-400" : "bg-orange-400"}`}></span>
                          <span className="truncate max-w-[120px]" title={log.userEmail}>{log.userEmail.split("@")[0]}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider ${
                          log.action.includes("ERROR")
                            ? "bg-red-600/10 text-red-400 border border-red-500/10"
                            : log.action.includes("PERMISOS")
                            ? "bg-amber-600/10 text-amber-400 border border-amber-500/10"
                            : log.action.includes("EXTRACCIÓN")
                            ? "bg-teal-600/10 text-teal-400 border border-teal-500/10"
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 truncate max-w-[100px]" title={log.fileName}>{log.fileName}</td>
                      <td className="p-3 text-slate-400 leading-relaxed">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
