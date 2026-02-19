import { useEffect, useMemo, useRef, useState } from 'react';
import ChatComposer from './components/ChatComposer';
import MessageBubble from './components/MessageBubble';
import ModelSelector from './components/ModelSelector';
import Sidebar from './components/Sidebar';
import { initialChats } from './data/mockChats';
import { modelCatalog } from './data/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const errorMap = {
  api: 'API error: Please verify backend endpoint and key configuration.',
  no_response: 'No response: The selected model did not return output.',
  rate_limit: 'Rate limited: Please wait a moment and retry.',
  setup_error: 'Server setup error: add HUGGINGFACE_API_KEY in server/.env and restart backend.',
};

function LoadingDots() {
  return (
    <div className="mr-auto inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
      OmniAI is thinking...
    </div>
  );
}

function toApiMessages(messages) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export default function App() {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [models, setModels] = useState(modelCatalog);
  const [selectedModel, setSelectedModel] = useState(modelCatalog[0].id);
  const [pending, setPending] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const bottomRef = useRef(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [activeChatId, chats],
  );

  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/models`);
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (Array.isArray(payload?.models) && payload.models.length > 0) {
          setModels(payload.models);
          setSelectedModel(payload.models[0].id);
        }
      } catch {
        // Fallback to local model catalog if backend is not available.
      }
    };

    loadModels();
  }, []);

  const sendMessage = async (content) => {
    setErrorType('');
    setErrorMessage('');

    const userMessage = { id: crypto.randomUUID(), role: 'user', content };
    const nextMessages = [...activeChat.messages, userMessage];

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: nextMessages, updatedAt: 'Just now' }
          : chat,
      ),
    );

    setPending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: toApiMessages(nextMessages),
          stream: false,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 429 || payload?.error === 'rate_limited') {
          setErrorType('rate_limit');
        } else if (payload?.error === 'setup_error') {
          setErrorType('setup_error');
        } else if (payload?.error === 'no_response') {
          setErrorType('no_response');
        } else {
          setErrorType('api');
        }

        setErrorMessage(payload?.message || 'Unable to fetch response from backend.');
        return;
      }

      if (!payload?.message || typeof payload.message !== 'string') {
        setErrorType('no_response');
        setErrorMessage('Backend returned success but no message content.');
        return;
      }

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: payload.message,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: 'Just now' }
            : chat,
        ),
      );

      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
    } catch {
      setErrorType('api');
      setErrorMessage(
        'Could not connect to backend. Start server on http://localhost:8080 or set VITE_API_BASE_URL.',
      );
    } finally {
      setPending(false);
    }
  };

  const clearCurrentChat = () => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: 'Chat cleared. Start a new prompt when ready.',
                },
              ],
              updatedAt: 'Just now',
            }
          : chat,
      ),
    );
  };

  const createNewChat = () => {
    const newChat = {
      id: `chat-${crypto.randomUUID()}`,
      name: `New Chat ${chats.length + 1}`,
      updatedAt: 'Just now',
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'New conversation started. Pick a model and ask away.',
        },
      ],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 p-4 text-zinc-100 lg:p-6">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:h-[calc(100vh-3rem)] lg:gap-6">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onChatSelect={setActiveChatId}
          onNewChat={createNewChat}
        />

        <section className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 lg:px-6">
            <div>
              <h2 className="text-base font-semibold lg:text-lg">{activeChat.name}</h2>
              <p className="text-xs text-zinc-400">{activeChat.updatedAt}</p>
            </div>

            <ModelSelector models={models} selectedModel={selectedModel} onChange={setSelectedModel} />
          </header>

          <main className="flex-1 space-y-4 overflow-y-auto px-4 py-4 lg:px-6">
            {activeChat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {pending && <LoadingDots />}
            <div ref={bottomRef} />
          </main>

          {errorType && (
            <div className="mx-4 mb-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 lg:mx-6">
              <p>{errorMap[errorType] || errorMap.api}</p>
              {errorMessage && <p className="mt-1 text-xs text-rose-100/80">{errorMessage}</p>}
            </div>
          )}

          <div className="px-4 pb-4 lg:px-6 lg:pb-6">
            <ChatComposer onSend={sendMessage} onClear={clearCurrentChat} />
          </div>
        </section>
      </div>
    </div>
  );
}
