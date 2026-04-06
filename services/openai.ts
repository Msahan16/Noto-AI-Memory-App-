import { Platform } from 'react-native';

interface AiMetadata {
  summary: string;
  tags: string[];
  category: 'Work' | 'Personal' | 'Ideas' | 'Learning' | 'Other';
}

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

const ensureApiKey = () => {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY in .env file.');
  }
};

export const createEmbedding = async (text: string): Promise<number[]> => {
  ensureApiKey();

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Embedding failed: ${errorBody}`);
  }

  const json = await response.json();
  return json.data?.[0]?.embedding ?? [];
};

export const summarizeAndTagNote = async (text: string): Promise<AiMetadata> => {
  ensureApiKey();

  const prompt = `Analyze this note. Return strict JSON only with shape {"summary":"...","tags":["..."],"category":"Work|Personal|Ideas|Learning|Other"}. Keep summary under 40 words. Note: ${text}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You classify and summarize notes.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Summarization failed: ${errorBody}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content ?? '{}');

  return {
    summary: parsed.summary ?? 'No summary available.',
    tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [],
    category: parsed.category ?? 'Other',
  };
};

export const transcribeAudio = async (audioUri: string): Promise<string> => {
  ensureApiKey();

  const formData = new FormData();

  if (Platform.OS === 'web') {
    const audioBlob = await fetch(audioUri).then((res) => res.blob());
    formData.append('file', new File([audioBlob], 'voice.webm', { type: audioBlob.type || 'audio/webm' }));
  } else {
    formData.append('file', {
      uri: audioUri,
      name: 'voice.m4a',
      type: 'audio/m4a',
    } as unknown as Blob);
  }

  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Transcription failed: ${errorBody}`);
  }

  const json = await response.json();
  return json.text ?? '';
};
