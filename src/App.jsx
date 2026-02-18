import { useMemo, useRef, useState } from 'react';
import ChatComposer from './components/ChatComposer';
import MessageBubble from './components/MessageBubble';
import ModelSelector from './components/ModelSelector';
import Sidebar from './components/Sidebar';
import { initialChats } from './data/mockChats';
import { modelCatalog } from './data/models';

function createAssistantMessage(modelId, prompt) {
  const modelName = modelCatalog.find((model) => model.id === modelId)?.name ?? 'Selected model';

  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `Using ${modelName}, here is a structured response to: "${prompt}"\n\n- This UI now supports code blocks with copy, model status, and multimodal action buttons.\n- Backend streaming/auth integrations will be wired in next phase.`,
  };
}

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

const errorMap = {
  api: 'API error: Please verify backend endpoint and key configuration.',
  no_response: 'No response: The selected model did not return output.',
  rate_limit: 'Rate limited: Please wait a moment and retry.',
};

export default function App() {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [selectedModel, setSelectedModel] = useState(modelCatalog[0].id);
  const [pending, setPending] = useState(false);
  const [errorType, setErrorType] = useState('');
  const bottomRef = useRef(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
    [activeChatId, chats],
  );

  const sendMessage = async (content) => {
    setErrorType('');
    const userMessage = { id: crypto.randomUUID(), role: 'user', content };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMessage], updatedAt: 'Just now' }
          : chat,
      ),
    );

    setPending(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (content.toLowerCase().includes('rate limit')) {
      setPending(false);
      setErrorType('rate_limit');
      return;
    }

    if (content.toLowerCase().includes('api fail')) {
      setPending(false);
      setErrorType('api');
      return;
    }

    const assistantMessage = createAssistantMessage(selectedModel, content);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, assistantMessage], updatedAt: 'Just now' }
          : chat,
      ),
    );

    setPending(false);
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
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

            <div className="flex items-center gap-2">
              <ModelSelector
                models={modelCatalog}
                selectedModel={selectedModel}
                onChange={setSelectedModel}
              />
              <button
                onClick={() => setErrorType('no_response')}
                className="rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2 text-xs hover:border-rose-400/70"
                title="Trigger test error"
              >
                Trigger Error
              </button>
            </div>
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
              {errorMap[errorType]}
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
