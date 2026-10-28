import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  FileText, UploadCloud, FolderOpen, Settings, Shield, Clock, ChevronRight, Sparkles, AlertCircle, Info, LogOut, Trash2, User as UserIcon
} from "lucide-react";

import { SocioeconomicStudy, SavedFile, User, ExportPermissions, AuditLog } from "./types";
import { DEMO_TEMPLATES } from "./data/mockTemplates";
import { exportToDocx } from "./utils/docxExport";

import LoginPortal from "./components/LoginPortal";
import SettingsPanel from "./components/SettingsPanel";
import SavedFilesPanel from "./components/SavedFilesPanel";
import SocioeconomicFormEditor from "./components/SocioeconomicFormEditor";

export default function App() {
  // 1. SESSION & USER AUTHENTICATION STATES
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("docuocr_user");
    return saved ? JSON.parse(saved) : null;
  });

  // 2. ACTIVE WORKSPACE TAB
  const [activeTab, setActiveTab] = useState<"analyze" | "files" | "settings">("analyze");

  // 3. IMAGE UPLOAD STATES
  const [uploadedImages, setUploadedImages] = useState<{ file: File; data: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 4. USER CUSTOM PROMPT INSTRUCTION
  const [customPrompt, setCustomPrompt] = useState("");

  // 5. ANALYSIS SIMULATOR & STEPPER
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [activeStepList, setActiveStepList] = useState<{ text: string; status: "pending" | "active" | "done" }[]>([]);

  // 6. ACTIVE EDITABLE DOCUMENT STATE
  const [activeDocument, setActiveDocument] = useState<SocioeconomicStudy | null>(null);
  const [savingFileName, setSavingFileName] = useState("");
  const [apiError, setApiError] = useState("");

  // 7. TOAST FEEDBACK NOTIFICATION
  const [toastMessage, setToastMessage] = useState("");

  // 8. PERSISTED APP ARCHIVES STORAGE
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>(() => {
    const saved = localStorage.getItem("docuocr_files");
    if (saved) return JSON.parse(saved);
    // Initialize with our beautiful demo candidate study
    const initialFile: SavedFile = {
      id: "demo_study",
      name: "Estudio Socioeconómico - Christian Silva Tirado",
      document: DEMO_TEMPLATES[0].document,
      images: [DEMO_TEMPLATES[0].imageUrl],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      ownerId: "system",
      ownerName: "Sistema Sintáctico Pro"
    };
    localStorage.setItem("docuocr_files", JSON.stringify([initialFile]));
    return [initialFile];
  });

  // 9. SECURITY & PERMISSIONS
  const [exportPermissions, setExportPermissions] = useState<ExportPermissions>(() => {
    const saved = localStorage.getItem("docuocr_permissions");
    if (saved) return JSON.parse(saved);
    const defaultPerms: ExportPermissions = {
      allowUserDownload: true,
      requireAdminApproval: false,
      docxFormatEnabled: true,
      maxImageLimit: 12
    };
    localStorage.setItem("docuocr_permissions", JSON.stringify(defaultPerms));
    return defaultPerms;
  });

  // 10. COMPREHENSIVE AUDIT LOGS
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("docuocr_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // Trigger temporary notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Helper to log platform activity
  const addAuditLog = (action: string, file: string, detail: string) => {
    const newLog: AuditLog = {
      id: "log_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      userEmail: currentUser?.email || "anonimo@psvasesores.com",
      userRole: currentUser?.role || "user",
      action,
      fileName: file,
      details: detail
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem("docuocr_logs", JSON.stringify(updated));
  };

  // Drag-and-Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      processFiles(files);
    }
  };

  const processFiles = (files: File[]) => {
    const imagesOnly = files.filter(f => f.type.startsWith("image/"));
    if (imagesOnly.length === 0) {
      triggerToast("Error: Solo se admiten archivos de imagen (PNG, JPG, WEBP).");
      return;
    }

    if (uploadedImages.length + imagesOnly.length > exportPermissions.maxImageLimit) {
      triggerToast(`Límite excedido. El administrador configuró un máximo de ${exportPermissions.maxImageLimit} imágenes.`);
      return;
    }

    imagesOnly.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, { file, data: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });

    triggerToast(`¡Agregadas ${imagesOnly.length} imágenes para análisis!`);
    addAuditLog("SIDA ARCHIVO", "Imágenes", `Cargó ${imagesOnly.length} imágenes en el lote de análisis.`);
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Logout Handler
  const handleLogout = () => {
    addAuditLog("CERRÓ SESIÓN", "Seguridad", "Usuario finalizó su sesión activa.");
    setCurrentUser(null);
    localStorage.removeItem("docuocr_user");
    triggerToast("Sesión terminada de forma segura.");
  };

  // Demo template loader
  const loadDemoTemplate = (temp: typeof DEMO_TEMPLATES[0]) => {
    setActiveDocument(JSON.parse(JSON.stringify(temp.document)));
    setSavingFileName(temp.name);
    setUploadedImages([]);
    triggerToast(`¡Cargado demo: ${temp.name}!`);
    addAuditLog("CARGAR DEMO", temp.name, "Cargó plantilla socioeconómica de demostración.");
  };

  // Save / Update active workspace document to persistent local storage
  const saveDocumentToFolder = () => {
    if (!activeDocument) return;
    
    const isExisting = savedFiles.find(f => f.name === savingFileName);
    let updated: SavedFile[];

    if (isExisting) {
      updated = savedFiles.map(f => {
        if (f.name === savingFileName) {
          return {
            ...f,
            document: activeDocument,
            lastModified: new Date().toISOString()
          };
        }
        return f;
      });
      triggerToast("¡Estudio socioeconómico actualizado permanentemente!");
      addAuditLog("GUARDAR ACTUALIZACIÓN", savingFileName, "Modificó y guardó cambios en el documento.");
    } else {
      const newFile: SavedFile = {
        id: "file_" + Date.now(),
        name: savingFileName || `Estudio Socioeconómico - ${activeDocument.nombre || "Nuevo"}`,
        document: activeDocument,
        images: uploadedImages.map(img => img.data),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        ownerId: currentUser?.id || "usr_anon",
        ownerName: currentUser?.name || "Evaluador Anónimo"
      };
      updated = [newFile, ...savedFiles];
      triggerToast("¡Estudio socioeconómico guardado permanentemente!");
      addAuditLog("GUARDAR NUEVO", newFile.name, "Creó nuevo registro permanente en la base de datos local.");
    }

    setSavedFiles(updated);
    localStorage.setItem("docuocr_files", JSON.stringify(updated));
  };

  // Load a saved file from the library into the active workspace editor
  const loadSavedFileIntoWorkspace = (file: SavedFile) => {
    setActiveDocument(JSON.parse(JSON.stringify(file.document)));
    setSavingFileName(file.name);
    setActiveTab("analyze");
    triggerToast(`Documento "${file.name}" cargado en el editor.`);
    addAuditLog("ABRIR ARCHIVO", file.name, "Cargó archivo guardado para edición.");
  };

  // Delete saved file from the library
  const deleteSavedFile = (id: string, name: string) => {
    if (confirm(`¿Seguro que desea eliminar permanentemente "${name}"? Esta acción es irreversible.`)) {
      const filtered = savedFiles.filter(f => f.id !== id);
      setSavedFiles(filtered);
      localStorage.setItem("docuocr_files", JSON.stringify(filtered));
      triggerToast("Archivo eliminado de la carpeta local.");
      addAuditLog("ELIMINAR ARCHIVO", name, "Eliminó archivo de la carpeta local.");
    }
  };

  // Trigger Word Download file export
  const handleWordDownload = async (
    docData: SocioeconomicStudy, 
    customName: string, 
    formatStyle: "clasico" | "ejecutivo" | "minimalista" = "clasico"
  ) => {
    // 1. CHECK PLATFORM PERMISSIONS
    if (!exportPermissions.docxFormatEnabled) {
      triggerToast("Error: El empaquetador Word (.docx) está temporalmente deshabilitado por el administrador.");
      return;
    }

    if (currentUser?.role !== "admin" && !exportPermissions.allowUserDownload) {
      triggerToast("Error: Su rol de evaluador estándar no tiene privilegios de descarga.");
      return;
    }

    if (exportPermissions.requireAdminApproval && currentUser?.role !== "admin") {
      triggerToast("Aviso: Requiere aprobación y firma digital del administrador para esta descarga.");
      return;
    }

    try {
      addAuditLog("EXPORTACIÓN DOCX", customName, `Generando archivo de Word empaquetado estilo ${formatStyle} en base a datos decodificados.`);
      const fileName = customName.endsWith(".docx") ? customName : `${customName}.docx`;
      await exportToDocx(docData, fileName, formatStyle);
      triggerToast("¡Descarga de Word completada exitosamente!");
    } catch (err: any) {
      console.error(err);
      triggerToast(`Error al empaquetar Word: ${err.message}`);
      addAuditLog("ERROR EXPORTACIÓN", customName, `Fallo del empaquetador Word: ${err.message}`);
    }
  };

  // Inicia el análisis OCR multimodal con IA
  const startAIAnalysis = async () => {
    if (uploadedImages.length === 0) return;
 
    setIsAnalyzing(true);
    setApiError("");
    setAnalysisStepIndex(0);
    setElapsedSeconds(0);
 
    // Progressive UI Stepper messages
    const steps = [
      { text: "Decodificando imágenes del lote y extrayendo metadatos binarios...", status: "active" as const },
      { text: "Buscando patrones y ejecutando analizador sintáctico de tablas...", status: "pending" as const },
      { text: "Llamando al motor de inteligencia artificial...", status: "pending" as const },
      { text: "Estructurando datos bajo el formato oficial del Estudio Socioeconómico Laboral...", status: "pending" as const },
      { text: "Finalizando transcripción y previsualización editable interactiva...", status: "pending" as const }
    ];
    setActiveStepList(steps);
 
    // Progressive step simulation speeds
    const interval = setInterval(() => {
      setAnalysisStepIndex(prev => {
        const next = prev + 1;
        if (next < steps.length) {
          setActiveStepList(curr => curr.map((s, idx) => {
            if (idx < next) return { ...s, status: "done" };
            if (idx === next) return { ...s, status: "active" };
            return s;
          }));
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1800);

    const elapsedInterval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
 
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: uploadedImages.map(img => img.data),
          customPrompt
        })
      });
 
      if (!response.ok) {
        // Try parsing error as JSON for cleaner diagnostics
        let errorMessage = "";
        try {
          const errData = await response.json();
          errorMessage = errData.details || errData.error || JSON.stringify(errData);
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage || `Servidor respondió con código ${response.status}`);
      }
 
      const result: SocioeconomicStudy = await response.json();
 
      clearInterval(interval);
      clearInterval(elapsedInterval);
      setActiveStepList(curr => curr.map(s => ({ ...s, status: "done" })));
      
      // Load resulting structure into active document
      setActiveDocument(result);
      setSavingFileName(`Estudio Socioeconómico - ${result.nombre || "Candidato Extraído"}`);
      
      triggerToast("¡Análisis y transcripción completados por IA exitosamente!");
      addAuditLog("EXTRACCIÓN IA SUCESO", `Estudio Socioeconómico - ${result.nombre || "Candidato"}`, `Completó análisis OCR sintáctico en ${elapsedSeconds}s de forma óptima.`);
 
    } catch (err: any) {
      console.error(err);
      clearInterval(interval);
      clearInterval(elapsedInterval);
      setApiError(err.message || "Error desconocido durante la extracción.");
      addAuditLog("ERROR EXTRACCIÓN IA", "Sistema", `Fallo OCR: ${err.message}`);
      triggerToast("Fallo en el analizador de IA. Revise el diagnóstico de error.");
    } finally {
      clearInterval(elapsedInterval);
      setIsAnalyzing(false);
    }
  };

  // If not logged in, force Login portal
  if (!currentUser) {
    return (
      <LoginPortal
        setCurrentUser={setCurrentUser}
        triggerToast={triggerToast}
        auditLogs={auditLogs}
        setAuditLogs={setAuditLogs}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* GLOBAL TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border-l-4 border-amber-500 text-slate-100 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CORE WORKSPACE SCREEN WITH Persistent SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR PANEL */}
        <aside className="w-80 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0">
          <div>
            {/* BRAND HEADER LOGO */}
            <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <FileText className="w-5.5 h-5.5 text-slate-950" />
              </div>
              <div>
                <h2 className="font-extrabold text-white tracking-tight text-sm">PSV FormOCR</h2>
                <span className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase block">
                  Estudio Socioeconómico IA
                </span>
              </div>
            </div>

            {/* USER PROFILE INFO */}
            <div className="p-4 mx-4 my-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                  {currentUser.role === "admin" ? (
                    <Shield className="w-4.5 h-4.5 text-amber-400" />
                  ) : (
                    <UserIcon className="w-4.5 h-4.5 text-orange-400" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-orange-400'}`}></span>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400 truncate">
                      {currentUser.role === "admin" ? "Administrador" : "Evaluador"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión segura"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="px-3 space-y-1">
              <button
                onClick={() => setActiveTab("analyze")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all ${
                  activeTab === "analyze"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <UploadCloud className="w-4.5 h-4.5" />
                <span>Espacio de Análisis</span>
                {uploadedImages.length > 0 && activeTab !== "analyze" && (
                  <span className="ml-auto bg-amber-500 text-slate-950 text-[9px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                    {uploadedImages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("files")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all ${
                  activeTab === "files"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <FolderOpen className="w-4.5 h-4.5" />
                <span>Archivos Guardados</span>
                <span className="ml-auto bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {savedFiles.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all ${
                  activeTab === "settings"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <Settings className="w-4.5 h-4.5" />
                <span>Configuración</span>
                {currentUser.role === "admin" && (
                  <span className="ml-auto bg-amber-500/10 text-amber-400 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold">
                    Control
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* SIDEBAR FOOTER LOG */}
          <div className="p-4 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
            <div className="flex items-center justify-between mb-1">
              <span>Estado del Motor OCR:</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                ONLINE
              </span>
            </div>
            <div>PSV Asesores v2.5</div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-900" id="main_content_area">
          
          {/* TAB 1: ANALYSIS COCKPIT */}
          {activeTab === "analyze" && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* LEFT DRAWER CONTROL PANEL */}
              <div className="w-[400px] border-r border-slate-800/80 p-6 overflow-y-auto flex-shrink-0 flex flex-col justify-between space-y-6 bg-slate-950/20">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                      <UploadCloud className="w-5 h-5 text-amber-500" />
                      Cargar Páginas de Estudio
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Sube fotos o escaneos (JPG, JPEG, PNG). El motor de IA está optimizado para procesar capturas imperfectas de cámaras de celular con sombras, inclinación y texto manuscrito.
                    </p>
                  </div>

                  {/* DRAG AND DROP AREA */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                      isDragging
                        ? "border-amber-500 bg-amber-500/10 scale-[0.99]"
                        : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-xs font-semibold text-slate-300">
                      Arrastra tus fotos de estudio aquí o haz clic
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Formatos: PNG, JPG, WEBP. Límite: {exportPermissions.maxImageLimit} páginas.
                    </p>
                  </div>

                  {/* UPLOADED IMAGE COCKPIT PREVIEWS */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Páginas Cargadas ({uploadedImages.length})
                        </span>
                        <button
                          onClick={() => setUploadedImages([])}
                          className="text-[10px] font-bold text-red-400 hover:underline"
                        >
                          Limpiar lote
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 max-h-[140px] overflow-y-auto">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                            <img
                              src={img.data}
                              alt="Pre-upload"
                              className="w-full h-full object-cover animate-fade-in"
                            />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeUploadedImage(idx);
                                }}
                                className="p-1 bg-red-600 rounded-md text-white hover:bg-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CUSTOM OCR EXTRACTION RULES */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Instrucciones de Extracción Específicas (Opcional)
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Ej: 'Ignorar tachaduras de pluma en la sección de vivienda', 'Traducir comentarios al español'..."
                      className="w-full h-16 p-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-amber-500 focus:outline-none text-xs text-slate-200 placeholder-slate-500"
                    />
                  </div>

                  {/* QUICK DEMO LOADERS */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      ¿Sin fotos? Prueba un Candidato de Demostración
                    </h4>
                    <div className="space-y-2">
                      {DEMO_TEMPLATES.map((temp) => (
                        <button
                          key={temp.id}
                          type="button"
                          onClick={() => loadDemoTemplate(temp)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 text-left transition cursor-pointer"
                        >
                          <img
                            src={temp.imageUrl}
                            alt={temp.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800"
                          />
                          <div className="overflow-hidden">
                            <h5 className="text-xs font-semibold text-slate-200 truncate">{temp.name}</h5>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-850 text-slate-400 font-medium font-mono">
                              {temp.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ESTIMATED ANALYSIS TIME CAPSULE */}
                {uploadedImages.length > 0 && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl space-y-2 text-xs text-left animate-fade-in">
                    <div className="flex justify-between items-center text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5 text-slate-200">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Tiempo Estimado de Transcripción
                      </span>
                      <span className="text-amber-400 font-extrabold font-mono text-sm bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        ~{uploadedImages.length * 15}s
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      El motor de inteligencia artificial procesa unas <span className="text-white font-semibold">15 segundos por página</span> para decodificar texto manuscrito con resiliencia total.
                    </p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>Equivalente Captura Humana:</span>
                      <span className="font-semibold font-mono">~{uploadedImages.length * 25} minutos</span>
                    </div>
                  </div>
                )}

                {/* MAIN ANALYZE RUN TRIGGER */}
                <div className="pt-4 border-t border-slate-800/60">
                  <button
                    onClick={startAIAnalysis}
                    disabled={isAnalyzing || uploadedImages.length === 0}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Sparkles className="w-4.5 h-4.5 text-slate-950 animate-pulse" />
                    {isAnalyzing ? "Transcribiendo con IA..." : "Analizar y Transcribir por IA"}
                  </button>
                </div>
              </div>

              {/* RIGHT WORKBENCH AREA */}
              <div className="flex-1 bg-slate-950/40 p-8 overflow-y-auto flex justify-center items-start">
                
                {/* CASE A: OCR ENGINE RUNNING STEP PROGRESS */}
                {isAnalyzing && (
                  <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6" id="processing_panel">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-5">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                          <span className="absolute inset-0 bg-amber-500 rounded-2xl animate-ping opacity-25"></span>
                          <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white uppercase tracking-wider">
                            Estructurando Estudio
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-amber-400 font-bold font-mono tracking-wide">
                              Extrayendo por IA...
                            </span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-500/15">
                              Lote de {uploadedImages.length} pág.
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase font-mono font-bold">Tiempo de Análisis</span>
                        <span className="text-lg font-black font-mono text-emerald-400 animate-pulse">
                          {elapsedSeconds}s <span className="text-xs font-normal text-slate-400">/ ~{uploadedImages.length * 15}s</span>
                        </span>
                      </div>
                    </div>

                    {/* Progressive Stepper UI */}
                    <div className="space-y-3.5">
                      {activeStepList.map((step, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-4 p-3 rounded-xl border text-xs transition-all ${
                            step.status === "done"
                              ? "bg-slate-950/40 border-teal-500/10 text-slate-400"
                              : step.status === "active"
                              ? "bg-amber-500/5 border-amber-500/20 text-white font-semibold"
                              : "bg-slate-950/20 border-transparent text-slate-600"
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {step.status === "done" ? (
                              <div className="w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500 flex items-center justify-center text-teal-400 font-bold text-[10px]">
                                ✓
                              </div>
                            ) : step.status === "active" ? (
                              <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 font-bold text-[10px]">
                                <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping"></span>
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-600 text-[10px] font-mono">
                                {idx + 1}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p>{step.text}</p>
                            {step.status === "active" && (
                              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5">
                                <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full w-[50%] animate-[pulse_1.2s_infinite]"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CASE B: API FAILURE DIAGNOSTICS */}
                {apiError && !isAnalyzing && (
                  <div className="w-full max-w-xl bg-slate-900 border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-5">
                    <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-500/20">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white uppercase tracking-wider">Fallo del Analizador Sintáctico IA</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-normal">
                        Ocurrió un inconveniente al llamar al motor inteligente OCR. Verifique la clave API o la nitidez de las imágenes cargadas.
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-left font-mono text-xs text-red-400 overflow-x-auto">
                      {apiError}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => {
                          setApiError("");
                          setUploadedImages([]);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        Limpiar Lote
                      </button>
                      <button
                        onClick={startAIAnalysis}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        Reintentar Extracción
                      </button>
                    </div>
                  </div>
                )}

                {/* CASE C: EMPTY STATE PLACEHOLDER */}
                {!activeDocument && !isAnalyzing && !apiError && (
                  <div className="w-full max-w-xl bg-slate-900 border border-slate-800/80 rounded-3xl p-8 shadow-2xl text-center space-y-6" id="empty_workspace">
                    <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-slate-850 shadow-inner">
                      <FileText className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">Editor Socioeconómico Laboral</h3>
                      <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                        Carga el lote de imágenes o escaneos del candidato a la izquierda, o prueba un expediente de demostración. Obtendrás un panel completo con 13 secciones estructuradas listas para exportar a Microsoft Word (.docx).
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-left p-4 bg-slate-950/30 rounded-2xl border border-slate-850 text-xs">
                      <div className="space-y-1">
                        <h4 className="font-bold text-amber-400">⚡ OCR Semántico Multilote</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed">Analiza múltiples hojas de estudio de manera simultánea unificando la información.</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-orange-400">✍ Edición Estructurada</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed">Visualiza y modifica tablas, referencias, trayectoria e ingresos antes de guardar.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/15 text-left text-xs space-y-1.5">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        Compatibilidad Tolerante con Fotos JPEG de Celular
                      </h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Sabemos que las imágenes físicas de estudio no siempre son perfectas. El analizador de IA cuenta con un algoritmo de resiliencia entrenado para descifrar:
                      </p>
                      <ul className="list-disc list-inside text-[10px] text-slate-500 space-y-1">
                        <li>Letra manuscrita o cursiva con bolígrafo.</li>
                        <li>Perspectivas inclinadas (skew) y hojas dobladas.</li>
                        <li>Sombras de dispositivos móviles o iluminación dispareja.</li>
                        <li>Tachaduras físicas (la IA detecta la corrección final).</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* CASE D: BEAUTIFUL INTERACTIVE STUDY FORM EDITOR */}
                {activeDocument && !isAnalyzing && !apiError && (
                  <SocioeconomicFormEditor
                    activeDocument={activeDocument}
                    setActiveDocument={setActiveDocument}
                    savingFileName={savingFileName}
                    setSavingFileName={setSavingFileName}
                    saveDocumentToFolder={saveDocumentToFolder}
                    handleWordDownload={handleWordDownload}
                  />
                )}

              </div>
            </div>
          )}

          {/* TAB 2: SAVED ARCHIVES */}
          {activeTab === "files" && (
            <SavedFilesPanel
              savedFiles={savedFiles}
              deleteSavedFile={deleteSavedFile}
              loadSavedFileIntoWorkspace={loadSavedFileIntoWorkspace}
              handleWordDownload={handleWordDownload}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 3: SETTINGS PANEL */}
          {activeTab === "settings" && (
            <SettingsPanel
              currentUser={currentUser}
              exportPermissions={exportPermissions}
              savePermissionsToStorage={(p) => {
                setExportPermissions(p);
                localStorage.setItem("docuocr_permissions", JSON.stringify(p));
              }}
              addAuditLog={addAuditLog}
              triggerToast={triggerToast}
              auditLogs={auditLogs}
              setAuditLogs={setAuditLogs}
            />
          )}

        </main>
      </div>
    </div>
  );
}
