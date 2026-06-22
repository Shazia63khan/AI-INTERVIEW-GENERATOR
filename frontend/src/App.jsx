import { useState, useEffect, useCallback } from "react";
import GenerateForm from "./components/GenerateForm";
import QuestionCard from "./components/QuestionCard";
import HistoryPanel from "./components/HistoryPanel";
import { generateQuestions, fetchHistory, fetchQuestionSet, deleteQuestionSet } from "./api/client";

export default function App() {
  const [currentSet, setCurrentSet] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleGenerate(formData) {
    setIsGenerating(true);
    setError("");
    try {
      const result = await generateQuestions(formData);
      setCurrentSet(result);
      await loadHistory();
    } catch (err) {
      setError(err.message || "Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSelectHistory(id) {
    setError("");
    try {
      const result = await fetchQuestionSet(id);
      setCurrentSet(result);
    } catch (err) {
      setError("Could not load that question set.");
    }
  }

  async function handleDeleteHistory(id) {
    try {
      await deleteQuestionSet(id);
      if (currentSet?.id === id) setCurrentSet(null);
      await loadHistory();
    } catch (err) {
      setError("Could not delete that question set.");
    }
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="border-b border-rule px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-mono font-extrabold text-xl tracking-tight">
              <span className="text-amber">$</span> interview_prep
            </h1>
            <p className="text-slate text-sm mt-1">AI-generated interview questions, tailored to role and level.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        <aside className="space-y-8">
          <GenerateForm onGenerate={handleGenerate} isLoading={isGenerating} />

          <div>
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate mb-3 border-b border-rule pb-2">
              History
            </h2>
            <HistoryPanel
              history={history}
              onSelect={handleSelectHistory}
              onDelete={handleDeleteHistory}
              activeId={currentSet?.id}
              isLoading={isHistoryLoading}
            />
          </div>
        </aside>

        <section>
          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 rounded-lg p-4 mb-6 font-mono text-sm">
              {error}
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-2 border-rule border-t-amber rounded-full animate-spin" />
              <p className="font-mono text-sm text-slate">Generating tailored questions…</p>
            </div>
          )}

          {!isGenerating && !currentSet && !error && (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-rule rounded-lg text-center px-6">
              <p className="font-mono text-slate text-sm leading-relaxed">
                Fill in a role and hit generate.<br />Your interview question set will appear here.
              </p>
            </div>
          )}

          {!isGenerating && currentSet && (
            <div>
              <div className="mb-6 flex items-baseline justify-between flex-wrap gap-2">
                <h2 className="text-lg font-semibold">
                  {currentSet.role} <span className="text-slate">·</span> {currentSet.experience_level}
                  {currentSet.topic && <span className="text-slate"> · {currentSet.topic}</span>}
                </h2>
                <span className="font-mono text-xs text-slate">{currentSet.questions.length} questions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSet.questions.map((q, idx) => (
                  <QuestionCard
                    key={idx}
                    index={idx}
                    question={q.question}
                    category={q.category}
                    answerTip={q.answer_tip}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-rule px-6 py-4 mt-8">
        <p className="max-w-6xl mx-auto font-mono text-[11px] text-slate text-center">
          Built with FastAPI + Groq (Llama 3.3) + React. Generated questions are AI-produced — verify accuracy before relying on them.
        </p>
      </footer>
    </div>
  );
}