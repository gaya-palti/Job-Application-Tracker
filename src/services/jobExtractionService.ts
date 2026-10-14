import { GoogleGenAI, Type, GenerateContentParameters } from '@google/genai';

// On the AI Studio deployment this key is a placeholder: the AI Studio service
// worker reroutes Gemini calls to a server-side proxy that injects the real key.
// Locally it comes from GEMINI_API_KEY in .env.local.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Fall back to the lighter model when the main one is overloaded (503) or rate-limited (429).
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];

export interface ExtractedJobData {
  company: string;
  title: string;
  location: string;
  salary?: string;
  requirements: string[];
  description: string;
}

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

// Structured output is unreliable together with the URL context tool (it can come back empty),
// so for links the JSON shape is spelled out in the prompt instead.
const JSON_SHAPE = `Respond with only a JSON object with exactly these keys:
{"company": string, "title": string, "location": string, "salary": string, "requirements": string[], "description": string}`;

async function generate(params: Omit<GenerateContentParameters, 'model'>) {
  let lastError: any;
  for (const model of MODELS) {
    try {
      return await ai.models.generateContent({ ...params, model });
    } catch (e: any) {
      lastError = e;
      if (e?.status !== 503 && e?.status !== 429) break;
    }
  }
  if (lastError?.status === 503 || lastError?.status === 429) {
    throw new Error('Gemini is busy right now. Try again in a minute.');
  }
  throw lastError;
}

export async function extractJobFromUrl(url: string): Promise<ExtractedJobData> {
  const response = await generate({
    contents: `${INSTRUCTIONS}\n${JSON_SHAPE}\n\nJob posting URL: ${url}`,
    config: {
      tools: [{ urlContext: {} }],
    },
  });

  // If Gemini could not read the page (e.g. LinkedIn blocks it), don't trust the output.
  const urlMetadata = response.candidates?.[0]?.urlContextMetadata?.urlMetadata;
  const fetched = urlMetadata?.some(m => String(m.urlRetrievalStatus) === 'URL_RETRIEVAL_STATUS_SUCCESS');
  if (urlMetadata && !fetched) {
    throw new Error("Couldn't read this page (some sites, like LinkedIn, block it). Paste the job text instead.");
  }

  return parseResponse(response.text);
}

export async function extractJobFromText(text: string): Promise<ExtractedJobData> {
  const response = await generate({
    contents: `${INSTRUCTIONS}\n\nJob posting:\n"""\n${text}\n"""`,
    config: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  return parseResponse(response.text);
}

function parseResponse(text: string | undefined): ExtractedJobData {
  if (!text) {
    throw new Error('No data was returned. Try again or paste the job text instead.');
  }
  try {
    const json = text.match(/\{[\s\S]*\}/)?.[0] ?? text;
    const data = JSON.parse(json) as ExtractedJobData;
    if (!data.title || !data.company) {
      throw new Error('missing fields');
    }
    return { ...data, salary: data.salary || '', requirements: data.requirements || [] };
  } catch {
    console.error('Failed to parse Gemini response:', text);
    throw new Error("Couldn't find job details. Try pasting the job text instead.");
  }
}
