import { useState } from 'react';

export default function CodeBlock({ code, language = 'txt' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-zinc-400">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-white/10 bg-zinc-900/80 px-2 py-1 text-zinc-200 hover:border-blue-400/60"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-blue-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
