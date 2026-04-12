import type { Volunteer } from '../../types'

const names = ["Rahul Sharma", "Priya Patel", "Amit Singh", "Sneha Gupta", "Vikram Malhotra", "Neha Desai", "Arjun Reddy", "Pooja Kumar", "Rohan Mehta", "Kavita R", "Suresh N", "Kiran V", "Aditi B", "Ravi K", "Anita M", "Deepak S", "Sunita D", "Rajesh C", "Arti P", "Gaurav T"]

export const volunteers: Volunteer[] = names.map((name, i) => ({
  id: `v${i}`,
  user_id: `u${i}`,
  skills: i % 2 === 0 ? ['MEDICAL', 'LOGISTICS'] : ['TEACHING', 'COOKING'],
  languages: ['Hindi', 'English', 'Marathi'],
  availability_schedule: {},
  current_lat: 19.0 + (Math.random() * 0.1),
  current_lng: 72.8 + (Math.random() * 0.1),
  max_radius_km: 5,
  is_active: true,
  completed_tasks: Math.floor(Math.random() * 50),
  reliability_score: 0.5 + (Math.random() * 0.5),
  home_ward_id: `${(i % 5) + 1}`,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  // Injecting "name" roughly if needed, though strictly it's on User. We can just add a mock property for UI.
  name: name
} as any)) // Cast due to adding name for easier mock UI
