import { useState } from "react";

export default function QuestionCard({ index, question, category, answerTip }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card h-56" style={{ cursor: "pointer" }} onClick={() => setFlipped(!flipped)}>
      <div className={`flip-card-inner relative w-full h-full ${flipped ? "flipped" : ""}`}>
        <div className="flip-card-front absolute w-full h-full bg-paper rounded-lg p-6 flex flex-col border border-rule">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-ink bg-amber px-2 py-1 rounded">
              Q{String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate">
              {category}
            </span>
          </div>
          <p className="text-ink text-base leading-relaxed flex-1 overflow-y-auto">{question}</p>
          <p className="font-mono text-[11px] text-slate mt-2">Tap to reveal answer tip →</p>
        </div>

        <div className="flip-card-back absolute w-full h-full bg-ink rounded-lg p-6 flex flex-col border border-amber">
          <span className="font-mono text-xs uppercase tracking-wider text-amber mb-3">
            What a strong answer covers
          </span>
          <p className="text-paper text-sm leading-relaxed flex-1 overflow-y-auto">{answerTip}</p>
          <p className="font-mono text-[11px] text-slate mt-2">← Tap to go back</p>
        </div>
      </div>
    </div>
  );
}