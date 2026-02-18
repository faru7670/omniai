# OmniAI — Multi-Model AI Assistant

A modern ChatGPT-style assistant with a React/Tailwind client and a secure Express backend proxy for open/free model inference.

## 1) Architecture (Phase 1 + Phase 2)

### Frontend (`/` current app)
- React + Vite + Tailwind UI
- Chat workspace + model selector + multimodal action controls
- Styled code blocks + copy button
- Loading and error states

### Backend (`/server`)
- Node.js (ESM) + Express
- CORS + Helmet + JSON validation
- Rate limiting (`express-rate-limit`)
- Provider proxy route for Hugging Face inference
- Model registry route for dynamic model list

## 2) Folder Structure

```txt
omniai/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ App.jsx
│  └─ index.css
├─ server/
│  ├─ src/
│  │  ├─ config/
│  │  │  ├─ env.js
│  │  │  └─ models.js
│  │  ├─ middleware/
│  │  │  ├─ rateLimit.js
│  │  │  └─ validateChatRequest.js
│  │  ├─ routes/
│  │  │  ├─ chat.js
│  │  │  └─ models.js
│  │  ├─ services/
│  │  │  └─ huggingFaceService.js
│  │  ├─ utils/
│  │  │  └─ prompt.js
│  │  └─ index.js
│  ├─ .env.example
│  └─ package.json
├─ eslint.config.js
└─ README.md
```

## 3) Phase 2 Implemented (Backend Express + Secure Proxy)

- Added standalone Express server in `/server`.
- Added secure env loading and defaults via `dotenv`.
- Added `/health` endpoint.
- Added `/api/models` endpoint for model metadata and capability badges.
- Added `/api/chat` endpoint that proxies requests to Hugging Face inference API.
- Added request validation middleware for safer payload handling.
- Added global API rate limiting and user-friendly rate-limit response.
- Added optional simulated SSE token streaming (`stream: true`).

## 4) Environment Setup

1. Copy env template:

```bash
cp server/.env.example server/.env
```

2. Open `server/.env` and set your real key:

```env
HUGGINGFACE_API_KEY=hf_your_real_key_here
```

> Never put provider keys in frontend code.

## 5) How To Run Locally

### Frontend

```bash
npm install
npm run dev
```

Frontend usually runs at: `http://localhost:5173`

### Backend

```bash
cd server
npm install
npm run dev
```

Backend runs at: `http://localhost:8080`

## 6) API Quick Tests

### Health

```bash
curl http://localhost:8080/health
```

### Models

```bash
curl http://localhost:8080/api/models
```

### Chat (non-stream)

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistralai/Mistral-7B-Instruct-v0.3",
    "messages": [
      {"role":"user","content":"Give me 3 API security tips."}
    ]
  }'
```

### Chat (stream)

```bash
curl -N -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "stream": true,
    "messages": [
      {"role":"user","content":"Explain JWT in simple words."}
    ]
  }'
```

## 7) Quality Checks

Run from repo root:

```bash
npm run lint
npm run build
```

Run server start check:

```bash
cd server
npm install
npm run start
```

## 8) Next Phase (Phase 3)

- Google OAuth + secure session management
- Email verification flow
- Persistent user chat history (rename/delete/load)
- Frontend wiring to real backend routes
