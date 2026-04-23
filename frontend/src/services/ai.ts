import { api } from './api'

type OpenNeed = {
  category: string
  urgency: string
  description: string
  ward?: string
  reportCount?: number
}

type VolunteerLike = {
  name: string
  skills: string[]
  reliability?: number
  reliability_score?: number
  availabilitySchedule?: Record<string, string[]>
  availability_schedule?: Record<string, string[]>
  distance?: string
  completedTasks?: number
  completed_tasks?: number
}

export async function getVolunteerInsight(volunteer: VolunteerLike, openNeeds: OpenNeed[]): Promise<string> {
  try {
    const { data } = await api.post('/ai/volunteer-insight', {
      volunteer,
      open_needs: openNeeds,
    })
    return String(data?.insight || '').trim() || 'Unable to generate insight.'
  } catch {
    return 'Unable to generate insight.'
  }
}

export async function analyzeReportText(rawText: string): Promise<{
  category: string
  urgency: string
  summary: string
  keyNeeds: string[]
}> {
  try {
    const { data } = await api.post('/ai/analyze-report', {
      raw_text: rawText,
    })
    return {
      category: data?.category || 'OTHER',
      urgency: data?.urgency || 'MEDIUM',
      summary: data?.summary || 'Unable to parse report text automatically.',
      keyNeeds: Array.isArray(data?.keyNeeds) ? data.keyNeeds : [],
    }
  } catch {
    return { category: 'OTHER', urgency: 'MEDIUM', summary: 'Unable to parse report text automatically.', keyNeeds: [] }
  }
}

export async function generateDispatchSuggestion(need: OpenNeed, topVolunteers: VolunteerLike[]): Promise<string> {
  try {
    const { data } = await api.post('/ai/dispatch-suggestion', {
      need,
      top_volunteers: topVolunteers,
    })
    return String(data?.suggestion || '').trim()
  } catch {
    return ''
  }
}
