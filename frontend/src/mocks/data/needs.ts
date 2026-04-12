import type { Need, NeedCategory, NeedUrgency, NeedStatus } from '../../types'

const categories: NeedCategory[] = ['FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'LEGAL', 'MENTAL_HEALTH', 'ELDERLY_CARE', 'DISABILITY', 'OTHER']
const urgencies: NeedUrgency[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const statuses: NeedStatus[] = ['OPEN', 'ASSIGNED', 'FULFILLED', 'CLOSED']

export const needs: Need[] = Array.from({ length: 40 }).map((_, i) => {
  const urgency = urgencies[i % 4]
  let score = 25;
  if (urgency === 'CRITICAL') score = 95;
  else if (urgency === 'HIGH') score = 75;
  else if (urgency === 'MEDIUM') score = 50;

  return {
    id: `n${i}`,
    category: categories[i % categories.length],
    urgency,
    urgency_score: score,
    report_count: Math.floor(Math.random() * 10) + 1,
    description: `Need assistance for ${categories[i % categories.length]} near ward area. Family requires immediate support.`,
    ward_id: `${(i % 5) + 1}`,
    location_lat: 19.0 + (Math.random() * 0.1),
    location_lng: 72.8 + (Math.random() * 0.1),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_at: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    updated_at: new Date().toISOString(),
  }
})
