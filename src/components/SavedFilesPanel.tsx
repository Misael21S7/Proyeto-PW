import React from "react";
import { FolderOpen, FileText, Trash2, Eye, Download, Clock } from "lucide-react";
import { SavedFile, SocioeconomicStudy } from "../types";

interface SavedFilesPanelProps {
  savedFiles: SavedFile[];
  deleteSavedFile: (id: string, name: string) => void;
  loadSavedFileIntoWorkspace: (file: SavedFile) => void;
  handleWordDownload: (docData: SocioeconomicStudy, customName: string) => void;
  setActiveTab: (tab: "analyze" | "files" | "settings") => void;
}

export default function SavedFilesPanel({
  savedFiles,
  deleteSavedFile,
  loadSavedFileIntoWorkspace,
  handleWordDownload,
  setActiveTab,
}: SavedFilesPanelProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto space-y-6 animate-fade-in" id="files_panel">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-5.5 h-5.5 text-amber-500" />
            Carpeta de Archivos Creados
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Repositorio local persistente de estudios socioeconómicos analizados y estructurados. Estos archivos no desaparecen al recargar.
          </p>
        </div>
        
        {/* Quick stats */}
        <div className="flex gap-4 text-xs font-mono bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">Total Guardados</span>
            <span className="text-sm font-bold text-amber-400">{savedFiles.length} documentos</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND GRID */}
      {savedFiles.length === 0 ? (
        <div className="text-center py-20 bg-slate-950/20 rounded-3xl border border-slate-800/50 max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-white font-bold">No hay archivos en tu carpeta</h4>
            <p className="text-slate-500 text-xs mt-1">
              Sube imágenes y procésalas en el Espacio de Análisis para guardar tus primeros resultados.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("analyze")}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition cursor-pointer"
          >
            Ir a Crear Nuevo Documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between h-[230px]"
            >
              <div className="space-y-3 overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-orange-400 px-2 py-0.5 rounded-full uppercase">
                    ESTUDIO S.E.L.
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm tracking-tight truncate hover:text-amber-400 transition" title={file.name}>
                    {file.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    Puesto: {file.document.puesto || "No especificado"} • Empresa: {file.document.empresaSolicitada || "No especificada"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">
                    Candidato: {file.document.nombre || "Sin nombre extraído"}
                  </p>
                </div>
              </div>

              {/* Document Footer details */}
              <div className="border-t border-slate-800/80 pt-3 mt-4 flex items-center justify-between flex-shrink-0">
                <div className="text-[9px] font-mono text-slate-500 space-y-0.5">
                  <div>Creado por: {file.ownerName}</div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(file.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Action elements */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => deleteSavedFile(file.id, file.name)}
                    title="Eliminar de la base de datos"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/10 transition duration-150 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => loadSavedFileIntoWorkspace(file)}
                    title="Cargar en editor principal"
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl border border-transparent hover:border-amber-500/10 transition duration-150 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleWordDownload(file.document, file.name)}
                    title="Descargar en Word"
                    className="p-2 bg-slate-950 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl border border-slate-800 hover:border-amber-500/20 transition duration-150 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
