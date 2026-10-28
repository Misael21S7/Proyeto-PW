import { SocioeconomicStudy } from "../types";

export interface DemoTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  document: SocioeconomicStudy;
}

export const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: "estudio_christian",
    name: "Estudio Socioeconómico - Christian Silva Tirado",
    category: "Estudio Socioeconómico Laboral",
    imageUrl: "/plantilla-demo.svg",
    document: {
      fecha: "Tijuana B.C. a 27 de Junio del 2026",
      empresaSolicitada: "EMPORIO AUTOMOTRIZ",
      puesto: "Asesor Comercial de Ventas",
      resultado: "RECOMENDABLE CON RESERVAS (Garantía de Refinería Completa)",
      nombre: "CHRISTIAN SILVA TIRADO",
      direccion: "Calle de la Amistad #4510, Colonia Infonavit Lomas",
      cp: "22000",
      ciudadEstado: "Tijuana, Baja California",
      telefonoCasa: "664-621-8903",
      telefonoCelular: "664-320-1122",
      telefonoRecados: "N/A",
      fechaNac: "14/08/1995",
      lugarNacimiento: "Mazatlán, Sinaloa",
      edad: "30 años",
      tiempoRadicarCiudad: "12 años",
      motivoCambio: "Búsqueda de superación económica y comisiones más competitivas",
      rfc: "SITC950814H22",
      curp: "SITC950814HBCLLR09",
      nss: "3495-95-10293",
      estadoCivil: "Soltero",
      religion: "Católica",
      identificacionTipo: "INE / Credencial de Elector",
      identificacionNumero: "0491029384910",
      actaNacimiento: "Folio 90281-A",
      actaMatrimonio: "N/A",
      licenciaNumero: "TIJ-90123-B",
      licenciaTipo: "Tipo A (Chofer Particular)",
      licenciaVencimiento: "15/12/2028",
      cartillaMilitar: "Sinaloa-95-8291 (Liberada)",
      creditoInfonavit: "No activo actualmente",
      pasaporteVisa: "Pasaporte Mexicano Vigente / Sin Visa Láser",
      afore: "SURA Pensiones",
      personasHabitan: "3",
      integrantes: [
        { nombre: "María de Jesús Tirado", parentesco: "Madre", edad: "58", ocupacion: "Hogar" },
        { nombre: "Carlos Silva Tirado", parentesco: "Hermano", edad: "26", ocupacion: "Estudiante Universitario" }
      ],
      dependientes: "Madre (María de Jesús Tirado) de forma parcial",
      familiaresNoViven: [
        { nombre: "Roberto Silva Solís", parentesco: "Padre", edad: "61", ocupacion: "Jubilado", telefono: "669-981-2233", lugarResidencia: "Mazatlán, Sin." }
      ],
      propietario: "Arrendador S.A. (Contrato a nombre del candidato)",
      tiempoVivirDomicilio: "4 años",
      tipoInmueble: "Departamento en condominio",
      adquisicion: "Rentado ($450 USD mensuales)",
      distribucion: "2 recámaras, 1 baño completo, sala, comedor, cocina y patio de servicio",
      claseSocial: "Media-Baja",
      tipoZona: "Urbana popular con pavimentación completa y transporte accesible",
      observacionesVivienda: "La vivienda se observa en condiciones higiénicas óptimas. Cuenta con todos los servicios públicos esenciales.",
      ingresos: [
        { nombre: "Christian Silva Tirado", ocupacion: "Candidato", empresa: "Candidato", salario: "12500" },
        { nombre: "Carlos Silva Tirado", ocupacion: "Hermano (Beca)", empresa: "UABC", salario: "3500" }
      ],
      totalIngresos: "16000",
      egresos: [
        { concepto: "Renta / Hipoteca", importe: "8000" },
        { concepto: "Alimentación", importe: "3500" },
        { concepto: "Electricidad (Luz)", importe: "600" },
        { concepto: "Agua Potable", importe: "300" },
        { concepto: "Gas L.P.", importe: "250" },
        { concepto: "Educación", importe: "1000" },
        { concepto: "Teléfono o Celular", importe: "500" },
        { concepto: "Transportación / Gasolina", importe: "1200" }
      ],
      totalEgresos: "15350",
      creditos: [
        { institucion: "Coppel S.A.", tipoCredito: "Crédito departamental ropa", saldoActual: "3400", pagoMensual: "450", importeAtrasado: "0" }
      ],
      patrimonio: [
        { tipo: "Muebles", descripcion: "Enseres domésticos de cocina, sala y recámara estándar", valor: "25000" },
        { tipo: "Vehículo", descripcion: "Nissan Sentra modelo 2012, placas locales, regularizado", valor: "75000" }
      ],
      descripcionFisica: "Masculino, complexión media, tez morena clara, cabello corto oscuro",
      estaturaPeso: "1.76 m. / 82 Kg.",
      senasParticulares: "Cicatriz lineal de aprox. 3cm en antebrazo derecho",
      cirugiasRecientes: "Apendicectomía realizada en el año 2021 sin complicaciones",
      accidentes: "N/A",
      enfermedadesGraves: "Ninguna reportada ni detectada",
      medicamentos: "Ninguno",
      consumoTabaco: "No",
      consumoAlcohol: "Ocasional (social, fines de semana sin exceso)",
      serviciosMedicosFamilia: "IMSS / Centro de Salud General",
      frecuenciaAsistenciaMedico: "Solo en caso de enfermedad recurrente (1 o 2 veces al año)",
      ultimoGrado: "Licenciatura Trunca (Administración de Empresas)",
      estudiaActualmente: "No",
      horarioEscolar: "N/A",
      institucion: "Universidad Autónoma de Baja California",
      anosCursados: "3 años (6 semestres)",
      carrera: "Administración de Empresas",
      ciudadEscuela: "Tijuana, B.C.",
      motivoAbandono: "Falta de recursos económicos para pago de reinscripciones, optó por trabajar de tiempo completo",
      carreraDeseaEstudiar: "Concluir Licenciatura en Administración o Mercadotecnia",
      actividadesCotidianas: "Ver televisión, escuchar música, convivir con su hermano, realizar mantenimiento a su auto",
      asociacionesPertenece: "Ninguna",
      programasTvMusica: "Películas de acción, series de drama. Música variada (sinaloense y rock en español)",
      lecturaAcostumbrada: "Prensa digital local, artículos de ventas",
      lugaresEsparcimiento: "Plazas comerciales de la zona, parques públicos y cines",
      planesFuturo: "Adquirir una casa propia a mediano plazo y consolidarse en el sector de ventas automotrices",
      deporteActividad: "Fútbol rápido los domingos por la mañana",
      comiteSindical: "Nunca ha pertenecido",
      reunionesAmistades: "Quincenales en casa de amigos de la carrera",
      experienciaLaboralResumen: "8 años de experiencia acumulada en ventas de piso, atención al cliente y promotoría de seguros",
      expectativaContratado: "Estabilidad a largo plazo, crecimiento profesional e ingresos de comisión crecientes",
      referencias: [
        {
          nombre: "Ing. Jorge Luis Ortiz Pérez",
          edad: "42",
          ocupacion: "Gerente de Operaciones",
          direccion: "Av. Paseo del Río #120, Tijuana",
          telefono: "664-102-3948",
          comoConocio: "Fue su jefe directo en su empleo anterior en Distribuidora Alfa",
          tiempoConocerlo: "5 años",
          empleosPuestosSabe: "Vendedor de Cambaceo y Asesor Telefónico",
          opinionGeneral: "Excelente colaborador, honesto, proactivo y muy enfocado en metas mensuales.",
          viciosSabe: "Ninguno que afecte su vida laboral",
          problemasLegales: "No, excelente conducta ciudadana",
          loRecomiendaPorque: "Es una persona comprometida con la satisfacción del cliente y con alto sentido de responsabilidad."
        },
        {
          nombre: "Lic. Sandra María Beltrán",
          edad: "29",
          ocupacion: "Ejecutiva Bancaria",
          direccion: "Calle 10ma #230, Zona Centro, Tijuana",
          telefono: "664-555-8291",
          comoConocio: "Compañera de estudios de nivel licenciatura",
          tiempoConocerlo: "6 años",
          empleosPuestosSabe: "Vendedor en Tienda Departamental y Estudiante",
          opinionGeneral: "Muy tenaz y perseverante. Resuelve problemas con calma y es un buen compañero.",
          viciosSabe: "No tiene vicios notorios",
          problemasLegales: "Ninguno",
          loRecomiendaPorque: "Conozco sus valores éticos y el esfuerzo constante que aplica para apoyar a su familia."
        }
      ],
      trayectoria: [
        {
          empresa: "DISTRIBUIDORA DE AUTOPARTES ALFA S.A.",
          direccion: "Blvd. Díaz Ordaz #8900, Tijuana",
          giro: "Automotriz / Refacciones",
          telefono: "664-681-1200",
          puesto: "Asesor de Ventas de Mayoreo",
          funciones: "Prospección de nuevos clientes, visitas a talleres mecánicos, cotizaciones de lotes de refacciones, cierre de convenios comerciales.",
          fechaIngreso: "01/03/2023",
          fechaBaja: "15/05/2026",
          sueldo: "11,500 MXN mensuales + comisiones",
          personalCargo: "Ninguno",
          horario: "Lunes a Viernes de 8:30 a 18:00 hrs y Sábados de 9:00 a 13:00 hrs",
          prestaciones: "De ley (IMSS, Infonavit, vacaciones)",
          tipoTrabajador: "Planta",
          jefeInmediato: "Ing. Jorge Luis Ortiz (Gerente de Ventas)",
          motivoSalida: "Búsqueda de mejores comisiones en el ramo de vehículos completos",
          calificacionDesempeno: "Excelente. Cumplió al 105% la meta de ventas semestral.",
          contactoEmpresa: "Apto para solicitar referencias",
          observaciones: "Se corroboró que su trayectoria de salida fue limpia y en excelentes términos con la dirección general."
        },
        {
          empresa: "TIENDAS DE CONVENIENCIA DEL NORTE S.A.",
          direccion: "Av. Revolución #330, Zona Centro, Tijuana",
          giro: "Comercio minorista (Retail)",
          telefono: "664-621-3300",
          puesto: "Subencargado de Turno / Cajero Principal",
          funciones: "Arqueo de cajas, recepción de proveedores de alimentos, supervisión de dos cajeros auxiliares, control de inventarios físicos.",
          fechaIngreso: "10/01/2020",
          fechaBaja: "28/02/2023",
          sueldo: "8,500 MXN mensuales",
          personalCargo: "2 cajeros auxiliares",
          horario: "Turno Vespertino Rotativo de 15:00 a 23:00 hrs",
          prestaciones: "De ley + vales de despensa mensuales",
          tipoTrabajador: "Planta",
          jefeInmediato: "Lic. Manuel Hernández (Gerente de Sucursal)",
          motivoSalida: "Mejora de horario y crecimiento profesional en distribuidora automotriz",
          calificacionDesempeno: "Bueno, muy puntual y confiable en el manejo de efectivo.",
          contactoEmpresa: "Apto para solicitar referencias",
          observaciones: "No se reportaron faltantes de inventario o efectivo durante su periodo laboral de 3 años."
        }
      ],
      seEncontroCandidatoCasa: "Sí, el candidato se encontraba presente y vestido formalmente para la entrevista.",
      intervinoFamiliar: "Su madre (María de Jesús) saludó cortésmente pero se retiró de la sala para permitir la entrevista privada.",
      periodosInactividad: "N/A - Continuidad laboral comprobada.",
      comoSolventoNecesidades: "N/A - Siempre activo.",
      empresasDondeAplico: "Solo en Emporio Automotriz en este proceso de reclutamiento activo.",
      experienciaPuesto: "Cuenta con sólida experiencia en refacciones automotrices, lo que le otorga ventaja técnica para vender autos.",
      interesPuesto: "Alto interés por ingresar al ramo de comisiones de agencia de autos.",
      motivacion: "Apoyar económicamente a su madre y poder continuar sus estudios de administración.",
      honestidad: "Mostró apertura absoluta y congruencia con toda la documentación presentada.",
      condicionesTrabajo: "Acepta los horarios requeridos, incluyendo fines de semana para guardias de piso de venta.",
      observacionesGenerales: "El candidato Christian Silva Tirado cumple con el perfil socioeconómico y ético requerido. Su actitud es muy profesional, cuenta con estabilidad familiar and arraigo de domicilio en Tijuana. Es RECOMENDABLE para el puesto solicitado.",
      confidenceScore: "98.5% (Estructura de alta definición)",
      idiomaDetectado: "Español (ES)",
      tiempoEstimadoAnalisis: "12 segundos (Humano: 25 min)"
    }
  }
];
