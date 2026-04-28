import json
from typing import Any

import httpx

from app.core.config import settings

GEMINI_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def _clean_text(text: str) -> str:
    return text.replace("```json", "").replace("```", "").strip()


async def _ask_gemini(prompt: str, *, max_tokens: int = 220, temperature: float = 0.3) -> str:
    api_key = (settings.GEMINI_API_KEY or "").strip()
    if not api_key:
        return ""

    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        },
    }

    url = GEMINI_URL_TEMPLATE.format(model=settings.GEMINI_MODEL)
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(url, params={"key": api_key}, json=payload)
    except httpx.HTTPError:
        return ""

    if response.status_code >= 400:
        return ""

    data = response.json()
    candidates = data.get("candidates", [])
    if not candidates:
        return ""

    content = candidates[0].get("content", {})
    parts = content.get("parts", [])
    return "".join(part.get("text", "") for part in parts if isinstance(part, dict)).strip()


async def _ask_groq(prompt: str, *, max_tokens: int = 220, temperature: float = 0.3) -> str:
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

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except httpx.HTTPError:
        return ""

    if response.status_code >= 400:
        return ""

    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()


async def ask_ai(prompt: str, *, max_tokens: int = 220, temperature: float = 0.3) -> str:
    text = await _ask_gemini(prompt, max_tokens=max_tokens, temperature=temperature)
    if text:
        return text

    return await _ask_groq(prompt, max_tokens=max_tokens, temperature=temperature)


async def ask_groq(prompt: str, *, max_tokens: int = 220, temperature: float = 0.3) -> str:
    return await ask_ai(prompt, max_tokens=max_tokens, temperature=temperature)


async def analyze_report_text(raw_text: str) -> dict[str, Any]:
    prompt = (
        "Analyze the following community field report and return ONLY valid JSON with keys: "
        "category, urgency, summary, keyNeeds.\n\n"
        "Allowed category values: [FOOD, MEDICAL, SHELTER, EDUCATION, LEGAL, MENTAL_HEALTH, ELDERLY_CARE, OTHER].\n"
        "Allowed urgency values: [CRITICAL, HIGH, MEDIUM, LOW].\n\n"
        f"Report text: \"{raw_text}\""
    )

    text = await ask_ai(prompt, max_tokens=220, temperature=0.2)
    if not text:
        return {
            "category": "OTHER",
            "urgency": "MEDIUM",
            "summary": "Unable to parse report text automatically.",
            "keyNeeds": [],
        }

    cleaned = _clean_text(text)
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
    return await ask_ai(prompt, max_tokens=120, temperature=0.5)


async def get_volunteer_insight(volunteer: dict[str, Any], open_needs: list[dict[str, Any]]) -> str:
    prompt = (
        "Given a volunteer profile and open ward needs, provide a specific 2-3 sentence deployment insight.\n\n"
        f"Volunteer: {json.dumps(volunteer, ensure_ascii=True)}\n"
        f"Open needs: {json.dumps(open_needs, ensure_ascii=True)}"
    )
    return await ask_ai(prompt, max_tokens=140, temperature=0.6)
