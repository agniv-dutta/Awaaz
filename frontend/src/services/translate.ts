export async function detectAndTranslate(text: string): Promise<{
  originalText: string
  translatedText: string
  detectedLanguage: string
  wasTranslated: boolean
}> {
  const key = (import.meta.env.VITE_GOOGLE_TRANSLATE_KEY || '').trim()
  if (!key || !text.trim()) {
    return { originalText: text, translatedText: text, detectedLanguage: 'en', wasTranslated: false }
  }

  try {
    const detectRes = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${key}`,
      {
        method: 'POST',
        body: JSON.stringify({ q: text }),
        headers: { 'Content-Type': 'application/json' },
      }
    )
    const detect = await detectRes.json()
    const lang = detect?.data?.detections?.[0]?.[0]?.language || 'en'

    if (lang === 'en') {
      return { originalText: text, translatedText: text, detectedLanguage: 'en', wasTranslated: false }
    }

    const translateRes = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${key}`,
      {
        method: 'POST',
        body: JSON.stringify({ q: text, target: 'en', source: lang }),
        headers: { 'Content-Type': 'application/json' },
      }
    )
    const translated = await translateRes.json()
    return {
      originalText: text,
      translatedText: translated?.data?.translations?.[0]?.translatedText || text,
      detectedLanguage: lang,
      wasTranslated: true,
    }
  } catch {
    return { originalText: text, translatedText: text, detectedLanguage: 'en', wasTranslated: false }
  }
}
