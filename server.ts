import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Set up bodies with a large limit to accept large images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for GoogleGenAI client
let aiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Clave API 'GEMINI_API_KEY' no encontrada. Cree un archivo .env en la raíz del proyecto (use .env.example como guía) y agregue su clave para poder usar la transcripción en vivo.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Helper function to handle retry with exponential backoff and automatic model fallback on unavailability (e.g. 503 error)
async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  params: any,
  maxRetries = 3,
  initialDelayMs = 1500
): Promise<any> {
  // Modelos configurables por la variable GEMINI_MODELS (separados por coma).
  // El primero es el principal y los siguientes se usan como respaldo.
  const modelsToTry = (process.env.GEMINI_MODELS || "gemini-3.5-flash,gemini-3.1-flash-lite")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = initialDelayMs;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Intentando generación con modelo: ${model} (Intento ${attempt}/${maxRetries})`);
        // We set the model in the parameters
        const currentParams = { ...params, model };
        const response = await ai.models.generateContent(currentParams);
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = String(err.message || err);
        const errStatus = err.status || (err.error && err.error.code);

        console.warn(`Error al usar modelo ${model} (Intento ${attempt}/${maxRetries}):`, errStr, "Status/Code:", errStatus);

        // Check if the error is due to high demand, rate limiting, or general service unavailability
        const isUnavailable =
          errStatus === 503 ||
          errStatus === 429 ||
          errStr.includes("503") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("Resource exhausted") ||
          errStr.includes("temporary");

        if (isUnavailable && attempt < maxRetries) {
          console.log(`Servicio saturado o no disponible temporalmente. Reintentando en ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        } else {
          // If not retriable, or we exceeded retries for this model, break to proceed to fallback model
          break;
        }
      }
    }
    console.warn(`El modelo ${model} falló o está saturado. Intentando modelo de respaldo...`);
  }

  throw lastError || new Error("Todos los intentos con todos los modelos de IA fallaron.");
}

