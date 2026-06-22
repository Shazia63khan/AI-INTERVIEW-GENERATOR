const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse(res) {
  if (!res.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // response body wasn't JSON
    }
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function generateQuestions({ role, experienceLevel, topic, numQuestions }) {
  const res = await fetch(`${API_BASE_URL}/api/questions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role,
      experience_level: experienceLevel,
      topic: topic || null,
      num_questions: numQuestions,
    }),
  });
  return handleResponse(res);
}

export async function fetchHistory(limit = 20) {
  const res = await fetch(`${API_BASE_URL}/api/questions/history?limit=${limit}`);
  return handleResponse(res);
}

export async function fetchQuestionSet(id) {
  const res = await fetch(`${API_BASE_URL}/api/questions/${id}`);
  return handleResponse(res);
}

export async function deleteQuestionSet(id) {
  const res = await fetch(`${API_BASE_URL}/api/questions/${id}`, { method: "DELETE" });
  return handleResponse(res);
}