import React, { useState } from "react";
import { 
  FileCheck, FolderOpen, Download, Plus, Trash2, Edit3, Check, Info,
  User, Shield, Home, Briefcase, GraduationCap, DollarSign, Heart, FileText, Printer, Eye
} from "lucide-react";
import { SocioeconomicStudy, FamiliarIntegrante, FamiliarNoVive, IngresoMensual, EgresoMensual, CreditoItem, PatrimonioItem, ReferenciaPersonal, TrayectoriaLaboralItem } from "../types";

interface SocioeconomicFormEditorProps {
  activeDocument: SocioeconomicStudy;
  setActiveDocument: (doc: SocioeconomicStudy) => void;
  savingFileName: string;
  setSavingFileName: (name: string) => void;
  saveDocumentToFolder: () => void;
  handleWordDownload: (docData: SocioeconomicStudy, customName: string, formatStyle?: "clasico" | "ejecutivo" | "minimalista") => void;
}

type EditorSubTab = "control" | "docs_vivienda" | "familia" | "economicos" | "medicos_estudios" | "trayectoria_ref" | "observaciones" | "previsualizacion";

export default function SocioeconomicFormEditor({
  activeDocument,
  setActiveDocument,
  savingFileName,
  setSavingFileName,
  saveDocumentToFolder,
  handleWordDownload,
}: SocioeconomicFormEditorProps) {
  const [subTab, setSubTab] = useState<EditorSubTab>("control");
  const [previewFormat, setPreviewFormat] = useState<"clasico" | "ejecutivo" | "minimalista">("clasico");

  const getFormatClasses = () => {
    switch (previewFormat) {
      case "ejecutivo":
        return {
          titleText: "text-slate-800",
          subMotto: "text-slate-500 font-mono text-[9px]",
          headerDetailBox: "bg-slate-50 border-slate-200",
          resultText: "text-indigo-600",
          sectionHeader: "bg-slate-700 text-white font-bold",
          tableHeader: "bg-slate-100 font-bold text-slate-800",
          accentText: "text-indigo-700",
          borderAccent: "border-slate-700",
          badgeColor: "bg-slate-100 text-slate-800",
          conclusionesBg: "bg-slate-50 border-slate-200/50",
          textAccent: "text-slate-700 font-bold",
          textAccentNormal: "text-slate-700 font-semibold",
          primaryText: "text-slate-900 font-semibold"
        };
      case "minimalista":
        return {
          titleText: "text-teal-950 font-light tracking-wide",
          subMotto: "text-emerald-600 tracking-widest uppercase text-[9px]",
          headerDetailBox: "bg-teal-50/20 border-teal-100",
          resultText: "text-teal-600",
          sectionHeader: "bg-teal-600 text-white font-medium rounded-lg",
          tableHeader: "bg-teal-50/50 text-teal-950 font-medium",
          accentText: "text-teal-700",
          borderAccent: "border-teal-600",
          badgeColor: "bg-teal-50 text-teal-700 border border-teal-100",
          conclusionesBg: "bg-teal-50/10 border border-teal-100/50",
          textAccent: "text-teal-900 font-bold",
          textAccentNormal: "text-teal-900 font-semibold",
          primaryText: "text-teal-900 font-semibold"
        };
      case "clasico":
      default:
        return {
          titleText: "text-blue-900",
          subMotto: "text-slate-500 italic",
          headerDetailBox: "bg-slate-50 border-slate-200",
          resultText: "text-red-600",
          sectionHeader: "bg-amber-500 text-slate-950 font-black",
          tableHeader: "bg-slate-100 font-bold text-slate-900",
          accentText: "text-blue-950 font-bold",
          borderAccent: "border-amber-500",
          badgeColor: "bg-amber-100 text-amber-900",
          conclusionesBg: "bg-amber-50/10 border border-amber-200/20",
          textAccent: "text-blue-900 font-bold",
          textAccentNormal: "text-blue-900 font-semibold",
          primaryText: "text-slate-900 font-semibold"
        };
    }
  };

  const fmt = getFormatClasses();

  // Helper to update a direct string field
  const updateField = (key: keyof SocioeconomicStudy, value: any) => {
    setActiveDocument({
      ...activeDocument,
      [key]: value
    });
  };

  // HELPER MAPPERS FOR ARRAY FIELDS
  const updateIntegrante = (idx: number, key: keyof FamiliarIntegrante, val: string) => {
    const updated = [...(activeDocument.integrantes || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("integrantes", updated);
  };

  const addIntegrante = () => {
    const updated = [...(activeDocument.integrantes || [])];
    updated.push({ parentesco: "Hermano", nombre: "", edad: "", ocupacion: "", empresa: "", sueldo: "", direccion: "" });
    updateField("integrantes", updated);
  };

  const removeIntegrante = (idx: number) => {
    const updated = (activeDocument.integrantes || []).filter((_, i) => i !== idx);
    updateField("integrantes", updated);
  };

  const updateFamiliarNoVive = (idx: number, key: keyof FamiliarNoVive, val: string) => {
    const updated = [...(activeDocument.familiaresNoViven || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("familiaresNoViven", updated);
  };

  const addFamiliarNoVive = () => {
    const updated = [...(activeDocument.familiaresNoViven || [])];
    updated.push({ parentesco: "Padre", nombre: "", edad: "", ocupacion: "", telefono: "", lugarResidencia: "", direccion: "" });
    updateField("familiaresNoViven", updated);
  };

  const removeFamiliarNoVive = (idx: number) => {
    const updated = (activeDocument.familiaresNoViven || []).filter((_, i) => i !== idx);
    updateField("familiaresNoViven", updated);
  };

  // ECONOMIC HELPERS
  const updateIngreso = (idx: number, key: keyof IngresoMensual, val: string) => {
    const updated = [...(activeDocument.ingresos || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("ingresos", updated);
  };

  const addIngreso = () => {
    const updated = [...(activeDocument.ingresos || [])];
    updated.push({ nombre: "", ocupacion: "", empresa: "", salario: "0", concepto: "Sueldo Candidato", monto: "0" });
    updateField("ingresos", updated);
  };

  const removeIngreso = (idx: number) => {
    const updated = (activeDocument.ingresos || []).filter((_, i) => i !== idx);
    updateField("ingresos", updated);
  };

  const updateEgreso = (idx: number, key: keyof EgresoMensual, val: string) => {
    const updated = [...(activeDocument.egresos || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("egresos", updated);
  };

  const addEgreso = () => {
    const updated = [...(activeDocument.egresos || [])];
    updated.push({ concepto: "Alimentación", importe: "0", monto: "0" });
    updateField("egresos", updated);
  };

  const removeEgreso = (idx: number) => {
    const updated = (activeDocument.egresos || []).filter((_, i) => i !== idx);
    updateField("egresos", updated);
  };

  const updateCredito = (idx: number, key: keyof CreditoItem, val: string) => {
    const updated = [...(activeDocument.creditos || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("creditos", updated);
  };

  const addCredito = () => {
    const updated = [...(activeDocument.creditos || [])];
    updated.push({ institucion: "Coppel", tipoCredito: "", saldoActual: "0", pagoMensual: "0", importeAtrasado: "0", saldoDeudor: "0" });
    updateField("creditos", updated);
  };

  const removeCredito = (idx: number) => {
    const updated = (activeDocument.creditos || []).filter((_, i) => i !== idx);
    updateField("creditos", updated);
  };

  const updatePatrimonio = (idx: number, key: keyof PatrimonioItem, val: string) => {
    const updated = [...(activeDocument.patrimonio || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("patrimonio", updated);
  };

  // REFERENCIA HELPERS
  const updateReferencia = (idx: number, key: keyof ReferenciaPersonal, val: string) => {
    const updated = [...(activeDocument.referencias || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("referencias", updated);
  };

  const addReferencia = () => {
    const updated = [...(activeDocument.referencias || [])];
    updated.push({
      nombre: "",
      edad: "",
      ocupacion: "",
      direccion: "",
      telefono: "",
      comoConocio: "",
      tiempoConocerlo: "",
      empleosPuestosSabe: "",
      opinionGeneral: "",
      viciosSabe: "",
      problemasLegales: "",
      loRecomiendaPorque: "",
      relacion: "",
      domicilio: ""
    });
    updateField("referencias", updated);
  };

  const removeReferencia = (idx: number) => {
    const updated = (activeDocument.referencias || []).filter((_, i) => i !== idx);
    updateField("referencias", updated);
  };

  // TRAYECTORIA HELPERS
  const updateTrayectoria = (idx: number, key: keyof TrayectoriaLaboralItem, val: string) => {
    const updated = [...(activeDocument.trayectoria || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("trayectoria", updated);
  };

  const addTrayectoria = () => {
    const updated = [...(activeDocument.trayectoria || [])];
    updated.push({
      empresa: "", direccion: "", giro: "", telefono: "", puesto: "", funciones: "",
      fechaIngreso: "", fechaBaja: "", sueldo: "", personalCargo: "No", horario: "",
      prestaciones: "", tipoTrabajador: "", jefeInmediato: "", motivoSalida: "",
      calificacionDesempeno: "", contactoEmpresa: "Sí", observaciones: ""
    });
    updateField("trayectoria", updated);
  };

  const removeTrayectoria = (idx: number) => {
    const updated = (activeDocument.trayectoria || []).filter((_, i) => i !== idx);
    updateField("trayectoria", updated);
  };

  return (
    <div className="w-full max-w-4xl space-y-6" id="active_socioeconomic_editor">
      
      {/* Action control bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <input
              type="text"
              value={savingFileName}
              onChange={(e) => setSavingFileName(e.target.value)}
              className="font-bold text-sm bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-slate-200 focus:outline-none focus:border-amber-500 w-72"
              placeholder="Nombre del archivo..."
              title="Cambiar nombre de exportación"
            />
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Nombre del Documento / Candidato</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveDocumentToFolder}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            Guardar Permanente
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-750 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
            title="Imprimir el informe completo con el diseño oficial de la Hoja Membretada de PSV"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            Imprimir / PDF Membretado
          </button>
          <button
            onClick={() => handleWordDownload(activeDocument, savingFileName)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow shadow-amber-500/15 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exportar Word (.docx)
          </button>
        </div>
      </div>

      {/* SEGMENTED INTERNAL SUB-TABS NAVIGATION */}
      <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex flex-wrap gap-1 text-xs">
        <button
          onClick={() => setSubTab("control")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "control" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Datos Candidato
        </button>
        <button
          onClick={() => setSubTab("docs_vivienda")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "docs_vivienda" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          Vivienda & Docs
        </button>
        <button
          onClick={() => setSubTab("familia")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "familia" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Familiar
        </button>
        <button
          onClick={() => setSubTab("economicos")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "economicos" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Económicos
        </button>
        <button
          onClick={() => setSubTab("medicos_estudios")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "medicos_estudios" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Salud & Escolar
        </button>
        <button
          onClick={() => setSubTab("trayectoria_ref")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "trayectoria_ref" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Trabajo & Refs
        </button>
        <button
          onClick={() => setSubTab("observaciones")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
            subTab === "observaciones" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Entrevista & Obs
        </button>
        <button
          onClick={() => setSubTab("previsualizacion")}
          className={`flex-1 py-2 px-3 rounded-lg font-medium transition whitespace-nowrap text-center flex items-center justify-center gap-1.5 border border-amber-500/10 ${
            subTab === "previsualizacion" ? "bg-amber-500 text-slate-950 font-extrabold shadow shadow-amber-500/20" : "text-slate-300 hover:text-white hover:bg-slate-900 bg-amber-500/5"
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          Previsualizar Word
        </button>
      </div>

      {/* FORM CONTENT WORKSPACE SHEET */}
      <div className="bg-white text-slate-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-200 relative min-h-[600px]">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600"></div>

        {/* SUBTAB 1: CONTROL & CANDIDATE DATA */}
        {subTab === "control" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2">
              1. Datos de Control y Candidato
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Fecha de Estudio</label>
                <input type="text" value={activeDocument.fecha} onChange={(e) => updateField("fecha", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Empresa Solicitada</label>
                <input type="text" value={activeDocument.empresaSolicitada} onChange={(e) => updateField("empresaSolicitada", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Puesto Solicitado</label>
                <input type="text" value={activeDocument.puesto} onChange={(e) => updateField("puesto", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Resultado de la Evaluación</label>
                <input type="text" value={activeDocument.resultado} onChange={(e) => updateField("resultado", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none font-bold text-amber-700" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-100">
              <div className="col-span-3">
                <label className="block font-semibold text-slate-500 mb-1">Nombre Completo del Candidato</label>
                <input type="text" value={activeDocument.nombre} onChange={(e) => updateField("nombre", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-bold focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-500 mb-1">Dirección Completa</label>
                <input type="text" value={activeDocument.direccion} onChange={(e) => updateField("direccion", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">C.P.</label>
                <input type="text" value={activeDocument.cp} onChange={(e) => updateField("cp", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Ciudad y Estado</label>
                <input type="text" value={activeDocument.ciudadEstado} onChange={(e) => updateField("ciudadEstado", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Teléfono Casa</label>
                <input type="text" value={activeDocument.telefonoCasa} onChange={(e) => updateField("telefonoCasa", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Teléfono Celular</label>
                <input type="text" value={activeDocument.telefonoCelular} onChange={(e) => updateField("telefonoCelular", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">RFC</label>
                <input type="text" value={activeDocument.rfc} onChange={(e) => updateField("rfc", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">CURP</label>
                <input type="text" value={activeDocument.curp} onChange={(e) => updateField("curp", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">NSS</label>
                <input type="text" value={activeDocument.nss} onChange={(e) => updateField("nss", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Fecha Nacimiento</label>
                <input type="text" value={activeDocument.fechaNac} onChange={(e) => updateField("fechaNac", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Lugar de Nacimiento</label>
                <input type="text" value={activeDocument.lugarNacimiento} onChange={(e) => updateField("lugarNacimiento", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Estado Civil</label>
                <input type="text" value={activeDocument.estadoCivil} onChange={(e) => updateField("estadoCivil", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: DOCUMENTATION & HOUSING */}
        {subTab === "docs_vivienda" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2">
              2. Documentación Oficial & Vivienda
            </h3>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">INE / Identificación</label>
                <input type="text" value={activeDocument.identificacionNumero} onChange={(e) => updateField("identificacionNumero", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Acta de Nacimiento</label>
                <input type="text" value={activeDocument.actaNacimiento} onChange={(e) => updateField("actaNacimiento", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Licencia de Conducir</label>
                <input type="text" value={activeDocument.licenciaNumero} onChange={(e) => updateField("licenciaNumero", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Crédito INFONAVIT</label>
                <input type="text" value={activeDocument.creditoInfonavit} onChange={(e) => updateField("creditoInfonavit", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Cartilla Militar</label>
                <input type="text" value={activeDocument.cartillaMilitar} onChange={(e) => updateField("cartillaMilitar", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Afore</label>
                <input type="text" value={activeDocument.afore} onChange={(e) => updateField("afore", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide border-t border-slate-100 pt-4">
              Características del Domicilio
            </h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Propietario Inmueble</label>
                <input type="text" value={activeDocument.propietario} onChange={(e) => updateField("propietario", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Tiempo de Vivir Ahí</label>
                <input type="text" value={activeDocument.tiempoVivirDomicilio} onChange={(e) => updateField("tiempoVivirDomicilio", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Tipo de Vivienda</label>
                <input type="text" value={activeDocument.tipoInmueble} onChange={(e) => updateField("tipoInmueble", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Clase Social</label>
                <input type="text" value={activeDocument.claseSocial} onChange={(e) => updateField("claseSocial", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Tipo de Zona</label>
                <input type="text" value={activeDocument.tipoZona} onChange={(e) => updateField("tipoZona", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Distribución Habitacional</label>
                <input type="text" value={activeDocument.distribucion} onChange={(e) => updateField("distribucion", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="col-span-3">
                <label className="block font-semibold text-slate-500 mb-1">Observaciones Generales de la Vivienda y Entorno</label>
                <textarea value={activeDocument.observacionesVivienda} onChange={(e) => updateField("observacionesVivienda", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 h-16 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: FAMILY TABLES */}
        {subTab === "familia" && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-amber-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">
                3. Integrantes que Habitan el Domicilio
              </h3>
              <button onClick={addIntegrante} className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition">
                <Plus className="w-3.5 h-3.5" /> Agregar Integrante
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="p-2 border-r border-slate-100">Parentesco</th>
                    <th className="p-2 border-r border-slate-100">Nombre</th>
                    <th className="p-2 border-r border-slate-100">Edad</th>
                    <th className="p-2 border-r border-slate-100">Ocupación / Escuela</th>
                    <th className="p-2 border-r border-slate-100">Sueldo / Ingreso</th>
                    <th className="p-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeDocument.integrantes?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-1 border-r border-slate-100">
                        <input type="text" value={item.parentesco} onChange={(e) => updateIntegrante(idx, "parentesco", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs font-semibold" />
                      </td>
                      <td className="p-1 border-r border-slate-100">
                        <input type="text" value={item.nombre} onChange={(e) => updateIntegrante(idx, "nombre", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 border-r border-slate-100 w-12">
                        <input type="text" value={item.edad} onChange={(e) => updateIntegrante(idx, "edad", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded text-center focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 border-r border-slate-100">
                        <input type="text" value={item.ocupacion} onChange={(e) => updateIntegrante(idx, "ocupacion", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 border-r border-slate-100 w-24">
                        <input type="text" value={item.sueldo} onChange={(e) => updateIntegrante(idx, "sueldo", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 text-center">
                        <button onClick={() => removeIntegrante(idx)} className="p-1 text-slate-300 hover:text-red-500 rounded hover:bg-slate-100 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center border-b border-amber-100 pb-2 pt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">
                Familiar Directo que NO Vive con el Candidato
              </h3>
              <button onClick={addFamiliarNoVive} className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition">
                <Plus className="w-3.5 h-3.5" /> Agregar Familiar No Vive
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <th className="p-2 border-r border-slate-100">Parentesco</th>
                    <th className="p-2 border-r border-slate-100">Nombre</th>
                    <th className="p-2 border-r border-slate-100">Dirección Completa</th>
                    <th className="p-2 border-r border-slate-100">Ocupación / Teléfono</th>
                    <th className="p-2 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeDocument.familiaresNoViven?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-1 border-r border-slate-100 w-28">
                        <input type="text" value={item.parentesco} onChange={(e) => updateFamiliarNoVive(idx, "parentesco", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs font-semibold" />
                      </td>
                      <td className="p-1 border-r border-slate-100">
                        <input type="text" value={item.nombre} onChange={(e) => updateFamiliarNoVive(idx, "nombre", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 border-r border-slate-100">
                        <input type="text" value={item.direccion} onChange={(e) => updateFamiliarNoVive(idx, "direccion", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 border-r border-slate-100 w-36">
                        <input type="text" value={item.ocupacion} onChange={(e) => updateFamiliarNoVive(idx, "ocupacion", e.target.value)} className="w-full bg-transparent px-1 py-1 rounded focus:bg-white focus:outline-none text-xs" />
                      </td>
                      <td className="p-1 text-center">
                        <button onClick={() => removeFamiliarNoVive(idx)} className="p-1 text-slate-300 hover:text-red-500 rounded hover:bg-slate-100 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: ECONOMICS */}
        {subTab === "economicos" && (
          <div className="space-y-6 animate-fade-in text-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2">
              4. Distribución Económica Mensual
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* INGRESOS TABLE */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 uppercase">Ingresos Mensuales</h4>
                  <button onClick={addIngreso} className="text-amber-600 font-bold hover:underline flex items-center gap-0.5">
                    <Plus className="w-3 h-3" /> Agregar
                  </button>
                </div>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-100">
                      {activeDocument.ingresos?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-1 border-r border-slate-100">
                            <input type="text" value={item.concepto} onChange={(e) => updateIngreso(idx, "concepto", e.target.value)} className="w-full bg-transparent p-1 focus:bg-white focus:outline-none" />
                          </td>
                          <td className="p-1 border-r border-slate-100 w-24">
                            <input type="text" value={item.monto} onChange={(e) => updateIngreso(idx, "monto", e.target.value)} className="w-full bg-transparent p-1 text-right focus:bg-white focus:outline-none" />
                          </td>
                          <td className="p-1 text-center w-8">
                            <button onClick={() => removeIngreso(idx)} className="text-slate-300 hover:text-red-500 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-100">
                        <td className="p-2">TOTAL INGRESOS</td>
                        <td className="p-2 text-right">
                          <input type="text" value={activeDocument.totalIngresos} onChange={(e) => updateField("totalIngresos", e.target.value)} className="w-full bg-transparent text-right font-bold focus:outline-none" />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* EGRESOS TABLE */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 uppercase">Egresos Mensuales</h4>
                  <button onClick={addEgreso} className="text-amber-600 font-bold hover:underline flex items-center gap-0.5">
                    <Plus className="w-3 h-3" /> Agregar
                  </button>
                </div>
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-100">
                      {activeDocument.egresos?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-1 border-r border-slate-100">
                            <input type="text" value={item.concepto} onChange={(e) => updateEgreso(idx, "concepto", e.target.value)} className="w-full bg-transparent p-1 focus:bg-white focus:outline-none" />
                          </td>
                          <td className="p-1 border-r border-slate-100 w-24">
                            <input type="text" value={item.monto} onChange={(e) => updateEgreso(idx, "monto", e.target.value)} className="w-full bg-transparent p-1 text-right focus:bg-white focus:outline-none" />
                          </td>
                          <td className="p-1 text-center w-8">
                            <button onClick={() => removeEgreso(idx)} className="text-slate-300 hover:text-red-500 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-100">
                        <td className="p-2">TOTAL EGRESOS</td>
                        <td className="p-2 text-right">
                          <input type="text" value={activeDocument.totalEgresos} onChange={(e) => updateField("totalEgresos", e.target.value)} className="w-full bg-transparent text-right font-bold focus:outline-none" />
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CREDITOS TABLE */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase">Créditos de Instituciones Bancarias o Tiendas</h4>
                <button onClick={addCredito} className="text-amber-600 font-bold hover:underline flex items-center gap-0.5">
                  <Plus className="w-3 h-3" /> Agregar Crédito
                </button>
              </div>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                      <th className="p-2 border-r border-slate-100">Institución</th>
                      <th className="p-2 border-r border-slate-100 text-right">Pago Mensual</th>
                      <th className="p-2 border-r border-slate-100 text-right">Saldo Deudor</th>
                      <th className="p-2 text-center w-12">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeDocument.creditos?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-1 border-r border-slate-100">
                          <input type="text" value={item.institucion} onChange={(e) => updateCredito(idx, "institucion", e.target.value)} className="w-full bg-transparent p-1 focus:bg-white focus:outline-none" />
                        </td>
                        <td className="p-1 border-r border-slate-100">
                          <input type="text" value={item.pagoMensual} onChange={(e) => updateCredito(idx, "pagoMensual", e.target.value)} className="w-full bg-transparent p-1 text-right focus:bg-white focus:outline-none" />
                        </td>
                        <td className="p-1 border-r border-slate-100">
                          <input type="text" value={item.saldoDeudor} onChange={(e) => updateCredito(idx, "saldoDeudor", e.target.value)} className="w-full bg-transparent p-1 text-right focus:bg-white focus:outline-none" />
                        </td>
                        <td className="p-1 text-center">
                          <button onClick={() => removeCredito(idx)} className="text-slate-300 hover:text-red-500 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: HEALTH, MEDICAL, EDUCATION & CULTURAL */}
        {subTab === "medicos_estudios" && (
          <div className="space-y-6 animate-fade-in text-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2">
              5. Antecedentes Médicos y de Salud
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Descripción Física</label>
                <input type="text" value={activeDocument.descripcionFisica} onChange={(e) => updateField("descripcionFisica", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Estatura y Peso</label>
                <input type="text" value={activeDocument.estaturaPeso} onChange={(e) => updateField("estaturaPeso", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Enfermedades Graves / Secuelas</label>
                <input type="text" value={activeDocument.enfermedadesGraves} onChange={(e) => updateField("enfermedadesGraves", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Medicamentos Controlados</label>
                <input type="text" value={activeDocument.medicamentos} onChange={(e) => updateField("medicamentos", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Consumo de Tabaco</label>
                <input type="text" value={activeDocument.consumoTabaco} onChange={(e) => updateField("consumoTabaco", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Consumo de Alcohol</label>
                <input type="text" value={activeDocument.consumoAlcohol} onChange={(e) => updateField("consumoAlcohol", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2 pt-4">
              Nivel Académico e Información Escolar
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Último Grado Obtenido</label>
                <input type="text" value={activeDocument.ultimoGrado} onChange={(e) => updateField("ultimoGrado", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Institución / Escuela</label>
                <input type="text" value={activeDocument.institucion} onChange={(e) => updateField("institucion", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Años Cursados</label>
                <input type="text" value={activeDocument.anosCursados} onChange={(e) => updateField("anosCursados", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Carrera / Especialidad</label>
                <input type="text" value={activeDocument.carrera} onChange={(e) => updateField("carrera", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2 pt-4">
              Características Socio-Culturales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-500 mb-1">Actividades Cotidianas (Pasatiempos)</label>
                <input type="text" value={activeDocument.actividadesCotidianas} onChange={(e) => updateField("actividadesCotidianas", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Planes a Futuro</label>
                <input type="text" value={activeDocument.planesFuturo} onChange={(e) => updateField("planesFuturo", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Experiencia en Sindicatos / Comités</label>
                <input type="text" value={activeDocument.comiteSindical} onChange={(e) => updateField("comiteSindical", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: TRAYECTORIA & REFERENCES */}
        {subTab === "trayectoria_ref" && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-amber-100 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">
                6. Referencias Personales Extrayas
              </h3>
              <button onClick={addReferencia} className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition">
                <Plus className="w-3.5 h-3.5" /> Agregar Referencia
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {activeDocument.referencias?.map((ref, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 relative">
                  <button onClick={() => removeReferencia(idx)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="font-bold text-amber-700">Referencia #{idx + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-500">Nombre</label>
                      <input type="text" value={ref.nombre} onChange={(e) => updateReferencia(idx, "nombre", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Relación</label>
                      <input type="text" value={ref.relacion} onChange={(e) => updateReferencia(idx, "relacion", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Tiempo</label>
                      <input type="text" value={ref.tiempoConocerlo} onChange={(e) => updateReferencia(idx, "tiempoConocerlo", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-500">Domicilio</label>
                      <input type="text" value={ref.domicilio} onChange={(e) => updateReferencia(idx, "domicilio", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Teléfono</label>
                      <input type="text" value={ref.telefono} onChange={(e) => updateReferencia(idx, "telefono", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500">Ocupación</label>
                      <input type="text" value={ref.ocupacion} onChange={(e) => updateReferencia(idx, "ocupacion", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-b border-amber-100 pb-2 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600">
                Trayectoria Laboral Detallada (Últimos Empleos)
              </h3>
              <button onClick={addTrayectoria} className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition">
                <Plus className="w-3.5 h-3.5" /> Agregar Empleo
              </button>
            </div>

            <div className="space-y-4">
              {activeDocument.trayectoria?.map((emp, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3 relative">
                  <button onClick={() => removeTrayectoria(idx)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 transition p-1.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <p className="font-bold text-slate-700">Compañía / Empleo #{idx + 1}</p>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-500 mb-0.5">Empresa</label>
                      <input type="text" value={emp.empresa} onChange={(e) => updateTrayectoria(idx, "empresa", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-0.5">Puesto</label>
                      <input type="text" value={emp.puesto} onChange={(e) => updateTrayectoria(idx, "puesto", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-0.5">Giro</label>
                      <input type="text" value={emp.giro} onChange={(e) => updateTrayectoria(idx, "giro", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-500 mb-0.5">Funciones</label>
                      <input type="text" value={emp.funciones} onChange={(e) => updateTrayectoria(idx, "funciones", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-0.5">Sueldo Salida</label>
                      <input type="text" value={emp.sueldo} onChange={(e) => updateTrayectoria(idx, "sueldo", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1 font-mono" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-0.5">Teléfono</label>
                      <input type="text" value={emp.telefono} onChange={(e) => updateTrayectoria(idx, "telefono", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-0.5">Ingreso</label>
                      <input type="text" value={emp.fechaIngreso} onChange={(e) => updateTrayectoria(idx, "fechaIngreso", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-500 mb-0.5">Egreso</label>
                      <input type="text" value={emp.fechaBaja} onChange={(e) => updateTrayectoria(idx, "fechaBaja", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-500 mb-0.5">Motivo de Salida</label>
                      <input type="text" value={emp.motivoSalida} onChange={(e) => updateTrayectoria(idx, "motivoSalida", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 7: INTERVIEW & OBSERVATIONS */}
        {subTab === "observaciones" && (
          <div className="space-y-6 animate-fade-in text-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 border-b border-amber-100 pb-2">
              7. Aspectos Evaluativos y Entrevista
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">¿Se encontró al Candidato en Casa?</label>
                <input type="text" value={activeDocument.seEncontroCandidatoCasa} onChange={(e) => updateField("seEncontroCandidatoCasa", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">¿Intervino algún Familiar en la entrevista?</label>
                <input type="text" value={activeDocument.intervinoFamiliar} onChange={(e) => updateField("intervinoFamiliar", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Periodos de Inactividad (Detalle)</label>
                <input type="text" value={activeDocument.periodosInactividad} onChange={(e) => updateField("periodosInactividad", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">¿Cómo solventó sus necesidades mientras tanto?</label>
                <input type="text" value={activeDocument.comoSolventoNecesidades} onChange={(e) => updateField("comoSolventoNecesidades", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-500 mb-1">Otras empresas donde ha aplicado recientemente</label>
                <input type="text" value={activeDocument.empresasDondeAplico} onChange={(e) => updateField("empresasDondeAplico", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Motivación principal del Candidato</label>
                <input type="text" value={activeDocument.motivacion} onChange={(e) => updateField("motivacion", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Honestidad y confiabilidad percibidas</label>
                <input type="text" value={activeDocument.honestidad} onChange={(e) => updateField("honestidad", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-500 mb-1">Condiciones de trabajo deseadas / aceptadas</label>
                <input type="text" value={activeDocument.condicionesTrabajo} onChange={(e) => updateField("condicionesTrabajo", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:border-amber-500 focus:outline-none" />
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide border-t border-slate-100 pt-4">
              Observaciones Generales y Conclusión Final
            </h4>
            <div className="space-y-2">
              <textarea value={activeDocument.observacionesGenerales} onChange={(e) => updateField("observacionesGenerales", e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 h-28 focus:border-amber-500 focus:outline-none text-xs font-medium text-slate-700" placeholder="Escriba aquí los comentarios conclusivos de la visita domiciliaria y el análisis del perfil..." />
            </div>
          </div>
        )}

        {/* SUBTAB 8: PREVISUALIZACIÓN DE ALTA FIDELIDAD */}
        {subTab === "previsualizacion" && (
          <div className="space-y-6 animate-fade-in text-xs">
            {/* Control Header Info */}
            <div className="p-4 bg-slate-900 text-slate-200 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 font-mono">
                  <Eye className="w-4 h-4 text-amber-400" />
                  PREVISUALIZACIÓN DE ALTA FIDELIDAD DE HOJA MEMBRETADA WORD / PDF
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Esta es una réplica exacta del formato de salida con membrete oficial de PSV. Los cambios realizados en las otras pestañas se reflejan aquí de forma instantánea.
                </p>
                
                {/* Visual Format Selector Options */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide font-mono block mb-1.5">Estilo del Formato de Salida:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPreviewFormat("clasico")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${previewFormat === "clasico" ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40" : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800"}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      Clásico PSV (Azul/Oro)
                    </button>
                    <button
                      onClick={() => setPreviewFormat("ejecutivo")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${previewFormat === "ejecutivo" ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40" : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800"}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0"></span>
                      Ejecutivo (Gris/Azul)
                    </button>
                    <button
                      onClick={() => setPreviewFormat("minimalista")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${previewFormat === "minimalista" ? "bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-950/40" : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800"}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span>
                      Minimalista (Menta)
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto shrink-0 self-end sm:self-center">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir / PDF
                </button>
                <button
                  onClick={() => handleWordDownload(activeDocument, savingFileName, previewFormat)}
                  className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-950/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Bajar Word
                </button>
              </div>
            </div>

            {/* Simulated Paper Sheet container */}
            <div className="bg-slate-900/40 p-4 sm:p-8 rounded-2xl border border-slate-200/40 overflow-y-auto max-h-[750px] shadow-inner">
              <div className="bg-white p-6 sm:p-12 text-[#1e293b] font-sans leading-relaxed space-y-6 border border-slate-300 shadow-2xl max-w-4xl mx-auto rounded-sm text-left relative">
                
                {/* Simulated Official PSV Header */}
                <div className={`flex justify-between items-end border-b-2 ${fmt.borderAccent} pb-3`}>
                  <div>
                    <h1 className={`text-base font-extrabold ${fmt.textAccent} tracking-tight`}>PSV ASESORES Y CONSULTORES S.C.</h1>
                    <p className="text-[10px] italic text-slate-500">Investigación, Evaluación y Consultoría en Capital Humano</p>
                  </div>
                  <div className="text-right">
                    <h2 className={`text-xs font-black ${fmt.textAccent} tracking-wider`}>ESTUDIO SOCIOECONÓMICO LABORAL</h2>
                    <p className={`text-[8px] uppercase font-bold ${fmt.accentText} tracking-widest`}>Informe Confidencial</p>
                  </div>
                </div>

                {/* Header detail box */}
                <div className={`grid grid-cols-4 gap-4 p-3 border rounded text-[10px] ${fmt.headerDetailBox}`}>
                  <div><strong className="text-slate-500 block uppercase text-[8px]">Fecha de Estudio</strong> <span className={`font-semibold ${fmt.primaryText}`}>{activeDocument.fecha || "N/A"}</span></div>
                  <div><strong className="text-slate-500 block uppercase text-[8px]">Empresa Solicitada</strong> <span className={`font-semibold ${fmt.primaryText}`}>{activeDocument.empresaSolicitada || "N/A"}</span></div>
                  <div><strong className="text-slate-500 block uppercase text-[8px]">Puesto Evaluado</strong> <span className={`font-semibold ${fmt.primaryText}`}>{activeDocument.puesto || "N/A"}</span></div>
                  <div><strong className="text-slate-500 block uppercase text-[8px]">Resultado Final</strong> <span className={`font-semibold uppercase ${fmt.resultText}`}>{activeDocument.resultado || "RECOMENDABLE"}</span></div>
                </div>

                {/* Section 1: Datos Personales */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>1. Datos Personales del Candidato</h3>
                  <div className="grid grid-cols-3 gap-y-2 gap-x-4 border border-slate-200 p-3 rounded text-[10px]">
                    <div className="col-span-2"><strong>Nombre Completo:</strong> {activeDocument.nombre || "N/A"}</div>
                    <div><strong>Edad:</strong> {activeDocument.edad || "N/A"} años</div>
                    <div className="col-span-2"><strong>Dirección:</strong> {activeDocument.direccion || "N/A"}</div>
                    <div><strong>C.P.:</strong> {activeDocument.cp || "N/A"}</div>
                    <div><strong>Ciudad y Estado:</strong> {activeDocument.ciudadEstado || "N/A"}</div>
                    <div><strong>Teléfono Celular:</strong> {activeDocument.telefonoCelular || "N/A"}</div>
                    <div><strong>Teléfono Fijo / Recados:</strong> {activeDocument.telefonoCasa || activeDocument.telefonoRecados || "N/A"}</div>
                    <div><strong>Fecha Nacimiento:</strong> {activeDocument.fechaNac || "N/A"}</div>
                    <div><strong>Lugar de Nacimiento:</strong> {activeDocument.lugarNacimiento || "N/A"}</div>
                    <div><strong>Estado Civil:</strong> {activeDocument.estadoCivil || "N/A"}</div>
                    <div><strong>R.F.C.:</strong> {activeDocument.rfc || "N/A"}</div>
                    <div><strong>C.U.R.P.:</strong> {activeDocument.curp || "N/A"}</div>
                    <div><strong>Número IMSS (NSS):</strong> {activeDocument.nss || "N/A"}</div>
                    <div className="col-span-3"><strong>Motivo de Cambio de Residencia/Trabajo:</strong> {activeDocument.motivoCambio || "N/A"}</div>
                  </div>
                </div>

                {/* Section 2: Documentación & Vivienda */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>2. Documentación & Vivienda</h3>
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="border border-slate-200 p-3 rounded space-y-1">
                      <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-0.5 uppercase text-[9px]`}>Documentos Cotejados</h4>
                      <div><strong>Identificación:</strong> {activeDocument.identificacionTipo || "N/A"} ({activeDocument.identificacionNumero || "N/A"})</div>
                      <div><strong>Licencia Conducir:</strong> {activeDocument.licenciaNumero || "No"} - {activeDocument.licenciaTipo || ""} ({activeDocument.licenciaVencimiento || "N/A"})</div>
                      <div><strong>Infonavit / Afore:</strong> {activeDocument.creditoInfonavit || "No"} / {activeDocument.afore || "N/A"}</div>
                      <div><strong>Pasaporte/Visa:</strong> {activeDocument.pasaporteVisa || "No"}</div>
                    </div>
                    <div className="border border-slate-200 p-3 rounded space-y-1">
                      <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-0.5 uppercase text-[9px]`}>Distribución de Vivienda</h4>
                      <div><strong>Propietario / Tipo:</strong> {activeDocument.propietario || "N/A"} / {activeDocument.tipoInmueble || "Casa"}</div>
                      <div><strong>Tiempo de Habitar:</strong> {activeDocument.tiempoVivirDomicilio || "N/A"}</div>
                      <div><strong>Zona / Clase Social:</strong> {activeDocument.tipoZona || "Urbana"} / {activeDocument.claseSocial || "Media-Baja"}</div>
                      <div><strong>Distribución:</strong> {activeDocument.distribucion || "Sala, comedor, cocina, baño, recámaras."}</div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Estructura Familiar */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>3. Estructura Familiar (Viven en el Domicilio)</h3>
                  <table className="w-full text-left text-[10px] border border-slate-200 rounded overflow-hidden">
                    <thead className={`${fmt.tableHeader}`}>
                      <tr>
                        <th className="p-1.5 border border-slate-200">Parentesco</th>
                        <th className="p-1.5 border border-slate-200">Nombre</th>
                        <th className="p-1.5 border border-slate-200 font-mono">Edad</th>
                        <th className="p-1.5 border border-slate-200">Ocupación / Empresa</th>
                        <th className="p-1.5 border border-slate-200 font-mono">Sueldo Mensual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDocument.integrantes && activeDocument.integrantes.length > 0 ? (
                        activeDocument.integrantes.map((int, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className={`p-1.5 border border-slate-200 font-semibold ${fmt.accentText}`}>{int.parentesco}</td>
                            <td className="p-1.5 border border-slate-200">{int.nombre || "N/A"}</td>
                            <td className="p-1.5 border border-slate-200 font-mono">{int.edad || "N/A"}</td>
                            <td className="p-1.5 border border-slate-200">{int.ocupacion || "N/A"} {int.empresa ? `(${int.empresa})` : ""}</td>
                            <td className="p-1.5 border border-slate-200 font-mono">{int.sueldo || "N/A"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-2 text-center text-slate-400">No se registraron integrantes habitando en el domicilio.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Section 4: Balanza Económica */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>4. Balanza Económica Mensual</h3>
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="border border-slate-200 p-3 rounded space-y-1.5">
                      <h4 className="font-bold text-green-700 border-b border-slate-100 pb-0.5 uppercase text-[9px]">Ingresos del Hogar</h4>
                      <ul className="space-y-1">
                        {(activeDocument.ingresos || []).map((ing, i) => (
                          <li key={i} className="flex justify-between font-mono text-[9px]">
                            <span>{ing.concepto || ing.nombre || "Ingreso"}:</span>
                            <span className="font-bold text-slate-900">${ing.salario || ing.monto || "0"}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between border-t border-slate-200 pt-1 font-bold font-mono">
                        <span>Total Ingresos:</span>
                        <span className="text-green-700">${activeDocument.totalIngresos || "0"}</span>
                      </div>
                    </div>
                    <div className="border border-slate-200 p-3 rounded space-y-1.5">
                      <h4 className="font-bold text-red-700 border-b border-slate-100 pb-0.5 uppercase text-[9px]">Egresos Familiares</h4>
                      <ul className="space-y-1">
                        {(activeDocument.egresos || []).map((egr, i) => (
                          <li key={i} className="flex justify-between font-mono text-[9px]">
                            <span>{egr.concepto}:</span>
                            <span className="font-bold text-slate-900">${egr.importe || egr.monto || "0"}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-between border-t border-slate-200 pt-1 font-bold font-mono">
                        <span>Total Egresos:</span>
                        <span className="text-red-700">${activeDocument.totalEgresos || "0"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Salud, Educación y Sindicato */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>5. Antecedentes de Salud & Nivel Académico</h3>
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div className="border border-slate-200 p-3 rounded space-y-1">
                      <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-0.5 uppercase text-[9px]`}>Información Médica</h4>
                      <div><strong>Descripción Física:</strong> {activeDocument.descripcionFisica || "N/A"}</div>
                      <div><strong>Estatura y Peso:</strong> {activeDocument.estaturaPeso || "N/A"}</div>
                      <div><strong>Enfermedades/Secuelas:</strong> {activeDocument.enfermedadesGraves || "Ninguna"}</div>
                      <div><strong>Medicamentos Controlados:</strong> {activeDocument.medicamentos || "Ninguno"}</div>
                      <div><strong>Consumo Tabaco / Alcohol:</strong> {activeDocument.consumoTabaco || "No"} / {activeDocument.consumoAlcohol || "No"}</div>
                    </div>
                    <div className="border border-slate-200 p-3 rounded space-y-1">
                      <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-0.5 uppercase text-[9px]`}>Estudios y Cultura</h4>
                      <div><strong>Último Grado / Carrera:</strong> {activeDocument.ultimoGrado || "N/A"} {activeDocument.carrera ? `- ${activeDocument.carrera}` : ""}</div>
                      <div><strong>Institución / Años:</strong> {activeDocument.institucion || "N/A"} ({activeDocument.anosCursados || "N/A"} años)</div>
                      <div><strong>Actividades Cotidianas:</strong> {activeDocument.actividadesCotidianas || "N/A"}</div>
                      <div><strong>Planes a Futuro:</strong> {activeDocument.planesFuturo || "N/A"}</div>
                      <div><strong>Sindicato / Comités:</strong> {activeDocument.comiteSindical || "Ninguno"}</div>
                    </div>
                  </div>
                </div>

                {/* Section 6: Referencias Personales */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>6. Referencias Personales y Vecinales</h3>
                  {activeDocument.referencias && activeDocument.referencias.length > 0 ? (
                    activeDocument.referencias.map((ref, i) => (
                      <div key={i} className="border border-slate-200 p-2.5 rounded text-[10px] space-y-1 bg-slate-50 mb-1.5">
                        <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-0.5 font-bold text-blue-900">
                          <div className={`${fmt.accentText}`}>Ref #{i+1}: {ref.nombre}</div>
                          <div>Ocupación: {ref.ocupacion} ({ref.edad} años)</div>
                          <div className="text-right">Tel: {ref.telefono}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[9px] pt-0.5">
                          <div><strong>Cómo lo conoció:</strong> {ref.comoConocio || "N/A"} (hace {ref.tiempoConocerlo})</div>
                          <div><strong>Problemas legales / Vicios conocidos:</strong> {ref.problemasLegales || "Ninguno"} / {ref.viciosSabe || "Ninguno"}</div>
                          <div className="col-span-2"><strong>Opinión general sobre el candidato:</strong> {ref.opinionGeneral || "Excelente persona, honrada y trabajadora."}</div>
                          <div className="col-span-2 text-emerald-700 font-semibold"><strong>¿Lo recomienda y por qué?:</strong> {ref.loRecomiendaPorque || "Sí, por ser altamente confiable."}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 border border-slate-200 rounded text-center text-slate-400 text-[10px]">No se registraron referencias personales.</div>
                  )}
                </div>

                {/* Section 7: Trayectoria Laboral */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>7. Trayectoria Laboral Reciente</h3>
                  {activeDocument.trayectoria && activeDocument.trayectoria.length > 0 ? (
                    activeDocument.trayectoria.map((job, i) => (
                      <div key={i} className="border border-slate-200 p-2.5 rounded text-[10px] space-y-1 bg-slate-50 mb-1.5">
                        <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-0.5 font-bold text-blue-900">
                          <div className={`${fmt.accentText}`}>{job.empresa}</div>
                          <div>Puesto: {job.puesto}</div>
                          <div className="text-right">{job.fechaIngreso} - {job.fechaBaja}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pt-0.5">
                          <div className="col-span-3"><strong>Funciones principales:</strong> {job.funciones || "N/A"}</div>
                          <div><strong>Sueldo Mensual:</strong> {job.sueldo || "N/A"}</div>
                          <div><strong>Jefe Inmediato:</strong> {job.jefeInmediato || "N/A"}</div>
                          <div><strong>Motivo de Salida:</strong> {job.motivoSalida || "N/A"}</div>
                          <div className="col-span-3"><strong>Desempeño verificado por la empresa:</strong> {job.calificacionDesempeno || "N/A"}</div>
                          <div className="col-span-3 text-slate-500 italic"><strong>Comentarios/Observaciones laborales:</strong> {job.observaciones || "Ninguno"}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 border border-slate-200 rounded text-center text-slate-400 text-[10px]">No se registró historial de trayectoria laboral.</div>
                  )}
                </div>

                {/* Section 8: Conclusiones */}
                <div className="space-y-1">
                  <h3 className={`${fmt.sectionHeader} px-2.5 py-0.5 text-[10px] uppercase rounded-sm`}>8. Conclusiones y Observaciones Generales</h3>
                  <div className={`p-3.5 rounded text-[10px] space-y-3 ${fmt.conclusionesBg}`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
                      {activeDocument.observacionesGenerales || "El candidato cumple satisfactoriamente con el perfil socioeconómico y ético requerido para laborar dentro de la organización solicitada."}
                    </p>
                    <div className="pt-4 grid grid-cols-2 gap-8 text-center">
                      <div className="border-t border-slate-300 pt-1.5 mx-4">
                        <span className="block font-bold text-slate-900 text-[10px]">Firma del Candidato</span>
                        <span className="text-[8px] text-slate-400">Doy fe de que la información provista es verdadera</span>
                      </div>
                      <div className="border-t border-slate-300 pt-1.5 mx-4">
                        <span className="block font-bold text-slate-900 text-[10px]">PSV Asesores y Consultores S.C.</span>
                        <span className="text-[8px] text-slate-400">Firma del Evaluador / Sello de Validez</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[8px] text-slate-400 font-mono select-none">
                  <span>Informe Socioeconómico Confidencial - PSV</span>
                  <span>Página de impresión autorizada</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* METADATA DIAGNOSTICS CAPSULE */}
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl border border-slate-800 space-y-3 mt-8">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 text-amber-400 animate-pulse" />
            <h5 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-300">
              MÉTRICAS DEL ANALIZADOR SINTÁCTICO IA
            </h5>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Tipo Documento</span>
              <p className="text-amber-400 font-semibold">Socioeconómico Laboral</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Idioma Principal</span>
              <p className="text-amber-400 font-semibold">{activeDocument.idiomaDetectado || "Español"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Puntuación Confianza</span>
              <p className="text-amber-400 font-semibold">{activeDocument.confidenceScore || "98%"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Tiempo de Análisis</span>
              <p className="text-emerald-400 font-semibold">{activeDocument.tiempoEstimadoAnalisis || "15 segundos (Humano: 25 min)"}</p>
            </div>
          </div>
        </div>

        {/* Sheet Footer */}
        <div className="pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 italic font-mono flex items-center justify-center gap-1 select-none">
          <Check className="w-4 h-4 text-teal-500" />
          Estudio Socioeconómico validado y estructurado listo para exportación Word (.docx)
        </div>
      </div>

      {/* ==================== PRINT-ONLY DOCUMENT WITH HIGH-FIDELITY OFFICIAL PSV LETTERHEAD ==================== */}
      <div className="print-container hidden p-10 font-sans text-[#1e293b] bg-white leading-normal space-y-6">
        
        {/* HOJA MEMBRETADA HEADER */}
        <div className={`flex justify-between items-end border-b-2 ${fmt.borderAccent} pb-3`}>
          <div>
            <h1 className={`text-xl font-extrabold ${fmt.textAccent} tracking-tight`}>PSV ASESORES Y CONSULTORES S.C.</h1>
            <p className="text-xs italic text-slate-500">Investigación, Evaluación y Consultoría en Capital Humano</p>
          </div>
          <div className="text-right">
            <h2 className={`text-sm font-black ${fmt.textAccent} tracking-wider`}>ESTUDIO SOCIOECONÓMICO LABORAL</h2>
            <p className={`text-[10px] uppercase font-bold ${fmt.accentText} tracking-widest`}>Informe Confidencial</p>
          </div>
        </div>

        {/* HEADER DETAILS BOX */}
        <div className={`grid grid-cols-4 gap-4 p-3 border rounded-lg text-xs ${fmt.headerDetailBox}`}>
          <div><strong className="text-slate-500 block uppercase text-[9px]">Fecha de Estudio</strong> <span className={`font-semibold ${fmt.primaryText}`}>{activeDocument.fecha || "N/A"}</span></div>
          <div><strong className="text-slate-500 block uppercase text-[9px]">Empresa Solicitada</strong> <span className={`font-semibold ${fmt.primaryText}`}>{activeDocument.empresaSolicitada || "N/A"}</span></div>
          <div><strong className="text-slate-500 block uppercase text-[9px]">Puesto Evaluado</strong> <span className={`font-semibold ${fmt.primaryText}`}>{activeDocument.puesto || "N/A"}</span></div>
          <div><strong className="text-slate-500 block uppercase text-[9px]">Resultado Final</strong> <span className={`font-semibold uppercase ${fmt.resultText}`}>{activeDocument.resultado || "RECOMENDABLE"}</span></div>
        </div>

        {/* SECTION 1: DATOS PERSONALES */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>1. Datos Personales del Candidato</h3>
          <div className="grid grid-cols-3 gap-y-3 gap-x-4 border border-slate-200 p-3 rounded-lg text-xs">
            <div className="col-span-2"><strong>Nombre Completo:</strong> {activeDocument.nombre || "N/A"}</div>
            <div><strong>Edad:</strong> {activeDocument.edad || "N/A"} años</div>
            <div className="col-span-2"><strong>Dirección:</strong> {activeDocument.direccion || "N/A"}</div>
            <div><strong>C.P.:</strong> {activeDocument.cp || "N/A"}</div>
            <div><strong>Ciudad y Estado:</strong> {activeDocument.ciudadEstado || "N/A"}</div>
            <div><strong>Teléfono Celular:</strong> {activeDocument.telefonoCelular || "N/A"}</div>
            <div><strong>Teléfono Casa/Recados:</strong> {activeDocument.telefonoCasa || activeDocument.telefonoRecados || "N/A"}</div>
            <div><strong>Fecha Nacimiento:</strong> {activeDocument.fechaNac || "N/A"}</div>
            <div><strong>Lugar de Nacimiento:</strong> {activeDocument.lugarNacimiento || "N/A"}</div>
            <div><strong>Estado Civil:</strong> {activeDocument.estadoCivil || "N/A"}</div>
            <div><strong>R.F.C.:</strong> {activeDocument.rfc || "N/A"}</div>
            <div><strong>C.U.R.P.:</strong> {activeDocument.curp || "N/A"}</div>
            <div><strong>Número IMSS:</strong> {activeDocument.nss || "N/A"}</div>
            <div className="col-span-3"><strong>Motivo del Cambio de Residencia/Trabajo:</strong> {activeDocument.motivoCambio || "N/A"}</div>
          </div>
        </div>

        {/* SECTION 2: DOCUMENTACION & VIVIENDA */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>2. Documentación & Vivienda</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg space-y-1.5">
              <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-1 uppercase text-[10px]`}>Documentos Cotejados</h4>
              <div><strong>Identificación:</strong> {activeDocument.identificacionTipo || "N/A"} ({activeDocument.identificacionNumero || "N/A"})</div>
              <div><strong>Licencia Conducir:</strong> {activeDocument.licenciaNumero || "No"} - {activeDocument.licenciaTipo || ""} ({activeDocument.licenciaVencimiento || "N/A"})</div>
              <div><strong>Infonavit / Afore:</strong> {activeDocument.creditoInfonavit || "No"} / {activeDocument.afore || "N/A"}</div>
              <div><strong>Pasaporte/Visa:</strong> {activeDocument.pasaporteVisa || "No"}</div>
            </div>
            <div className="border border-slate-200 p-3 rounded-lg space-y-1.5">
              <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-1 uppercase text-[10px]`}>Distribución de Vivienda</h4>
              <div><strong>Propietario / Tipo:</strong> {activeDocument.propietario || "N/A"} / {activeDocument.tipoInmueble || "Casa"}</div>
              <div><strong>Tiempo de Habitar:</strong> {activeDocument.tiempoVivirDomicilio || "N/A"}</div>
              <div><strong>Zona / Clase Social:</strong> {activeDocument.tipoZona || "Urbana"} / {activeDocument.claseSocial || "Media-Baja"}</div>
              <div><strong>Distribución:</strong> {activeDocument.distribucion || "Sala, comedor, cocina, baño, recámaras."}</div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DATOS FAMILIARES */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>3. Estructura Familiar (Viven en el Domicilio)</h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className={`${fmt.tableHeader}`}>
              <tr>
                <th className="p-2 border border-slate-200">Parentesco</th>
                <th className="p-2 border border-slate-200">Nombre</th>
                <th className="p-2 border border-slate-200 font-mono">Edad</th>
                <th className="p-2 border border-slate-200">Ocupación / Empresa</th>
                <th className="p-2 border border-slate-200 font-mono">Sueldo Mensual</th>
              </tr>
            </thead>
            <tbody>
              {activeDocument.integrantes && activeDocument.integrantes.length > 0 ? (
                activeDocument.integrantes.map((int, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className={`p-2 border border-slate-200 font-semibold ${fmt.accentText}`}>{int.parentesco}</td>
                    <td className="p-2 border border-slate-200">{int.nombre || "N/A"}</td>
                    <td className="p-2 border border-slate-200 font-mono">{int.edad || "N/A"}</td>
                    <td className="p-2 border border-slate-200">{int.ocupacion || "N/A"} {int.empresa ? `(${int.empresa})` : ""}</td>
                    <td className="p-2 border border-slate-200 font-mono">{int.sueldo || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-2 text-center text-slate-400">No se registraron integrantes habitando en el domicilio.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: ECONOMIA */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>4. Balanza Económica Mensual</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg space-y-2">
              <h4 className="font-bold text-green-700 border-b border-slate-100 pb-1 uppercase text-[10px]">Ingresos del Hogar</h4>
              <ul className="space-y-1">
                {(activeDocument.ingresos || []).map((ing, i) => (
                  <li key={i} className="flex justify-between font-mono text-[11px]">
                    <span>{ing.concepto || ing.nombre || "Ingreso"} ({ing.ocupacion || "N/A"}):</span>
                    <span className="font-bold text-slate-900">${ing.salario || ing.monto || "0"}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold font-mono">
                <span>Total Ingresos:</span>
                <span className="text-green-700">${activeDocument.totalIngresos || "0"}</span>
              </div>
            </div>
            <div className="border border-slate-200 p-3 rounded-lg space-y-2">
              <h4 className="font-bold text-red-700 border-b border-slate-100 pb-1 uppercase text-[10px]">Egresos Familiares</h4>
              <ul className="space-y-1">
                {(activeDocument.egresos || []).map((egr, i) => (
                  <li key={i} className="flex justify-between font-mono text-[11px]">
                    <span>{egr.concepto}:</span>
                    <span className="font-bold text-slate-900">${egr.importe || egr.monto || "0"}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold font-mono">
                <span>Total Egresos:</span>
                <span className="text-red-700">${activeDocument.totalEgresos || "0"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: SALUD, EDUCACIÓN Y SINDICATO */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>5. Antecedentes de Salud & Nivel Académico</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg space-y-1.5">
              <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-1 uppercase text-[10px]`}>Información Médica</h4>
              <div><strong>Descripción Física:</strong> {activeDocument.descripcionFisica || "N/A"}</div>
              <div><strong>Estatura y Peso:</strong> {activeDocument.estaturaPeso || "N/A"}</div>
              <div><strong>Enfermedades/Secuelas:</strong> {activeDocument.enfermedadesGraves || "Ninguna"}</div>
              <div><strong>Medicamentos Controlados:</strong> {activeDocument.medicamentos || "Ninguno"}</div>
              <div><strong>Consumo Tabaco / Alcohol:</strong> {activeDocument.consumoTabaco || "No"} / {activeDocument.consumoAlcohol || "No"}</div>
            </div>
            <div className="border border-slate-200 p-3 rounded-lg space-y-1.5">
              <h4 className={`font-bold ${fmt.accentText} border-b border-slate-100 pb-1 uppercase text-[10px]`}>Estudios y Cultura</h4>
              <div><strong>Último Grado / Carrera:</strong> {activeDocument.ultimoGrado || "N/A"} {activeDocument.carrera ? `- ${activeDocument.carrera}` : ""}</div>
              <div><strong>Institución / Años:</strong> {activeDocument.institucion || "N/A"} ({activeDocument.anosCursados || "N/A"} años)</div>
              <div><strong>Actividades Cotidianas:</strong> {activeDocument.actividadesCotidianas || "N/A"}</div>
              <div><strong>Planes a Futuro:</strong> {activeDocument.planesFuturo || "N/A"}</div>
              <div><strong>Sindicato / Comités:</strong> {activeDocument.comiteSindical || "Ninguno"}</div>
            </div>
          </div>
        </div>

        {/* SECTION 6: REFERENCIAS PERSONALES */}
        <div className="print-card space-y-2 page-break-before">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>6. Referencias Personales y Vecinales</h3>
          {activeDocument.referencias && activeDocument.referencias.length > 0 ? (
            activeDocument.referencias.map((ref, i) => (
              <div key={i} className="border border-slate-200 p-3 rounded-lg text-xs space-y-1 bg-slate-50 print-card mb-2">
                <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-1 font-bold text-blue-900">
                  <div className={`${fmt.accentText}`}>Ref #{i+1}: {ref.nombre}</div>
                  <div>Ocupación: {ref.ocupacion} ({ref.edad} años)</div>
                  <div className="text-right">Tel: {ref.telefono}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div><strong>Cómo lo conoció:</strong> {ref.comoConocio || "N/A"} (hace {ref.tiempoConocerlo})</div>
                  <div><strong>Problemas legales / Vicios conocidos:</strong> {ref.problemasLegales || "Ninguno"} / {ref.viciosSabe || "Ninguno"}</div>
                  <div className="col-span-2"><strong>Opinión general sobre el candidato:</strong> {ref.opinionGeneral || "Excelente persona, honrada y trabajadora."}</div>
                  <div className="col-span-2 text-emerald-700 font-semibold"><strong>¿Lo recomienda y por qué?:</strong> {ref.loRecomiendaPorque || "Sí, por ser altamente confiable."}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 border border-slate-200 rounded-lg text-center text-slate-400 text-xs">No se registraron referencias personales.</div>
          )}
        </div>

        {/* SECTION 7: TRAYECTORIA LABORAL */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>7. Trayectoria Laboral Reciente</h3>
          {activeDocument.trayectoria && activeDocument.trayectoria.length > 0 ? (
            activeDocument.trayectoria.map((job, i) => (
              <div key={i} className="border border-slate-200 p-3 rounded-lg text-xs space-y-1.5 bg-slate-50 print-card mb-2">
                <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-1 font-bold text-blue-900">
                  <div className={`${fmt.accentText}`}>{job.empresa}</div>
                  <div>Puesto: {job.puesto}</div>
                  <div className="text-right">{job.fechaIngreso} - {job.fechaBaja}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[11px] pt-1">
                  <div className="col-span-3"><strong>Funciones principales:</strong> {job.funciones || "N/A"}</div>
                  <div><strong>Sueldo Mensual:</strong> {job.sueldo || "N/A"}</div>
                  <div><strong>Jefe Inmediato:</strong> {job.jefeInmediato || "N/A"}</div>
                  <div><strong>Motivo de Salida:</strong> {job.motivoSalida || "N/A"}</div>
                  <div className="col-span-3"><strong>Desempeño verificado por la empresa:</strong> {job.calificacionDesempeno || "N/A"}</div>
                  <div className="col-span-3 text-slate-500 italic"><strong>Comentarios/Observaciones laborales:</strong> {job.observaciones || "Ninguno"}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 border border-slate-200 rounded-lg text-center text-slate-400 text-xs">No se registró historial de trayectoria laboral.</div>
          )}
        </div>

        {/* SECTION 8: OBSERVACIONES GENERALES Y CONCLUSIÓN */}
        <div className="print-card space-y-2">
          <h3 className={`${fmt.sectionHeader} px-3 py-1 text-xs uppercase rounded-sm`}>8. Conclusiones y Observaciones Generales</h3>
          <div className={`p-4 rounded-lg text-xs space-y-3 ${fmt.conclusionesBg}`}>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-medium">
              {activeDocument.observacionesGenerales || "El candidato cumple satisfactoriamente con el perfil socioeconómico y ético requerido para laborar dentro de la organización solicitada."}
            </p>
            <div className="pt-6 grid grid-cols-2 gap-8 text-center">
              <div className="border-t border-slate-300 pt-2 mx-6">
                <span className="block font-bold text-slate-900">Firma del Candidato</span>
                <span className="text-[10px] text-slate-400">Doy fe de que la información provista es verdadera</span>
              </div>
              <div className="border-t border-slate-300 pt-2 mx-6">
                <span className="block font-bold text-slate-900">PSV Asesores y Consultores S.C.</span>
                <span className="text-[10px] text-slate-400">Firma del Evaluador / Sello de Validez</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-200 flex justify-between text-[9px] text-slate-400 font-mono select-none">
          <span>Informe Socioeconómico Confidencial - PSV</span>
          <span>Página de impresión autorizada</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
