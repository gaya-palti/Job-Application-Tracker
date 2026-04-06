import { GoogleGenAI, Type } from "@google/genai";
import { Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface ExtractedJobData {
  company: string;
  title: string;
  location: string;
  salary?: string;
  requirements: string[];
  description: string;
}

export async function extractJobFromUrl(url: string): Promise<ExtractedJobData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract job details from this URL: ${url}. 
    Provide the company name, job title, location, salary range (if available), 
    key requirements (summarized into 3-5 short bullet points), and the full job description.`,
    config: {
      tools: [{ urlContext: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          title: { type: Type.STRING },
          location: { type: Type.STRING },
          salary: { type: Type.STRING },
          requirements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 key requirements summarized"
          },
          description: { type: Type.STRING }
        },
        required: ["company", "title", "location", "requirements", "description"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to extract job data from the provided URL.");
  }

  try {
    return JSON.parse(response.text) as ExtractedJobData;
  } catch (e) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Invalid data format received from extraction service.");
  }
}
