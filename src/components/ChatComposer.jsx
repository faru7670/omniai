import { useState } from 'react';

const actionButtons = [
  { id: 'image', label: '🖼️', title: 'Upload image' },
  { id: 'pdf', label: '📄', title: 'Upload PDF' },
  { id: 'audio', label: '🎙️', title: 'Audio input' },
  { id: 'clear', label: '🧹', title: 'Clear chat' },
];

export default function ChatComposer({ onSend, onClear }) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const cleaned = draft.trim();
    if (!cleaned) {
      return;
    }

    onSend(cleaned);
    setDraft('');
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="sticky bottom-0 pt-3">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/85 p-3 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {actionButtons.map((button) => {
            const action = button.id === 'clear' ? onClear : undefined;
            return (
              <button
                key={button.id}
                onClick={action}
                className="rounded-xl border border-white/10 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-200 hover:border-blue-400/60"
                title={button.title}
              >
                {button.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-end gap-3">
          <textarea
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask OmniAI anything... (Enter to send, Shift + Enter new line)"
            className="max-h-48 min-h-[64px] flex-1 resize-y rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />

          <button
            onClick={submit}
            className="mb-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-3 text-sm font-medium shadow-lg shadow-blue-900/40 hover:brightness-110"
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
