# OmniAI — Multi-Model AI Assistant

A modern ChatGPT-style assistant UI with dark glassmorphism design, model switching, rich chat interactions, and a backend-ready architecture for secure multi-model AI integration.

## 1) Full Architecture (Target)

OmniAI is split into two secure layers:

- **Frontend (React + Vite + Tailwind)**
  - Renders chat workspace, model selector, multimodal controls, code blocks, and history UI.
  - Handles local interaction logic: Enter/Shift+Enter behavior, loading states, and error display.
  - Never stores or calls private model keys directly.

- **Backend (Node.js ESM + Express)**
  - Handles auth/session lifecycle and API proxying to model providers.
  - Enforces rate limits, validation, and model capability checks.
  - Streams model responses to frontend when provider supports chunked output.
  - Persists per-user chats/messages and uploaded assets metadata.

## 2) Final Folder Structure (Planned)

```txt
omniai/
├─ client/ (current root in this phase)
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ ChatComposer.jsx
│  │  │  ├─ CodeBlock.jsx
│  │  │  ├─ MessageBubble.jsx
│  │  │  ├─ ModelSelector.jsx
│  │  │  └─ Sidebar.jsx
│  │  ├─ data/
│  │  │  ├─ mockChats.js
│  │  │  └─ models.js
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  └─ ...vite config files
├─ server/ (next phase)
│  ├─ src/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ middleware/
│  │  ├─ auth/
│  │  └─ storage/
│  ├─ .env.example
│  └─ package.json
└─ README.md
```

## 3) What Is Implemented in This Phase (UI Foundation)

- Dark, modern layout with **glassmorphism cards**, subtle blur/shadow, rounded chat bubbles.
- Gradient primary action (blue → purple).
- Chat input fixed at bottom with required keyboard behavior:
  - **Enter** sends.
  - **Shift + Enter** creates new line.
- Message feed above input.
- Model selector with online/offline status text.
- Multimodal action controls: image, PDF, audio, clear.
- Styled code blocks with **Copy** button.
- Loading animation while assistant responds.
- Error states for API, no response, and rate limit.
- Conversation list sidebar with quick chat switching/new chat.

## 4) Development Flow (Step-by-Step)

1. ✅ **Project initialization and UI architecture** (done now).
2. ⏭️ **Backend initialization (Express ESM)** with secure `.env` + proxy endpoints.
3. ⏭️ **Authentication** (Google OAuth + email verification pattern + logout + secure sessions).
4. ⏭️ **Persistent chat history** (user isolation, rename/delete, timestamps).
5. ⏭️ **Real streaming AI integration** (DeepSeek/LLaMA/Mistral/Falcon/HF where available).
6. ⏭️ **File/audio pipelines** (PDF extraction, speech-to-text, image analysis dispatch).
7. ⏭️ **Testing + deployment** (local checks, Vercel/Render setup).

## 5) Security Rules

- Keep all provider keys in backend environment variables only.
- Frontend must only call your own backend routes.
- Apply per-user and per-IP rate limits.
- Validate model and payload types server-side.
- Add `.env*` to `.gitignore` and provide `.env.example` for setup.

---

If this phase looks good, continue to **Phase 2: backend Express setup + secure API proxy**.
