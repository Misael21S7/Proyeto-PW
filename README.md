# PSV Transcriptor de Estudios Socioeconómicos

Aplicación web local que analiza imágenes de formatos de **Estudio Socioeconómico Laboral**, transcribe su contenido con OCR asistido por IA, permite editar los campos en pantalla y exporta el resultado a Word (.docx).

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior
- [Visual Studio Code](https://code.visualstudio.com/)
- Una clave de API de Gemini, solo necesaria para la función de transcripción con IA

## Ejecutar en Visual Studio Code

1. Abre la carpeta del proyecto en VS Code (**Archivo > Abrir carpeta**).
2. Abre la terminal integrada (**Ctrl + ñ** o **Terminal > Nueva terminal**).
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Crea el archivo de entorno a partir del ejemplo y agrega tu clave:

   ```bash
   cp .env.example .env
   ```

   En Windows (PowerShell): `Copy-Item .env.example .env`

   Después abre `.env` y escribe tu clave en `GEMINI_API_KEY`.

5. Inicia la aplicación:

   ```bash
   npm run dev
   ```

6. Abre <http://localhost:3000> en el navegador.

También puedes presionar **F5** en VS Code y elegir **Iniciar aplicación (dev)**, o usar **Terminal > Ejecutar tarea > Iniciar aplicación**.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm start` | Ejecuta la versión de producción (requiere `npm run build`) |
| `npm run lint` | Revisa los tipos de TypeScript |

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | Para usar la IA | Clave de la API de Gemini |
| `PORT` | No | Puerto del servidor (por defecto 3000) |
| `GEMINI_MODELS` | No | Modelos separados por coma; el primero es el principal y los demás son respaldo |

## Notas

- El proyecto funciona sin conexión a servicios de terceros, salvo la llamada a la API de Gemini al transcribir imágenes. Sin clave, el resto de la aplicación (edición, archivos guardados y exportación a Word) sigue funcionando con los datos de demostración.
- Los datos (usuario, archivos, permisos y bitácora) se guardan en el `localStorage` del navegador. Borrar los datos del sitio los elimina.
- Nunca subas tu archivo `.env` a un repositorio público.
