import json
import re
from groq import Groq
from app.config import get_settings

settings = get_settings()
client = Groq(api_key=settings.groq_api_key)

MODEL = "llama-3.3-70b-versatile"


class GroqGenerationError(Exception):
    pass


def _build_prompt(role: str, experience_level: str, topic: str | None, num_questions: int) -> str:
    topic_clause = f" focused on the topic(s): {topic}" if topic else ""
    return f"""You are an expert technical interviewer. Generate {num_questions} interview questions
for a {experience_level}-level {role} candidate{topic_clause}.

Return ONLY a valid JSON array (no markdown, no commentary, no code fences) where each item has
exactly these keys:
- "question": the interview question text
- "category": a short category label (e.g. "System Design", "Behavioral", "Python Fundamentals")
- "answer_tip": a 1-2 sentence hint about what a strong answer should cover

Make the questions realistic, varied in category, and appropriately difficult for the
{experience_level} level. Return exactly {num_questions} items.
"""


def _extract_json_array(text: str) -> list:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        raise GroqGenerationError("No JSON array found in AI response.")
    return json.loads(match.group(0))


def generate_questions(role: str, experience_level: str, topic: str | None, num_questions: int) -> list[dict]:
    prompt = _build_prompt(role, experience_level, topic, num_questions)

    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=2000,
        )
    except Exception as exc:
        raise GroqGenerationError(f"Groq API call failed: {exc}") from exc

    raw_text = completion.choices[0].message.content

    try:
        parsed = _extract_json_array(raw_text)
    except (json.JSONDecodeError, GroqGenerationError) as exc:
        raise GroqGenerationError(f"Could not parse AI response as JSON: {exc}") from exc

    cleaned = []
    for item in parsed:
        if not all(k in item for k in ("question", "category", "answer_tip")):
            continue
        cleaned.append({
            "question": str(item["question"]),
            "category": str(item["category"]),
            "answer_tip": str(item["answer_tip"]),
        })

    if not cleaned:
        raise GroqGenerationError("AI response contained no valid question items.")

    return cleaned