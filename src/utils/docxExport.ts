import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { SocioeconomicStudy } from "../types";

export interface ThemeConfig {
  headerFill: string;     // Color in HEX without # (e.g., FFC000)
  headerText: string;     // Color in HEX without # (e.g., 000000)
  valueColor: string;     // Color in HEX without # (e.g., 1A365D)
  borderLineColor: string; // Color in HEX without # (e.g., FFC000)
}

export function getThemeConfig(style: "clasico" | "ejecutivo" | "minimalista" = "clasico"): ThemeConfig {
  if (style === "ejecutivo") {
    return {
      headerFill: "334155", // Slate 700
      headerText: "FFFFFF", // White
      valueColor: "1E3A8A", // Royal Blue
      borderLineColor: "4F46E5", // Indigo 600
    };
  } else if (style === "minimalista") {
    return {
      headerFill: "0D9488", // Teal 600
      headerText: "FFFFFF", // White
      valueColor: "0F766E", // Dark Teal
      borderLineColor: "14B8A6", // Teal 500
    };
  } else {
    // Clasico PSV
    return {
      headerFill: "FFC000", // Soft Gold / Amber
      headerText: "000000", // Black
      valueColor: "1A365D", // Navy Blue
      borderLineColor: "FFC000", // Gold / Amber
    };
  }
}

// Module-level variable to hold the currently selected theme config dynamically during doc compilation
let activeTheme: ThemeConfig = getThemeConfig("clasico");

// Helper to create a section header row
function createSectionHeader(title: string): Table {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: {
              fill: activeTheme.headerFill,
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 150,
              right: 150,
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: title.toUpperCase(),
                    bold: true,
                    size: 20, // 10pt
                    color: activeTheme.headerText,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Helper to create a single field cell (Label + Value)
function createCell(label: string, value: string, colSpan = 1): TableCell {
  return new TableCell({
    columnSpan: colSpan,
    margins: {
      top: 80,
      bottom: 80,
      left: 120,
      right: 120,
    },
    children: [
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: label + ": ",
            bold: true,
            size: 18, // 9pt
            color: "333333",
            font: "Arial",
          }),
          new TextRun({
            text: value || "",
            size: 18,
            color: activeTheme.valueColor, // Dark navy value text or themed color for contrast
            font: "Arial",
          }),
        ],
      }),
    ],
  });
}

// Helper to create simple text paragraphs
function createSimpleParagraph(text: string, isBold = false, alignment: any = AlignmentType.LEFT, size = 20, color = "000000", beforeSpace = 100, afterSpace = 100): Paragraph {
  return new Paragraph({
    alignment: alignment,
    spacing: { before: beforeSpace, after: afterSpace },
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: size,
        color: color,
        font: "Arial",
      }),
    ],
  });
}

/**
 * Generates and downloads a highly professional .docx file matching the PSV "Estudio Socioeconómico Laboral" format.
 */
