import json
from typing import Any

import httpx

from app.core.config import settings

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


async def extract_needs_with_gemini(raw_text: str) -> dict[str, Any]:
    """
    Uses Gemini to structure OCR/report text into need fields.
    """
    api_key = (settings.GEMINI_API_KEY or "").strip()
    if not api_key:
        return {
            "category": "OTHER",
            "urgency": "MEDIUM",
            "summary": raw_text[:220] if raw_text else "No text extracted",
            "keyNeeds": [],
        }

    prompt = (
        "You are analyzing a community field report for Awaaz, a Mumbai NGO platform.\n\n"
        f"Report text: \"{raw_text}\"\n\n"
        "Extract and return ONLY valid JSON (no markdown, no explanation):\n"
        "{\n"
        "  \"category\": one of [FOOD, MEDICAL, SHELTER, EDUCATION, LEGAL, MENTAL_HEALTH, ELDERLY_CARE, OTHER],\n"
        "  \"urgency\": one of [CRITICAL, HIGH, MEDIUM, LOW],\n"
        "  \"summary\": \"one sentence summary of the core need\",\n"
        "  \"keyNeeds\": [\"specific need 1\", \"specific need 2\"]\n"
        "}"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 220,
        },
    }

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(
            f"{GEMINI_URL}?key={api_key}",
            headers={
                "Content-Type": "application/json",
            },
            json=payload,
        )

    if response.status_code >= 400:
        return {
            "category": "OTHER",
            "urgency": "MEDIUM",
            "summary": raw_text[:220] if raw_text else "No text extracted",
            "keyNeeds": [],
        }

    data = response.json()
    text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
    cleaned = text.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(cleaned)
        return {
            "category": parsed.get("category", "OTHER"),
            "urgency": parsed.get("urgency", "MEDIUM"),
            "summary": parsed.get("summary", raw_text[:220] if raw_text else "No text extracted"),
            "keyNeeds": parsed.get("keyNeeds", []),
        }
    except json.JSONDecodeError:
        return {
            "category": "OTHER",
            "urgency": "MEDIUM",
            "summary": cleaned or (raw_text[:220] if raw_text else "No text extracted"),
            "keyNeeds": [],
        }


async def enhance_with_gemini(raw_text: str) -> dict[str, Any]:
    """
    Backwards-compatible alias while callers transition to extract_needs_with_gemini.
    """
    return await extract_needs_with_gemini(raw_text)
