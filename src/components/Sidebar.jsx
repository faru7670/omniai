const statusClass = {
  online: 'bg-emerald-400',
  offline: 'bg-rose-400',
};

export default function Sidebar({ chats, activeChatId, onChatSelect, onNewChat }) {
  return (
    <aside className="hidden lg:flex w-80 shrink-0 flex-col rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">OmniAI</h1>
          <p className="text-xs text-zinc-400">Multi-Model AI Assistant</p>
        </div>
        <button
          onClick={onNewChat}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-xs font-medium shadow-lg shadow-blue-900/40"
        >
          + New Chat
        </button>
      </div>

      <div className="p-3 space-y-2 overflow-y-auto">
        {chats.map((chat) => {
          const active = chat.id === activeChatId;
          return (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`w-full text-left rounded-2xl p-3 transition border ${
                active
                  ? 'border-blue-400/50 bg-blue-500/10'
                  : 'border-transparent bg-zinc-900/45 hover:bg-zinc-800/70'
              }`}
            >
              <p className="text-sm font-medium truncate">{chat.name}</p>
              <p className="text-xs text-zinc-400 mt-1">{chat.updatedAt}</p>
            </button>
          );
        })}
      </div>

      <div className="mx-3 mb-3 mt-auto rounded-2xl border border-white/10 bg-black/25 p-3">
        <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Session</p>
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${statusClass.online}`} />
          Google login connected
        </div>
      </div>
    </aside>
  );
}
