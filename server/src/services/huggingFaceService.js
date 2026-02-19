import { env } from '../config/env.js';
import { buildPromptFromMessages } from '../utils/prompt.js';

function extractTextFromHF(payload) {
  if (Array.isArray(payload)) {
    const [first] = payload;

    if (typeof first?.generated_text === 'string') {
      return first.generated_text;
    }

    if (typeof first?.summary_text === 'string') {
      return first.summary_text;
    }

    if (typeof first?.translation_text === 'string') {
      return first.translation_text;
    }

    if (Array.isArray(first) && typeof first[0]?.generated_text === 'string') {
      return first[0].generated_text;
    }
  }

  if (typeof payload?.generated_text === 'string') {
    return payload.generated_text;
  }

  if (typeof payload?.summary_text === 'string') {
    return payload.summary_text;
  }

  if (Array.isArray(payload?.choices) && typeof payload.choices[0]?.text === 'string') {
    return payload.choices[0].text;
  }

  return '';
}

export async function requestHuggingFaceChat({ modelId, messages }) {
  if (!env.huggingFaceApiKey) {
    return {
      ok: false,
      status: 500,
      error: 'setup_error',
      message: 'Server is missing HUGGINGFACE_API_KEY.',
    };
  }

  const prompt = buildPromptFromMessages(messages);
  const endpoint = `https://api-inference.huggingface.co/models/${encodeURIComponent(modelId)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.huggingFaceApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 512,
        temperature: 0.7,
        return_full_text: false,
      },
      options: {
        wait_for_model: true,
        use_cache: false,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: 'provider_error',
      message: payload?.error || 'Hugging Face request failed.',
      raw: payload,
    };
  }

  const text = extractTextFromHF(payload).trim();

  if (!text) {
    return {
      ok: false,
      status: 502,
      error: 'no_response',
      message: 'Model returned no usable text.',
      raw: payload,
    };
  }

  return {
    ok: true,
    status: 200,
    text,
    raw: payload,
  };
}
