import { GoogleGenAI, Type } from '@google/genai';

// On the AI Studio deployment this key is a placeholder: the AI Studio service
// worker reroutes Gemini calls to a server-side proxy that injects the real key.
// Locally it comes from GEMINI_API_KEY in .env.local.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const MODEL = 'gemini-flash-latest';

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

export async function extractJobFromUrl(url: string): Promise<ExtractedJobData> {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${INSTRUCTIONS}\n\nJob posting URL: ${url}`,
    config: {
      tools: [{ urlContext: {} }],
      responseMimeType: 'application/json',
      responseSchema,
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
  const response = await ai.models.generateContent({
    model: MODEL,
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
    const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, '');
    const data = JSON.parse(cleaned) as ExtractedJobData;
    if (!data.title || !data.company) {
      throw new Error('missing fields');
    }
    return data;
  } catch {
    console.error('Failed to parse Gemini response:', text);
    throw new Error("Couldn't find job details. Try pasting the job text instead.");
  }
}
