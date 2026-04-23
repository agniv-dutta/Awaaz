import json
from typing import Any

from app.services.ai_service import ask_groq


def _fallback_parse(raw_text: str) -> dict[str, Any]:
    return {
        "category": "OTHER",
        "urgency": "MEDIUM",
        "summary": raw_text[:220] if raw_text else "No text extracted",
        "keyNeeds": [],
    }


async def extract_needs_with_groq(raw_text: str) -> dict[str, Any]:
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

    text = await ask_groq(prompt, max_tokens=220, temperature=0.2)
    if not text:
        return _fallback_parse(raw_text)

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
