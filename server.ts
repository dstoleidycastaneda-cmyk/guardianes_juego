import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health & AI status check (never leaks secrets)
  app.get('/api/health', (_req, res) => {
    const aiConfigured = Boolean(getGeminiClient());
    res.json({
      ok: true,
      aiConnected: aiConfigured,
      mode: isProduction ? 'production' : 'development',
    });
  });

  // Educational AI Feedback Endpoint for Mission Simulator
  app.post('/api/simulator/feedback', async (req, res) => {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        connected: false,
        error: 'Servicio de IA no conectado en este entorno. Usando retroalimentación pedagógica predeterminada.',
      });
    }

    const {
      missionTitle,
      missionContext,
      optionLabel,
      optionOutcome,
      isBestChoice,
      profile,
      iotSnapshot,
    } = req.body ?? {};

    if (!missionTitle || !optionLabel) {
      return res.status(400).json({
        connected: true,
        error: 'Faltan datos de la misión para generar retroalimentación.',
      });
    }

    try {
      const prompt = [
        `Eres Guardi, un robot educativo amigable de la Red TIC de Cali, Colombia, que enseña movilidad escolar segura, respeto por los peatones, uso de la bicicleta y trabajo en equipo.`,
        `Perfil del usuario actual: ${profile || 'Estudiante'}.`,
        `Misión: ${missionTitle}`,
        `Situación observada: ${missionContext || ''}`,
        `Decisión elegida por el usuario: "${optionLabel}"`,
        `¿Es la opción más responsable?: ${isBestChoice ? 'Sí' : 'No, tiene oportunidades de mejora'}`,
        `Consecuencia simulada: ${optionOutcome || ''}`,
        iotSnapshot
          ? `Datos simulados actuales del entorno escolar: flujo vehicular ${iotSnapshot.vehicleFlow} veh/min, peatones ${iotSnapshot.pedestrianFlow} est/min, ocupación indebida ${iotSnapshot.undueOccupation}, ciclistas ${iotSnapshot.cyclists}, guardianes ${iotSnapshot.activeGuardians}.`
          : '',
        `Responde en español claro, cercano, positivo y adaptado a niños, adolescentes y comunidad educativa de Cali (sin tecnicismos excesivos, sin avergonzar si hubo error, y recordando que los estudiantes nunca deben dirigir el tráfico vehicular en la calzada).`,
      ]
        .filter(Boolean)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Responde únicamente en JSON válido siguiendo el esquema solicitado. Mantén un tono cálido, alentador y pedagógico.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              guardiMessage: {
                type: Type.STRING,
                description:
                  'Mensaje breve y motivador de Guardi (1 a 2 oraciones) celebrando el acierto o invitando a intentarlo de nuevo con cariño.',
              },
              pedagogicalExplanation: {
                type: Type.STRING,
                description:
                  'Explicación educativa sencilla (2 a 3 oraciones) sobre por qué esa decisión impacta la seguridad peatonal y la movilidad escolar.',
              },
              schoolActionTip: {
                type: Type.STRING,
                description:
                  'Un consejo concreto y seguro de cómo aplicar este aprendizaje en un colegio de Cali.',
              },
            },
            required: ['guardiMessage', 'pedagogicalExplanation', 'schoolActionTip'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);

      return res.json({
        connected: true,
        source: 'gemini-ai',
        feedback: parsed,
      });
    } catch (error) {
      console.error('Gemini API error in /api/simulator/feedback:', error);
      return res.status(502).json({
        connected: false,
        error: 'No fue posible consultar el servicio de IA en este momento. Se muestra la guía pedagógica predeterminada.',
      });
    }
  });

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guardianes Movilidad Escolar running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
