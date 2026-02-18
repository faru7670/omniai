import { env } from './env.js';

export const modelRegistry = [
  {
    id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    name: 'DeepSeek R1 Distill',
    provider: 'huggingface',
    status: 'online',
    capabilities: ['text', 'reasoning', 'code'],
  },
  {
    id: 'meta-llama/Llama-3.1-8B-Instruct',
    name: 'LLaMA 3.1 8B Instruct',
    provider: 'huggingface',
    status: 'online',
    capabilities: ['text', 'reasoning'],
  },
  {
    id: 'mistralai/Mistral-7B-Instruct-v0.3',
    name: 'Mistral 7B Instruct',
    provider: 'huggingface',
    status: 'online',
    capabilities: ['text', 'fast'],
  },
  {
    id: 'tiiuae/falcon-7b-instruct',
    name: 'Falcon 7B Instruct',
    provider: 'huggingface',
    status: 'online',
    capabilities: ['text', 'docs'],
  },
  {
    id: env.defaultModel,
    name: 'Custom HF Default',
    provider: 'huggingface',
    status: 'online',
    capabilities: ['text'],
  },
];

export function resolveModel(modelId) {
  if (!modelId) {
    return modelRegistry[0];
  }

  return modelRegistry.find((model) => model.id === modelId) || modelRegistry[0];
}
