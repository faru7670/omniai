export const initialChats = [
  {
    id: 'chat-1',
    name: 'OmniAI Welcome',
    updatedAt: 'Today, 10:12',
    messages: [
      {
        id: 'm1',
        role: 'assistant',
        content:
          'Welcome to OmniAI. I can help with code, docs, image understanding, and PDF Q&A. Pick a model and ask anything.',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          '```js\n// Tip: Shift + Enter for multiline\nconst hello = "OmniAI is ready";\nconsole.log(hello);\n```',
      },
    ],
  },
  {
    id: 'chat-2',
    name: 'API Security Checklist',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'How do I keep API keys safe in a React + Node app?',
      },
      {
        id: 'm4',
        role: 'assistant',
        content:
          'Keep keys only in backend `.env`, expose only a proxy endpoint, and apply rate limiting + request validation.',
      },
    ],
  },
];