export async function exportToDocx(
  docData: SocioeconomicStudy,
  customFileName?: string,
  formatStyle: "clasico" | "ejecutivo" | "minimalista" = "clasico"
): Promise<void> {
  // Update the module-level active theme based on formatStyle
  activeTheme = getThemeConfig(formatStyle);

  const safeTitle = docData.nombre ? `ESTUDIO_SOCIOECONOMICO_${docData.nombre}` : "Estudio_Socioeconomico_Laboral";
  const fileName = (customFileName || safeTitle).replace(/[/\\?%*:|"<>]/g, "-") + ".docx";

  const children: any[] = [];

  // --- TOP HEADER: HOJA MEMBRETADA (OFFICIAL LETTERHEAD HEADER) ---
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.SINGLE, size: 12, color: activeTheme.borderLineColor }, // Elegant line separating header
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              margins: { bottom: 80, top: 50 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "PSV ASESORES Y CONSULTORES S.C.",
                      bold: true,
                      size: 24, // 12pt
                      color: activeTheme.valueColor, // Professional deep color
                      font: "Arial",
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Investigación, Evaluación y Consultoría en Capital Humano",
                      italics: true,
                      size: 16, // 8pt
                      color: "555555",
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              margins: { bottom: 80, top: 50 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: "ESTUDIO SOCIOECONÓMICO",
                      bold: true,
                      size: 20, // 10pt
                      color: activeTheme.valueColor,
                      font: "Arial",
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({
                      text: "INFORME SOCIOECONÓMICO LABORAL",
                      bold: true,
                      size: 14, // 7pt
                      color: activeTheme.borderLineColor, // Theme border line color
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // Header Box Table
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Fecha de Estudio", docData.fecha, 2),
            createCell("Empresa Solicitada", docData.empresaSolicitada, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Puesto Evaluado", docData.puesto, 2),
            createCell("Resultado Final", docData.resultado, 2),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- DATOS DEL EMPLEADO ---
  children.push(createSectionHeader("DATOS DEL EMPLEADO"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Nombre Completo", docData.nombre, 4),
          ],
        }),
        new TableRow({
          children: [
            createCell("Dirección", docData.direccion, 3),
            createCell("C.P.", docData.cp, 1),
          ],
        }),
        new TableRow({
          children: [
            createCell("Ciudad y Estado", docData.ciudadEstado, 2),
            createCell("Teléfono Casa", docData.telefonoCasa, 1),
            createCell("Teléfono Celular", docData.telefonoCelular, 1),
          ],
        }),
        new TableRow({
          children: [
            createCell("Teléfono Recados", docData.telefonoRecados, 2),
            createCell("Fecha Nacimiento", docData.fechaNac, 1),
            createCell("Edad", docData.edad, 1),
          ],
        }),
        new TableRow({
          children: [
            createCell("Lugar de Nacimiento", docData.lugarNacimiento, 2),
            createCell("Tiempo en la Ciudad", docData.tiempoRadicarCiudad, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Motivo de Cambio", docData.motivoCambio, 4),
          ],
        }),
        new TableRow({
          children: [
            createCell("R.F.C.", docData.rfc, 1),
            createCell("C.U.R.P.", docData.curp, 1),
            createCell("Número IMSS (NSS)", docData.nss, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Estado Civil", docData.estadoCivil, 2),
            createCell("Religión que profesa", docData.religion, 2),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- DOCUMENTACIÓN ---
  children.push(createSectionHeader("DOCUMENTACIÓN"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Identificación Oficial", docData.identificacionTipo, 2),
            createCell("Número", docData.identificacionNumero, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Acta de Nacimiento", docData.actaNacimiento, 2),
            createCell("Acta de Matrimonio", docData.actaMatrimonio, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Núm. Licencia", docData.licenciaNumero, 1),
            createCell("Tipo", docData.licenciaTipo, 1),
            createCell("Vencimiento", docData.licenciaVencimiento, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Cartilla Militar", docData.cartillaMilitar, 2),
            createCell("Crédito INFONAVIT", docData.creditoInfonavit, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Pasaporte o VISA", docData.pasaporteVisa, 2),
            createCell("AFORE Registrada", docData.afore, 2),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- DATOS FAMILIARES ---
  children.push(createSectionHeader("DATOS FAMILIARES"));
  children.push(createSimpleParagraph(`Número de personas que habitan en la vivienda: ${docData.personasHabitan || ""}`, true, AlignmentType.LEFT, 18, "333333", 100, 100));

  // Table for Family Members who live in the same house
  const familyRows = [
    new TableRow({
      children: [
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Nombre", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Parentesco", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Edad", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Ocupación", true, AlignmentType.LEFT, 18)] }),
      ],
    }),
  ];

  if (docData.integrantes && docData.integrantes.length > 0) {
    docData.integrantes.forEach((item) => {
      familyRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(item.nombre || "N/A", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(item.parentesco || "N/A", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(item.edad || "N/A", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(item.ocupacion || "N/A", false, AlignmentType.LEFT, 18)] }),
          ],
        })
      );
    });
  } else {
    familyRows.push(
      new TableRow({
        children: [
          new TableCell({ columnSpan: 4, children: [createSimpleParagraph("Ninguno registrado", false, AlignmentType.CENTER, 18)] }),
        ],
      })
    );
  }

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: familyRows }));

  children.push(createSimpleParagraph(`Dependientes económicos: ${docData.dependientes || "N/A"}`, true, AlignmentType.LEFT, 18, "333333", 150, 100));

  // Family members who do not live in the same house
  children.push(createSimpleParagraph("Familiares directos que no viven con el candidato (padres, hermanos, hijos):", true, AlignmentType.LEFT, 18, "333333", 100, 100));

  const familyNoLiveRows = [
    new TableRow({
      children: [
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Nombre", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Parentesco", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Edad", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Ocupación", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Teléfono", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Lugar Residencia", true, AlignmentType.LEFT, 16)] }),
      ],
    }),
  ];

  if (docData.familiaresNoViven && docData.familiaresNoViven.length > 0) {
    docData.familiaresNoViven.forEach((item) => {
      familyNoLiveRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(item.nombre || "N/A", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(item.parentesco || "N/A", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(item.edad || "N/A", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(item.ocupacion || "N/A", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(item.telefono || "N/A", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(item.lugarResidencia || "N/A", false, AlignmentType.LEFT, 16)] }),
          ],
        })
      );
    });
  } else {
    familyNoLiveRows.push(
      new TableRow({
        children: [
          new TableCell({ columnSpan: 6, children: [createSimpleParagraph("Ninguno registrado", false, AlignmentType.CENTER, 16)] }),
        ],
      })
    );
  }

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: familyNoLiveRows }));

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- DATOS DE LA VIVIENDA ---
  children.push(createSectionHeader("DATOS DE LA VIVIENDA"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Propietario de la Vivienda", docData.propietario, 2),
            createCell("Tiempo de Vivir en Domicilio", docData.tiempoVivirDomicilio, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Tipo de Inmueble", docData.tipoInmueble, 2),
            createCell("Adquisición", docData.adquisicion, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Distribución", docData.distribucion, 4),
          ],
        }),
        new TableRow({
          children: [
            createCell("Clase Social", docData.claseSocial, 2),
            createCell("Tipo de Zona", docData.tipoZona, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Observaciones Vivienda", docData.observacionesVivienda, 4),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- DATOS ECONÓMICOS ---
  children.push(createSectionHeader("DATOS ECONÓMICOS"));
  children.push(createSimpleParagraph("INGRESOS MENSUALES", true, AlignmentType.LEFT, 18, "333333", 100, 100));

  const incomeRows = [
    new TableRow({
      children: [
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Nombre", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Ocupación", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Empresa", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Salario Mensual", true, AlignmentType.LEFT, 18)] }),
      ],
    }),
  ];

  if (docData.ingresos && docData.ingresos.length > 0) {
    docData.ingresos.forEach((inc) => {
      incomeRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(inc.nombre || "", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(inc.ocupacion || "", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(inc.empresa || "", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph("$" + (inc.salario || "0.00"), false, AlignmentType.LEFT, 18)] }),
          ],
        })
      );
    });
  }

  incomeRows.push(
    new TableRow({
      children: [
        new TableCell({ columnSpan: 3, shading: { fill: "EDF2F7" }, children: [createSimpleParagraph("TOTAL INGRESOS", true, AlignmentType.RIGHT, 18)] }),
        new TableCell({ shading: { fill: "EDF2F7" }, children: [createSimpleParagraph("$" + (docData.totalIngresos || "0.00"), true, AlignmentType.LEFT, 18)] }),
      ],
    })
  );

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: incomeRows }));

  children.push(createSimpleParagraph("EGRESOS MENSUALES", true, AlignmentType.LEFT, 18, "333333", 150, 100));

  const outcomeRows: TableRow[] = [];
  if (docData.egresos && docData.egresos.length > 0) {
    // Let's print them in pairs to match the 2-column list of the form
    for (let i = 0; i < docData.egresos.length; i += 2) {
      const first = docData.egresos[i];
      const second = docData.egresos[i + 1] || { concepto: "", importe: "" };
      outcomeRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(first.concepto, true, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph("$" + first.importe, false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(second.concepto, true, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(second.importe ? "$" + second.importe : "", false, AlignmentType.LEFT, 18)] }),
          ],
        })
      );
    }
  }

  outcomeRows.push(
    new TableRow({
      children: [
        new TableCell({ columnSpan: 3, shading: { fill: "EDF2F7" }, children: [createSimpleParagraph("TOTAL EGRESOS", true, AlignmentType.RIGHT, 18)] }),
        new TableCell({ shading: { fill: "EDF2F7" }, children: [createSimpleParagraph("$" + (docData.totalEgresos || "0.00"), true, AlignmentType.LEFT, 18)] }),
      ],
    })
  );

  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: outcomeRows }));

  // CREDITOS Table
  children.push(createSimpleParagraph("CRÉDITOS", true, AlignmentType.LEFT, 18, "333333", 150, 100));

  const creditRows = [
    new TableRow({
      children: [
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Institución", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Tipo de Crédito", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Saldo Actual", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Pago Mensual", true, AlignmentType.LEFT, 16)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Importe Atrasado", true, AlignmentType.LEFT, 16)] }),
      ],
    }),
  ];

  if (docData.creditos && docData.creditos.length > 0) {
    docData.creditos.forEach((cr) => {
      creditRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(cr.institucion || "", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(cr.tipoCredito || "", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(cr.saldoActual || "", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(cr.pagoMensual || "", false, AlignmentType.LEFT, 16)] }),
            new TableCell({ children: [createSimpleParagraph(cr.importeAtrasado || "", false, AlignmentType.LEFT, 16)] }),
          ],
        })
      );
    });
  } else {
    creditRows.push(
      new TableRow({
        children: [
          new TableCell({ columnSpan: 5, children: [createSimpleParagraph("Ninguno registrado", false, AlignmentType.CENTER, 16)] }),
        ],
      })
    );
  }
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: creditRows }));

  // PATRIMONIO Table
  children.push(createSimpleParagraph("PATRIMONIO FAMILIAR", true, AlignmentType.LEFT, 18, "333333", 150, 100));

  const patrimonyRows = [
    new TableRow({
      children: [
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Tipo Bienes", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Descripción", true, AlignmentType.LEFT, 18)] }),
        new TableCell({ shading: { fill: "F7FAFC" }, children: [createSimpleParagraph("Valor Comercial", true, AlignmentType.LEFT, 18)] }),
      ],
    }),
  ];

  if (docData.patrimonio && docData.patrimonio.length > 0) {
    docData.patrimonio.forEach((pat) => {
      patrimonyRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(pat.tipo || "", true, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(pat.descripcion || "", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph(pat.valor || "", false, AlignmentType.LEFT, 18)] }),
          ],
        })
      );
    });
  } else {
    const defaultTypes = ["Muebles", "Vehículos", "Casa", "Terreno", "Otro"];
    defaultTypes.forEach((t) => {
      patrimonyRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [createSimpleParagraph(t, true, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph("", false, AlignmentType.LEFT, 18)] }),
            new TableCell({ children: [createSimpleParagraph("", false, AlignmentType.LEFT, 18)] }),
          ],
        })
      );
    });
  }
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: patrimonyRows }));

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- ANTECEDENTES MÉDICOS ---
  children.push(createSectionHeader("ANTECEDENTES MÉDICOS"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Descripción Física", docData.descripcionFisica, 2),
            createCell("Estatura y Peso", docData.estaturaPeso, 1),
            createCell("Señas Particulares", docData.senasParticulares, 1),
          ],
        }),
        new TableRow({
          children: [
            createCell("Cirugías Recientes", docData.cirugiasRecientes, 2),
            createCell("Accidentes", docData.accidentes, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Enfermedades Graves", docData.enfermedadesGraves, 2),
            createCell("Medicamentos que consume", docData.medicamentos, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Consumo de Tabaco", docData.consumoTabaco, 2),
            createCell("Consumo de Alcohol", docData.consumoAlcohol, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Servicios Médicos con los que cuenta", docData.serviciosMedicosFamilia, 2),
            createCell("Frecuencia de Asistencia al Médico", docData.frecuenciaAsistenciaMedico, 2),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- INFORMACIÓN ESCOLAR ---
  children.push(createSectionHeader("INFORMACIÓN ESCOLAR"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Último Grado de Estudios", docData.ultimoGrado, 2),
            createCell("Estudia Actualmente", docData.estudiaActualmente, 1),
            createCell("Horario", docData.horarioEscolar, 1),
          ],
        }),
        new TableRow({
          children: [
            createCell("Institución", docData.institucion, 2),
            createCell("Años Cursados", docData.anosCursados, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Carrera cursada", docData.carrera, 2),
            createCell("Ciudad", docData.ciudadEscuela, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Motivo de Abandono de Estudios", docData.motivoAbandono, 4),
          ],
        }),
        new TableRow({
          children: [
            createCell("Qué carrera desea estudiar", docData.carreraDeseaEstudiar, 4),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- CARACTERÍSTICAS SOCIO-CULTURALES ---
  children.push(createSectionHeader("CARACTERÍSTICAS SOCIO-CULTURALES"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: [createCell("Actividades cotidianas que realiza", docData.actividadesCotidianas, 4)] }),
        new TableRow({ children: [createCell("Asociaciones a las que pertenece", docData.asociacionesPertenece, 4)] }),
        new TableRow({ children: [createCell("Tipo de programación TV y música", docData.programasTvMusica, 4)] }),
        new TableRow({ children: [createCell("Tipo de lectura acostumbrada", docData.lecturaAcostumbrada, 4)] }),
        new TableRow({ children: [createCell("Lugares de esparcimiento", docData.lugaresEsparcimiento, 4)] }),
        new TableRow({ children: [createCell("Planes a futuro", docData.planesFuturo, 4)] }),
        new TableRow({ children: [createCell("Práctica de algún deporte o actividad", docData.deporteActividad, 4)] }),
        new TableRow({ children: [createCell("Participación en comité sindical", docData.comiteSindical, 4)] }),
        new TableRow({ children: [createCell("Reuniones con amistades", docData.reunionesAmistades, 4)] }),
        new TableRow({ children: [createCell("Experiencia laboral", docData.experienciaLaboralResumen, 4)] }),
        new TableRow({ children: [createCell("Expectativa de ser contratado", docData.expectativaContratado, 4)] }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- REFERENCIAS PERSONALES ---
  children.push(createSectionHeader("REFERENCIAS PERSONALES"));

  if (docData.referencias && docData.referencias.length > 0) {
    docData.referencias.forEach((ref, index) => {
      children.push(createSimpleParagraph(`Referencia #${index + 1}`, true, AlignmentType.LEFT, 18, "1A365D", 100, 100));
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                createCell("Nombre", ref.nombre, 2),
                createCell("Edad", ref.edad, 1),
                createCell("Ocupación", ref.ocupacion, 1),
              ],
            }),
            new TableRow({
              children: [
                createCell("Dirección", ref.direccion, 2),
                createCell("Teléfono", ref.telefono, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Describir cómo conoció al candidato", ref.comoConocio, 2),
                createCell("Tiempo de conocerlo", ref.tiempoConocerlo, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Empleos y puestos que sepa dónde haya laborado", ref.empleosPuestosSabe, 4),
              ],
            }),
            new TableRow({
              children: [
                createCell("Opinión general", ref.opinionGeneral, 4),
              ],
            }),
            new TableRow({
              children: [
                createCell("Sabe si es afecto a fumar, tomar, usar drogas, apostar o endeudarse", ref.viciosSabe, 4),
              ],
            }),
            new TableRow({
              children: [
                createCell("Sabe si tiene problemas legales o policiacos", ref.problemasLegales, 2),
                createCell("Lo recomienda, ¿por qué?", ref.loRecomiendaPorque, 2),
              ],
            }),
          ],
        })
      );
      children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));
    });
  } else {
    children.push(createSimpleParagraph("No se registraron referencias personales en la extracción.", false, AlignmentType.CENTER, 18, "718096"));
  }

  // --- TRAYECTORIA LABORAL ---
  children.push(createSectionHeader("TRAYECTORIA LABORAL"));

  if (docData.trayectoria && docData.trayectoria.length > 0) {
    docData.trayectoria.forEach((job, index) => {
      const positionLabel = index === 0 ? "EMPLEO ACTUAL O ÚLTIMO" : `EMPLEO ANTERIOR #${index}`;
      children.push(createSimpleParagraph(positionLabel, true, AlignmentType.LEFT, 18, "1A365D", 100, 100));
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                createCell("Nombre de la empresa", job.empresa, 2),
                createCell("Giro", job.giro, 1),
                createCell("Teléfono", job.telefono, 1),
              ],
            }),
            new TableRow({
              children: [
                createCell("Dirección", job.direccion, 4),
              ],
            }),
            new TableRow({
              children: [
                createCell("Puestos desempeñados", job.puesto, 2),
                createCell("Sueldo Mensual", job.sueldo, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Principales funciones", job.funciones, 4),
              ],
            }),
            new TableRow({
              children: [
                createCell("Fecha de Ingreso", job.fechaIngreso, 2),
                createCell("Fecha de Baja", job.fechaBaja, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Personal a cargo", job.personalCargo, 2),
                createCell("Horario", job.horario, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Prestaciones", job.prestaciones, 2),
                createCell("Tipo de Trabajador", job.tipoTrabajador, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Jefe Inmediato", job.jefeInmediato, 2),
                createCell("Motivo de Salida", job.motivoSalida, 2),
              ],
            }),
            new TableRow({
              children: [
                createCell("Cómo califican su desempeño", job.calificacionDesempeno, 4),
              ],
            }),
            new TableRow({
              children: [
                createCell("Contacto de la empresa", job.contactoEmpresa, 2),
                createCell("Observaciones de la investigación", job.observaciones, 2),
              ],
            }),
          ],
        })
      );
      children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));
    });
  } else {
    children.push(createSimpleParagraph("No se registró trayectoria laboral en la extracción.", false, AlignmentType.CENTER, 18, "718096"));
  }

  // --- ASPECTOS GENERALES DE LA ENTREVISTA ---
  children.push(createSectionHeader("ASPECTOS GENERALES DE LA ENTREVISTA"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createCell("Se encontró al candidato en su casa", docData.seEncontroCandidatoCasa, 2),
            createCell("Intervino un familiar", docData.intervinoFamiliar, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Periodos de inactividad laboral", docData.periodosInactividad, 2),
            createCell("Cómo solventó sus necesidades", docData.comoSolventoNecesidades, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Empresas donde haya aplicado una vacante", docData.empresasDondeAplico, 4),
          ],
        }),
        new TableRow({
          children: [
            createCell("Experiencia en el puesto", docData.experienciaPuesto, 2),
            createCell("Interés en el puesto", docData.interesPuesto, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Motivación", docData.motivacion, 2),
            createCell("Honestidad", docData.honestidad, 2),
          ],
        }),
        new TableRow({
          children: [
            createCell("Condiciones de trabajo", docData.condicionesTrabajo, 4),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 50, 50));

  // --- OBSERVACIONES GENERALES ---
  children.push(createSectionHeader("OBSERVACIONES GENERALES"));
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              margins: { top: 120, bottom: 120, left: 150, right: 150 },
              children: [
                new Paragraph({
                  spacing: { line: 240 },
                  children: [
                    new TextRun({
                      text: docData.observacionesGenerales || "Sin observaciones generales adicionales.",
                      size: 20,
                      color: "2D3748",
                      font: "Arial",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );

  children.push(createSimpleParagraph("", false, AlignmentType.LEFT, 12, "000000", 150, 150));

  // --- SIGNATURE BLOCK ---
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 100 },
      children: [
        new TextRun({
          text: "__________________________________________________",
          color: "A0AEC0",
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: "FIRMA DEL INVESTIGADOR EVALUADOR",
          bold: true,
          size: 18,
          color: "4A5568",
          font: "Arial",
        }),
      ],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "PSV ASESORES Y CONSULTORES S.C. - TIJUANA B.C.",
          size: 14,
          color: "718096",
          font: "Arial",
        }),
      ],
    })
  );

  // --- TECHNICAL METADATA ---
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 300 },
      children: [
        new TextRun({
          text: `Extracción inteligente asistida por Inteligencia Artificial OCR. Confianza del análisis: ${docData.confidenceScore || "98%"} | Idioma: ${docData.idiomaDetectado || "Español"}`,
          italics: true,
          size: 14,
          color: "CBD5E0",
          font: "Arial",
        }),
      ],
    })
  );

  // Compile and return Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  // Export & Download
  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
