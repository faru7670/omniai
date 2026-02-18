import CodeBlock from './CodeBlock';

function parseCodeFence(content) {
  const match = content.match(/```(\w+)?\n([\s\S]*?)```/);
  if (!match) {
    return { text: content, code: null, language: null };
  }

  return {
    text: content.replace(match[0], '').trim(),
    code: match[2],
    language: match[1] || 'text',
  };
}

export default function MessageBubble({ message }) {
  const { text, code, language } = parseCodeFence(message.content);

  return (
    <div className={`max-w-3xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
      <div
        className={`rounded-3xl px-4 py-3 text-sm leading-7 shadow-xl backdrop-blur ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white'
            : 'border border-white/10 bg-white/5 text-zinc-100'
        }`}
      >
        {text && <p className="whitespace-pre-wrap">{text}</p>}
        {code && <CodeBlock code={code} language={language} />}
      </div>
    </div>
  );
}
