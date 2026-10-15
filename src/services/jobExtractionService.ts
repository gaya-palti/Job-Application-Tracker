export interface ExtractedJobData {
  company: string;
  title: string;
  location: string;
  salary?: string;
  requirements: string[];
  description: string;
}

export async function extractJobFromUrl(url: string): Promise<ExtractedJobData> {
  const response = await fetch('/api/extract-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode: 'url', input: url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to extract job from URL');
  }

  return response.json();
}

export async function extractJobFromText(text: string): Promise<ExtractedJobData> {
  const response = await fetch('/api/extract-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode: 'text', input: text }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to extract job from text');
  }

  return response.json();
}
