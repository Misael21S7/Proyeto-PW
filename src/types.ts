export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
  email: string;
}

export interface FamiliarIntegrante {
  nombre: string;
  parentesco: string;
  edad: string;
  ocupacion: string;
  sueldo?: string;
  empresa?: string;
  direccion?: string;
}

export interface FamiliarNoVive {
  nombre: string;
  parentesco: string;
  edad: string;
  ocupacion: string;
  telefono: string;
  lugarResidencia: string;
  direccion?: string;
}

export interface IngresoMensual {
  nombre: string;
  ocupacion: string;
  empresa: string;
  salario: string;
  concepto?: string;
  monto?: string;
}

export interface EgresoMensual {
  concepto: string;
  importe: string;
  monto?: string;
}

export interface CreditoItem {
  institucion: string;
  tipoCredito: string;
  saldoActual: string;
  pagoMensual: string;
  importeAtrasado: string;
  saldoDeudor?: string;
}

export interface PatrimonioItem {
  tipo: string; // Muebles, Vehículos, Casa, Terreno, Otro
  descripcion: string;
  valor: string;
}

export interface ReferenciaPersonal {
  nombre: string;
  edad: string;
  ocupacion: string;
  direccion: string;
  telefono: string;
  comoConocio: string;
  tiempoConocerlo: string;
  empleosPuestosSabe: string;
  opinionGeneral: string;
  viciosSabe: string;
  problemasLegales: string;
  loRecomiendaPorque: string;
  relacion?: string;
  domicilio?: string;
}

export interface TrayectoriaLaboralItem {
  empresa: string;
  direccion: string;
  giro: string;
  telefono: string;
  puesto: string;
  funciones: string;
  fechaIngreso: string;
  fechaBaja: string;
  sueldo: string;
  personalCargo: string;
  horario: string;
  prestaciones: string;
  tipoTrabajador: string;
  jefeInmediato: string;
  motivoSalida: string;
  calificacionDesempeno: string;
  contactoEmpresa: string;
  observaciones: string;
}

export interface SocioeconomicStudy {
  // Encabezado
  fecha: string;
  empresaSolicitada: string;
  puesto: string;
  resultado: string;

  // Datos del Empleado
  nombre: string;
  direccion: string;
  cp: string;
  ciudadEstado: string;
  telefonoCasa: string;
  telefonoCelular: string;
  telefonoRecados: string;
  fechaNac: string;
  lugarNacimiento: string;
  edad: string;
  tiempoRadicarCiudad: string;
  motivoCambio: string;
  rfc: string;
  curp: string;
  nss: string;
  estadoCivil: string;
  religion: string;

  // Documentacion
  identificacionTipo: string;
  identificacionNumero: string;
  actaNacimiento: string;
  actaMatrimonio: string;
  licenciaNumero: string;
  licenciaTipo: string;
  licenciaVencimiento: string;
  cartillaMilitar: string;
  creditoInfonavit: string;
  pasaporteVisa: string;
  afore: string;

  // Datos Familiares
  personasHabitan: string;
  integrantes: FamiliarIntegrante[];
  dependientes: string;
  familiaresNoViven: FamiliarNoVive[];

  // Datos de la Vivienda
  propietario: string;
  tiempoVivirDomicilio: string;
  tipoInmueble: string;
  adquisicion: string;
  distribucion: string;
  claseSocial: string;
  tipoZona: string;
  observacionesVivienda: string;

  // Datos Económicos
  ingresos: IngresoMensual[];
  totalIngresos: string;
  egresos: EgresoMensual[];
  totalEgresos: string;
  creditos: CreditoItem[];
  patrimonio: PatrimonioItem[];

  // Antecedentes Médicos
  descripcionFisica: string;
  estaturaPeso: string;
  senasParticulares: string;
  cirugiasRecientes: string;
  accidentes: string;
  enfermedadesGraves: string;
  medicamentos: string;
  consumoTabaco: string;
  consumoAlcohol: string;
  serviciosMedicosFamilia: string;
  frecuenciaAsistenciaMedico: string;

  // Información Escolar
  ultimoGrado: string;
  estudiaActualmente: string;
  horarioEscolar: string;
  institucion: string;
  anosCursados: string;
  carrera: string;
  ciudadEscuela: string;
  motivoAbandono: string;
  carreraDeseaEstudiar: string;

  // Características Socio-Culturales
  actividadesCotidianas: string;
  asociacionesPertenece: string;
  programasTvMusica: string;
  lecturaAcostumbrada: string;
  lugaresEsparcimiento: string;
  planesFuturo: string;
  deporteActividad: string;
  comiteSindical: string;
  reunionesAmistades: string;
  experienciaLaboralResumen: string;
  expectativaContratado: string;

  // Referencias Personales
  referencias: ReferenciaPersonal[];

  // Trayectoria Laboral
  trayectoria: TrayectoriaLaboralItem[];

  // Aspectos Generales de la Entrevista
  seEncontroCandidatoCasa: string;
  intervinoFamiliar: string;
  periodosInactividad: string;
  comoSolventoNecesidades: string;
  empresasDondeAplico: string;
  experienciaPuesto: string;
  interesPuesto: string;
  motivacion: string;
  honestidad: string;
  condicionesTrabajo: string;

  // Observaciones y Metadatos de Extracción
  observacionesGenerales: string;
  confidenceScore: string;
  idiomaDetectado: string;
  tiempoEstimadoAnalisis?: string;
}

export interface SavedFile {
  id: string;
  name: string;
  document: SocioeconomicStudy;
  images: string[]; // Base64 images used for extraction
  createdAt: string;
  lastModified: string;
  ownerId: string;
  ownerName: string;
}

export interface ExportPermissions {
  allowUserDownload: boolean;
  requireAdminApproval: boolean;
  docxFormatEnabled: boolean;
  maxImageLimit: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  action: string;
  fileName: string;
  details: string;
}
