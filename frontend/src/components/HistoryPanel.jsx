function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPanel({ history, onSelect, onDelete, activeId, isLoading }) {
  if (isLoading) {
    return <p className="font-mono text-sm text-slate">Loading history…</p>;
  }

  if (history.length === 0) {
    return (
      <p className="font-mono text-sm text-slate leading-relaxed">
        No question sets yet. Generate your first batch — it'll show up here for quick access later.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {history.map((item) => (
        <li
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`group flex items-start justify-between gap-2 p-3 rounded border cursor-pointer transition-colors ${
            activeId === item.id
              ? "border-amber bg-inkLight"
              : "border-rule hover:border-slate bg-inkLight/50"
          }`}
        >
          <div className="min-w-0">
            <p className="text-paper text-sm font-medium truncate">{item.role}</p>
            <p className="font-mono text-[11px] text-slate mt-1">
              {item.experience_level} · {item.num_questions}Q
              {item.topic ? ` · ${item.topic}` : ""}
            </p>
            <p className="font-mono text-[10px] text-slate mt-1">{formatDate(item.created_at)}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="text-slate hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono text-xs shrink-0"
            aria-label="Delete this question set"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}