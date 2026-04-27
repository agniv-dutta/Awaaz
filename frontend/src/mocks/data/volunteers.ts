import type { Volunteer } from '../../types'

const names = ["Rahul Sharma", "Priya Patel", "Amit Singh", "Sneha Gupta", "Vikram Malhotra", "Neha Desai", "Arjun Reddy", "Pooja Kumar", "Rohan Mehta", "Kavita R", "Suresh N", "Kiran V", "Aditi B", "Ravi K", "Anita M", "Deepak S", "Sunita D", "Rajesh C", "Arti P", "Gaurav T"]

// Mumbai ward coordinates
const wardCoordinates = {
  '1': { lat: 19.0398, lng: 72.8514, name: 'Dharavi' },
  '2': { lat: 19.0728, lng: 72.8826, name: 'Kurla East' },
  '3': { lat: 19.0474, lng: 72.9195, name: 'Govandi' },
  '4': { lat: 19.0444, lng: 72.9347, name: 'Mankhurd' },
  '5': { lat: 19.0596, lng: 72.8295, name: 'Bandra West' }
}

export const volunteers: Volunteer[] = names.map((name, i) => {
  const wardId = `${(i % 5) + 1}`
  const wardCoord = wardCoordinates[wardId as keyof typeof wardCoordinates]
  
  return {
    id: `v${i}`,
    user_id: `u${i}`,
    skills: i % 2 === 0 ? ['MEDICAL', 'LOGISTICS'] : ['TEACHING', 'COOKING'],
    languages: ['Hindi', 'English', 'Marathi'],
    availability_schedule: {},
    current_lat: wardCoord.lat + (Math.random() - 0.5) * 0.02,
    current_lng: wardCoord.lng + (Math.random() - 0.5) * 0.02,
    max_radius_km: 5,
    is_active: true,
    completed_tasks: Math.floor(Math.random() * 50),
    reliability_score: 0.5 + (Math.random() * 0.5),
    home_ward_id: wardId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Injecting "name" roughly if needed, though strictly it's on User. We can just add a mock property for easier mock UI.
    name: name
  } as any
}) // Cast due to adding name for easier mock UI
