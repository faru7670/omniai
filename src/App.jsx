import { useEffect, useRef, useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋 I am OmniAI. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("Devstral");
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    // Fake AI response (demo logic)
    const aiMessage = {
      role: "assistant",
      content: `(${model}) This is a demo AI response for: "${input}"`,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <h1 className="text-xl font-semibold">⚡ OmniAI</h1>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1 text-sm"
        >
          <option>Devstral</option>
          <option>DeepSeek</option>
          <option>Nemotron</option>
          <option>Nova Lite</option>
        </select>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-gradient-to-r from-blue-500 to-purple-600"
                : "mr-auto bg-zinc-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* INPUT BAR */}
      <footer className="px-6 py-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 bg-zinc-900 rounded-xl px-4 py-3">
          <button className="text-zinc-400 text-xl">＋</button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent outline-none text-sm"
          />

          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
