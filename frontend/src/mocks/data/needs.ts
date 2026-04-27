import type { Need, NeedCategory, NeedUrgency, NeedStatus } from '../../types'

const categories: NeedCategory[] = ['FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'LEGAL', 'MENTAL_HEALTH', 'ELDERLY_CARE', 'DISABILITY', 'OTHER']
const urgencies: NeedUrgency[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
const statuses: NeedStatus[] = ['OPEN', 'ASSIGNED', 'FULFILLED', 'CLOSED']

// Mumbai ward coordinates
const wardCoordinates = {
  '1': { lat: 19.0398, lng: 72.8514, name: 'Dharavi' },
  '2': { lat: 19.0728, lng: 72.8826, name: 'Kurla East' },
  '3': { lat: 19.0474, lng: 72.9195, name: 'Govandi' },
  '4': { lat: 19.0444, lng: 72.9347, name: 'Mankhurd' },
  '5': { lat: 19.0596, lng: 72.8295, name: 'Bandra West' }
}

export const needs: Need[] = Array.from({ length: 40 }).map((_, i) => {
  const urgency = urgencies[i % 4]
  let score = 25;
  if (urgency === 'CRITICAL') score = 95;
  else if (urgency === 'HIGH') score = 75;
  else if (urgency === 'MEDIUM') score = 50;

  const wardId = `${(i % 5) + 1}`
  const wardCoord = wardCoordinates[wardId as keyof typeof wardCoordinates]
  
  return {
    id: `n${i}`,
    category: categories[i % categories.length],
    urgency,
    urgency_score: score,
    report_count: Math.floor(Math.random() * 10) + 1,
    description: `Need assistance for ${categories[i % categories.length]} in ${wardCoord.name}. Family requires immediate support.`,
    ward_id: wardId,
    location_lat: wardCoord.lat + (Math.random() - 0.5) * 0.02,
    location_lng: wardCoord.lng + (Math.random() - 0.5) * 0.02,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_at: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    updated_at: new Date().toISOString(),
  }
})
