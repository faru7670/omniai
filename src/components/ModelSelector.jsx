export default function ModelSelector({ models, selectedModel, onChange }) {
  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-xl border border-white/10 bg-zinc-900/80 py-2 pl-3 pr-8 text-sm shadow-lg outline-none focus:border-blue-400"
        aria-label="Model selector"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} · {model.status}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-zinc-400">▾</span>
    </div>
  );
}
