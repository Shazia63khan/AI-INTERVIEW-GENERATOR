import { useState } from "react";

const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Mid", "Senior", "Lead"];

export default function GenerateForm({ onGenerate, isLoading }) {
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [formError, setFormError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!role.trim()) {
      setFormError("Enter a role to generate questions for.");
      return;
    }
    setFormError("");
    onGenerate({ role: role.trim(), experienceLevel, topic: topic.trim(), numQuestions });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-inkLight border border-rule rounded-lg p-6 space-y-5">
      <div>
        <label htmlFor="role" className="block font-mono text-xs uppercase tracking-wider text-amber mb-2">
          Role / Position
        </label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Backend Developer, Data Analyst"
          className="w-full bg-ink border border-rule rounded px-4 py-3 text-paper placeholder-slate focus:border-amber outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="level" className="block font-mono text-xs uppercase tracking-wider text-amber mb-2">
            Experience Level
          </label>
          <select
            id="level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full bg-ink border border-rule rounded px-4 py-3 text-paper focus:border-amber outline-none transition-colors"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="count" className="block font-mono text-xs uppercase tracking-wider text-amber mb-2">
            Number of Questions
          </label>
          <input
            id="count"
            type="number"
            min={1}
            max={15}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full bg-ink border border-rule rounded px-4 py-3 text-paper focus:border-amber outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="block font-mono text-xs uppercase tracking-wider text-amber mb-2">
          Topic Focus <span className="text-slate">(optional)</span>
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. System Design, React, SQL"
          className="w-full bg-ink border border-rule rounded px-4 py-3 text-paper placeholder-slate focus:border-amber outline-none transition-colors"
        />
      </div>

      {formError && (
        <p className="text-red-400 text-sm font-mono">{formError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber text-ink font-mono font-bold uppercase tracking-wider py-3 rounded hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generating…" : "Generate Questions"}
      </button>
    </form>
  );
}