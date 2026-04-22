type OpenNeed = {
  category: string;
  urgency: string;
  description: string;
  ward?: string;
  reportCount?: number;
};

type VolunteerLike = {
  name: string;
  skills: string[];
  reliability?: number;
  reliability_score?: number;
  availabilitySchedule?: Record<string, string[]>;
  availability_schedule?: Record<string, string[]>;
  distance?: string;
  completedTasks?: number;
  completed_tasks?: number;
};

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

function getGeminiKey(): string {
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
}

async function askGemini(prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const key = getGeminiKey();
  if (!key) {
    throw new Error('Missing VITE_GEMINI_API_KEY');
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini request failed (${res.status})`);
  }

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

export async function getVolunteerInsight(volunteer: VolunteerLike, openNeeds: OpenNeed[]): Promise<string> {
  const reliability = Math.round(((volunteer.reliability ?? volunteer.reliability_score ?? 0) as number) * 100);
  const completedTasks = volunteer.completedTasks ?? volunteer.completed_tasks ?? 0;
  const availability = volunteer.availabilitySchedule ?? volunteer.availability_schedule ?? {};

  const prompt = `You are an AI assistant for Awaaz, a community dispatch platform in Mumbai.

Volunteer profile:
- Name: ${volunteer.name}
- Skills: ${volunteer.skills.join(', ')}
- Reliability score: ${reliability}%
- Availability: ${JSON.stringify(availability)}
- Distance from active ward: ${volunteer.distance || 'Unknown'}
- Tasks completed: ${completedTasks}

Current open needs in their ward:
${openNeeds.slice(0, 3).map(n => `- ${n.category} (${n.urgency}): ${n.description}`).join('\n') || '- No open needs available'}

In 2-3 sentences, give a specific, actionable insight about this volunteer's best deployment opportunity right now. Be direct and human. Mention their strongest skill and the most urgent matching need. Do not use bullet points.`;

  try {
    const text = await askGemini(prompt, 120, 0.7);
    return text || 'Unable to generate insight.';
  } catch {
    return 'Unable to generate insight.';
  }
}

export async function analyzeReportText(rawText: string): Promise<{
  category: string;
  urgency: string;
  summary: string;
  keyNeeds: string[];
}> {
  const prompt = `You are analyzing a community field report for Awaaz, a Mumbai NGO platform.

Report text: "${rawText}"

Extract and return ONLY valid JSON (no markdown, no explanation):
{
  "category": one of [FOOD, MEDICAL, SHELTER, EDUCATION, LEGAL, MENTAL_HEALTH, ELDERLY_CARE, OTHER],
  "urgency": one of [CRITICAL, HIGH, MEDIUM, LOW],
  "summary": "one sentence summary of the core need",
  "keyNeeds": ["specific need 1", "specific need 2"]
}`;

  try {
    const text = await askGemini(prompt, 200, 0.2);
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { category: 'OTHER', urgency: 'MEDIUM', summary: 'Unable to parse report text automatically.', keyNeeds: [] };
  }
}

export async function generateDispatchSuggestion(need: OpenNeed, topVolunteers: VolunteerLike[]): Promise<string> {
  const prompt = `You are the dispatch AI for Awaaz, a Mumbai community platform.

Urgent need: ${need.category} - "${need.description}" in ${need.ward || 'Unknown ward'} (${need.urgency} urgency, ${need.reportCount || 0} reports)

Top matched volunteers:
${topVolunteers.map((v, i) => {
  const reliability = Math.round(((v.reliability ?? v.reliability_score ?? 0) as number) * 100);
  return `${i + 1}. ${v.name} - ${v.skills.join(', ')}, reliability ${reliability}%, ${v.distance || 'Unknown distance'} away`;
}).join('\n')}

In 2 sentences, recommend who should be dispatched first and why. Be specific about the skill match and urgency factor.`;

  try {
    return await askGemini(prompt, 100, 0.6);
  } catch {
    return '';
  }
}
