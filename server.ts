import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locally, load GEMINI_API_KEY from .env.local. On AI Studio / Cloud Run it comes from the environment.
try {
  process.loadEnvFile('.env.local');
} catch {
  // No .env.local (e.g. in production) — rely on the real environment.
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side initialization of GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    company: { type: Type.STRING },
    title: { type: Type.STRING },
    location: { type: Type.STRING },
    salary: { type: Type.STRING, description: 'Salary range if stated, otherwise empty string' },
    requirements: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-6 key requirements, each a short phrase',
    },
    description: { type: Type.STRING, description: 'A concise 2-4 sentence summary of the role' },
  },
  required: ['company', 'title', 'location', 'requirements', 'description'],
};

const INSTRUCTIONS = `Extract the job posting details.
Return the company name, job title, location (city/country and whether remote/hybrid),
salary range only if explicitly stated (otherwise an empty string),
3-6 key requirements as short phrases, and a concise 2-4 sentence summary of the role.
Keep the language of the original posting. Do not invent details that are not in the posting.`;

const JSON_SHAPE = `Respond with only a JSON object with exactly these keys:
{"company": string, "title": string, "location": string, "salary": string, "requirements": string[], "description": string}`;

const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

async function generateContentWithFallback(params: {
  contents: string;
  config?: any;
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please attach an API key in Settings > Secrets.');
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`[AI] Attempting extraction with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        ...params,
      });
      console.log(`[AI] Successfully extracted with model: ${model}`);
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = String(err?.message || err || '');
      console.warn(`[AI] Model ${model} failed (${errMsg.slice(0, 160)}). Trying fallback...`);
    }
  }

  throw lastError;
}

app.post('/api/extract-job', async (req, res) => {
  const { mode, input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    if (mode === 'url') {
      const response = await generateContentWithFallback({
        contents: `${INSTRUCTIONS}\n${JSON_SHAPE}\n\nJob posting URL: ${input}`,
        config: {
          tools: [{ urlContext: {} }],
        },
      });

      const urlMetadata = response.candidates?.[0]?.urlContextMetadata?.urlMetadata;
      const fetched = urlMetadata?.some((m: any) => String(m.urlRetrievalStatus) === 'URL_RETRIEVAL_STATUS_SUCCESS');
      if (urlMetadata && !fetched) {
        return res.status(422).json({
          error: "Couldn't read this page (some sites, like LinkedIn, block it). Paste the job text instead.",
        });
      }

      const text = response.text;
      if (!text) {
        return res.status(422).json({ error: 'No data was returned from the page.' });
      }

      const json = text.match(/\{[\s\S]*\}/)?.[0] ?? text;
      let data: any;
      try {
        data = JSON.parse(json);
      } catch {
        return res.status(422).json({
          error: 'Could not extract clean structured data from the URL. Please try pasting the job text instead.',
        });
      }

      return res.json({
        company: data.company || '',
        title: data.title || '',
        location: data.location || '',
        salary: data.salary || '',
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        description: data.description || '',
      });
    } else {
      const response = await generateContentWithFallback({
        contents: `${INSTRUCTIONS}\n\nJob posting:\n"""\n${input}\n"""`,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(422).json({ error: 'No data was returned. Try again with more details.' });
      }

      const json = text.match(/\{[\s\S]*\}/)?.[0] ?? text;
      let data: any;
      try {
        data = JSON.parse(json);
      } catch {
        return res.status(422).json({
          error: 'Could not parse structured job data. Please try again with more details.',
        });
      }

      return res.json({
        company: data.company || '',
        title: data.title || '',
        location: data.location || '',
        salary: data.salary || '',
        requirements: Array.isArray(data.requirements) ? data.requirements : [],
        description: data.description || '',
      });
    }
  } catch (error: any) {
    console.error('Server extraction error:', error);
    let message = error?.message || 'Failed to extract job details';

    if (
      message.includes('API_KEY_INVALID') ||
      message.includes('API key not valid') ||
      message.includes('403') ||
      message.includes('Forbidden')
    ) {
      message = 'The attached Gemini API key is invalid or unauthorized. Please verify your API key in project settings.';
    } else if (
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('429') ||
      message.includes('quota')
    ) {
      message = 'Gemini API quota or rate limit exceeded. Please wait a moment and try again.';
    } else if (
      message.includes('503') ||
      message.includes('overloaded') ||
      message.includes('busy') ||
      message.includes('high demand') ||
      message.includes('UNAVAILABLE')
    ) {
      message = 'Gemini models are experiencing high demand right now. Please try again shortly.';
    }

    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use((_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