// Endpoint to analyze images using Gemini OCR & Structured Parsing specifically for the ESTUDIO SOCIOECONÓMICO LABORAL
app.post("/api/analyze", async (req, res) => {
  try {
    const { images, customPrompt } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
       res.status(400).json({ error: "Debe proporcionar al menos una imagen." });
       return;
    }

    // Convert client images to Gemini parts safely
    const imageParts = images.map((img: any) => {
      let dataUrl = "";
      let mimeType = "image/jpeg"; // default to jpeg as per user's format

      if (typeof img === "string") {
        dataUrl = img;
      } else if (img && typeof img.data === "string") {
        dataUrl = img.data;
        if (img.mimeType) {
          mimeType = img.mimeType;
        }
      }

      // Extract mimeType from data URL if present, e.g., "data:image/jpeg;base64,..."
      const mimeMatch = dataUrl.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }

      // Remove data:image/...;base64, prefix if present
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      return {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      };
    });

    const systemPrompt = `Eres un sistema experto decodificador de formularios, analizador sintáctico y herramienta OCR avanzada de extracción de datos con inteligencia artificial de nivel de producción.
Tu tarea es analizar detalladamente las imágenes del documento proporcionado, que corresponde al "ESTUDIO SOCIOECONÓMICO LABORAL" de PSV Asesores y Consultores S.C.

*** RESILIENCIA ANTE IMÁGENES IMPERFECTAS (JPEG / FOTOS DE CELULAR) ***
Las imágenes proporcionadas son capturas en formato JPEG tomadas frecuentemente con cámaras de teléfonos móviles bajo condiciones del mundo real. Debes ser extremadamente tolerante y hábil con las siguientes imperfecciones:
1. ESCRITURA MANUSCRITA (LETRA A MANO): Muchos de los campos y tablas están llenados con bolígrafo/pluma. Realiza una decodificación de escritura cursiva o de molde con alta tolerancia.
2. TACHADURAS Y CORRECCIONES: Si un dato manuscrito fue tachado o corregido, extrae el dato final corregido (ignora la tachadura).
3. CONTRASTE Y SOMBRAS: Las fotos pueden tener sombras de manos o celulares, baja iluminación o distorsión de color. Ignora las sombras y extrae las palabras de forma clara.
4. INCLINACIÓN (SKEW) Y ARREGLO DE PERSPECTIVA: Los documentos pueden estar girados, rotados, doblados o arrugados. Reconstruye mentalmente la estructura de la cuadrícula o las tablas del formulario basándote en los títulos de columna.
5. CONTEXTUALIZACIÓN INTELIGENTE: Si una palabra está ligeramente borrosa u obstruida, dedúcela inteligentemente de su contexto. Por ejemplo, si ves "Tijua_a" en ciudad y "Baja Ca_ifornia" en estado, rellena "Tijuana" y "Baja California" de forma correcta. Si un número telefónico tiene 9 dígitos visibles, reconstrúyelo o déjalo lo más completo posible.

Debes extraer con precisión toda la información manuscrita u impresa, rellenando el formato estructurado JSON de manera exhaustiva. Si alguna celda o campo está totalmente vacío o es imposible de leer en la imagen, devuélvelo como una cadena vacía (""). No inventes datos que no existan, pero reconstruye con criterio los existentes.

Instrucciones por Sección del Documento:
1. Encabezado general: Extrae la fecha, empresa solicitada, puesto y resultado.
2. DATOS DEL EMPLEADO: Extrae Nombre, Dirección, C.P., Ciudad y Estado, Teléfonos (Casa, Celular, Recados), Fecha de Nacimiento, Lugar de Nacimiento, Edad, Tiempo de radicar en la ciudad, Motivo de Cambio, R.F.C., C.U.R.P., Número IMSS (NSS), Estado Civil y Religión.
3. DOCUMENTACION: Identificación oficial, tipo, número, acta de nacimiento, acta de matrimonio, licencia, tipo, vencimiento, cartilla militar, crédito Infonavit, pasaporte o Visa, AFORE.
4. DATOS FAMILIARES: Número de personas en la vivienda, tabla de integrantes que viven con el empleado, dependientes económicos, y familiares directos que NO viven con el candidato.
5. DATOS DE LA VIVIENDA: Propietario, tiempo de vivir ahí, tipo de inmueble, distribución, clase social, tipo de zona y observaciones.
6. DATOS ECONÓMICOS: Tabla de ingresos mensuales, total ingresos, egresos mensuales detallados por rubro, créditos y patrimonio familiar.
7. ANTECEDENTES MÉDICOS: Estatura, peso, señas particulares, cirugías, accidentes, enfermedades graves, medicamentos, consumo de tabaco/alcohol, servicios médicos y frecuencia.
8. INFORMACIÓN ESCOLAR: Último grado, institución, años cursados, carrera, ciudad, si estudia actualmente, horario, motivo de abandono y metas.
9. CARACTERÍSTICAS SOCIO-CULTURALES: Actividades cotidianas, asociaciones, lectura, esparcimiento, planes, deporte, comité sindical, reuniones, experiencia y expectativa de contratación.
10. REFERENCIAS PERSONALES: Extrae la tabla de referencias detalladamente (nombre, edad, ocupación, dirección, teléfono, opinión general, vicios, etc.).
11. TRAYECTORIA LABORAL: Extrae el empleo actual o último, y los empleos anteriores (empresa, puesto, funciones, fechas, sueldos, motivo de salida, etc.).
12. ASPECTOS GENERALES DE LA ENTREVISTA: Si se encontró en casa, si intervino un familiar, periodos de inactividad, etc.
13. METADATOS: Estima el tiempo real que tardaría un transcriptor humano en transcribir todo este documento (por ejemplo, '25 minutos') versus el tiempo que te tomó procesarlo a ti (por ejemplo, '12 segundos') y colócalo en el campo tiempoEstimadoAnalisis (ej: '12 segundos (Humano: 25 min)').`;

    const userPromptText = customPrompt 
      ? `Realiza la extracción OCR del Estudio Socioeconómico Laboral aplicando además estas instrucciones del usuario: "${customPrompt}"`
      : "Analiza el Estudio Socioeconómico Laboral adjunto y rellena el JSON estructurado con precisión milimétrica.";

    const textPart = {
      text: userPromptText,
    };

    // Call Gemini with the full SocioeconomicStudy schema using retry and fallback mechanism
    const response = await generateContentWithRetryAndFallback(getGenAI(), {
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fecha: { type: Type.STRING },
            empresaSolicitada: { type: Type.STRING },
            puesto: { type: Type.STRING },
            resultado: { type: Type.STRING },

            nombre: { type: Type.STRING },
            direccion: { type: Type.STRING },
            cp: { type: Type.STRING },
            ciudadEstado: { type: Type.STRING },
            telefonoCasa: { type: Type.STRING },
            telefonoCelular: { type: Type.STRING },
            telefonoRecados: { type: Type.STRING },
            fechaNac: { type: Type.STRING },
            lugarNacimiento: { type: Type.STRING },
            edad: { type: Type.STRING },
            tiempoRadicarCiudad: { type: Type.STRING },
            motivoCambio: { type: Type.STRING },
            rfc: { type: Type.STRING },
            curp: { type: Type.STRING },
            nss: { type: Type.STRING },
            estadoCivil: { type: Type.STRING },
            religion: { type: Type.STRING },

            identificacionTipo: { type: Type.STRING },
            identificacionNumero: { type: Type.STRING },
            actaNacimiento: { type: Type.STRING },
            actaMatrimonio: { type: Type.STRING },
            licenciaNumero: { type: Type.STRING },
            licenciaTipo: { type: Type.STRING },
            licenciaVencimiento: { type: Type.STRING },
            cartillaMilitar: { type: Type.STRING },
            creditoInfonavit: { type: Type.STRING },
            pasaporteVisa: { type: Type.STRING },
            afore: { type: Type.STRING },

            personasHabitan: { type: Type.STRING },
            integrantes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  parentesco: { type: Type.STRING },
                  edad: { type: Type.STRING },
                  ocupacion: { type: Type.STRING }
                }
              }
            },
            dependientes: { type: Type.STRING },
            familiaresNoViven: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  parentesco: { type: Type.STRING },
                  edad: { type: Type.STRING },
                  ocupacion: { type: Type.STRING },
                  telefono: { type: Type.STRING },
                  lugarResidencia: { type: Type.STRING }
                }
              }
            },

            propietario: { type: Type.STRING },
            tiempoVivirDomicilio: { type: Type.STRING },
            tipoInmueble: { type: Type.STRING },
            adquisicion: { type: Type.STRING },
            distribucion: { type: Type.STRING },
            claseSocial: { type: Type.STRING },
            tipoZona: { type: Type.STRING },
            observacionesVivienda: { type: Type.STRING },

            ingresos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  ocupacion: { type: Type.STRING },
                  empresa: { type: Type.STRING },
                  salario: { type: Type.STRING }
                }
              }
            },
            totalIngresos: { type: Type.STRING },
            egresos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  concepto: { type: Type.STRING },
                  importe: { type: Type.STRING }
                }
              }
            },
            totalEgresos: { type: Type.STRING },
            creditos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institucion: { type: Type.STRING },
                  tipoCredito: { type: Type.STRING },
                  saldoActual: { type: Type.STRING },
                  pagoMensual: { type: Type.STRING },
                  importeAtrasado: { type: Type.STRING }
                }
              }
            },
            patrimonio: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tipo: { type: Type.STRING },
                  descripcion: { type: Type.STRING },
                  valor: { type: Type.STRING }
                }
              }
            },

            descripcionFisica: { type: Type.STRING },
            estaturaPeso: { type: Type.STRING },
            senasParticulares: { type: Type.STRING },
            cirugiasRecientes: { type: Type.STRING },
            accidentes: { type: Type.STRING },
            enfermedadesGraves: { type: Type.STRING },
            medicamentos: { type: Type.STRING },
            consumoTabaco: { type: Type.STRING },
            consumoAlcohol: { type: Type.STRING },
            serviciosMedicosFamilia: { type: Type.STRING },
            frecuenciaAsistenciaMedico: { type: Type.STRING },

            ultimoGrado: { type: Type.STRING },
            estudiaActualmente: { type: Type.STRING },
            horarioEscolar: { type: Type.STRING },
            institucion: { type: Type.STRING },
            anosCursados: { type: Type.STRING },
            carrera: { type: Type.STRING },
            ciudadEscuela: { type: Type.STRING },
            motivoAbandono: { type: Type.STRING },
            carreraDeseaEstudiar: { type: Type.STRING },

            actividadesCotidianas: { type: Type.STRING },
            asociacionesPertenece: { type: Type.STRING },
            programasTvMusica: { type: Type.STRING },
            lecturaAcostumbrada: { type: Type.STRING },
            lugaresEsparcimiento: { type: Type.STRING },
            planesFuturo: { type: Type.STRING },
            deporteActividad: { type: Type.STRING },
            comiteSindical: { type: Type.STRING },
            reunionesAmistades: { type: Type.STRING },
            experienciaLaboralResumen: { type: Type.STRING },
            expectativaContratado: { type: Type.STRING },

            referencias: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nombre: { type: Type.STRING },
                  edad: { type: Type.STRING },
                  ocupacion: { type: Type.STRING },
                  direccion: { type: Type.STRING },
                  telefono: { type: Type.STRING },
                  comoConocio: { type: Type.STRING },
                  tiempoConocerlo: { type: Type.STRING },
                  empleosPuestosSabe: { type: Type.STRING },
                  opinionGeneral: { type: Type.STRING },
                  viciosSabe: { type: Type.STRING },
                  problemasLegales: { type: Type.STRING },
                  loRecomiendaPorque: { type: Type.STRING }
                }
              }
            },

            trayectoria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  empresa: { type: Type.STRING },
                  direccion: { type: Type.STRING },
                  giro: { type: Type.STRING },
                  telefono: { type: Type.STRING },
                  puesto: { type: Type.STRING },
                  funciones: { type: Type.STRING },
                  fechaIngreso: { type: Type.STRING },
                  fechaBaja: { type: Type.STRING },
                  sueldo: { type: Type.STRING },
                  personalCargo: { type: Type.STRING },
                  horario: { type: Type.STRING },
                  prestaciones: { type: Type.STRING },
                  tipoTrabajador: { type: Type.STRING },
                  jefeInmediato: { type: Type.STRING },
                  motivoSalida: { type: Type.STRING },
                  calificacionDesempeno: { type: Type.STRING },
                  contactoEmpresa: { type: Type.STRING },
                  observaciones: { type: Type.STRING }
                }
              }
            },

            seEncontroCandidatoCasa: { type: Type.STRING },
            intervinoFamiliar: { type: Type.STRING },
            periodosInactividad: { type: Type.STRING },
            comoSolventoNecesidades: { type: Type.STRING },
            empresasDondeAplico: { type: Type.STRING },
            experienciaPuesto: { type: Type.STRING },
            interesPuesto: { type: Type.STRING },
            motivacion: { type: Type.STRING },
            honestidad: { type: Type.STRING },
            condicionesTrabajo: { type: Type.STRING },

            observacionesGenerales: { type: Type.STRING },
            confidenceScore: { type: Type.STRING },
            idiomaDetectado: { type: Type.STRING },
            tiempoEstimadoAnalisis: { type: Type.STRING }
          },
          required: [
            "nombre", "fecha", "empresaSolicitada", "puesto", "resultado"
          ]
        }
      }
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error("No se recibió respuesta del modelo de inteligencia artificial.");
    }

    const parsedData = JSON.parse(rawText);
    res.json(parsedData);

  } catch (error: any) {
    console.error("Error en /api/analyze:", error);
    res.status(500).json({ 
      error: "Ocurrió un error al procesar las imágenes con Inteligencia Artificial.", 
      details: error.message 
    });
  }
});

// Configure Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files server mounted.");
  }

  app.listen(PORT, process.env.HOST || "localhost", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
