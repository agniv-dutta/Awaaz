import json
from typing import Any

import httpx

from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


async def ask_groq(prompt: str, *, max_tokens: int = 220, temperature: float = 0.3) -> str:
    api_key = (settings.GROQ_API_KEY or "").strip()
    if not api_key:
        return ""

    payload = {
        "model": settings.GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "You are an AI assistant for Awaaz, a Mumbai community relief platform."},
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )

    if response.status_code >= 400:
        return ""

    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()


async def analyze_report_text(raw_text: str) -> dict[str, Any]:
    prompt = (
        "Analyze the following community field report and return ONLY valid JSON with keys: "
        "category, urgency, summary, keyNeeds.\n\n"
        "Allowed category values: [FOOD, MEDICAL, SHELTER, EDUCATION, LEGAL, MENTAL_HEALTH, ELDERLY_CARE, OTHER].\n"
        "Allowed urgency values: [CRITICAL, HIGH, MEDIUM, LOW].\n\n"
        f"Report text: \"{raw_text}\""
    )

    text = await ask_groq(prompt, max_tokens=220, temperature=0.2)
    if not text:
        return {
            "category": "OTHER",
            "urgency": "MEDIUM",
            "summary": "Unable to parse report text automatically.",
            "keyNeeds": [],
        }

    cleaned = text.replace("```json", "").replace("```", "").strip()
    try:
        parsed = json.loads(cleaned)
        return {
            "category": parsed.get("category", "OTHER"),
            "urgency": parsed.get("urgency", "MEDIUM"),
            "summary": parsed.get("summary", "Unable to parse report text automatically."),
            "keyNeeds": parsed.get("keyNeeds", []),
        }
    except json.JSONDecodeError:
        return {
            "category": "OTHER",
            "urgency": "MEDIUM",
            "summary": cleaned or "Unable to parse report text automatically.",
            "keyNeeds": [],
        }


async def generate_dispatch_suggestion(need: dict[str, Any], top_volunteers: list[dict[str, Any]]) -> str:
    prompt = (
        "You are the dispatch AI for Awaaz. Recommend who should be dispatched first and why in 2 concise sentences.\n\n"
        f"Urgent need: {json.dumps(need, ensure_ascii=True)}\n"
        f"Top matched volunteers: {json.dumps(top_volunteers, ensure_ascii=True)}"
    )
    return await ask_groq(prompt, max_tokens=120, temperature=0.5)


async def get_volunteer_insight(volunteer: dict[str, Any], open_needs: list[dict[str, Any]]) -> str:
    prompt = (
        "Given a volunteer profile and open ward needs, provide a specific 2-3 sentence deployment insight.\n\n"
        f"Volunteer: {json.dumps(volunteer, ensure_ascii=True)}\n"
        f"Open needs: {json.dumps(open_needs, ensure_ascii=True)}"
    )
    return await ask_groq(prompt, max_tokens=140, temperature=0.6)
