export interface IpapiResult {
  city: string | null
  region: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  timezone: string | null
}

export async function detectUserLocation(): Promise<IpapiResult> {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    return {
      city: data.city ?? null,
      region: data.region ?? null,
      country: data.country_name ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      timezone: data.timezone ?? null,
    }
  } catch {
    return { city:null, region:null, country:null, 
             latitude:null, longitude:null, timezone:null }
  }
}

export function suggestWardFromCoords(
  lat: number, lng: number
): string {
  // Find closest ward by Haversine distance
  const wards = [
    { name:'Dharavi',     lat:19.0398, lng:72.8514 },
    { name:'Kurla East',  lat:19.0728, lng:72.8826 },
    { name:'Govandi',     lat:19.0474, lng:72.9195 },
    { name:'Mankhurd',    lat:19.0444, lng:72.9347 },
    { name:'Bandra West', lat:19.0596, lng:72.8295 },
  ]
  
  let closest = wards[0]
  let minDist = Infinity
  
  for (const ward of wards) {
    const dLat = (ward.lat - lat) * (Math.PI / 180)
    const dLng = (ward.lng - lng) * (Math.PI / 180)
    const a = Math.sin(dLat/2)**2 + 
              Math.cos(lat*(Math.PI/180)) * Math.cos(ward.lat*(Math.PI/180)) * 
              Math.sin(dLng/2)**2
    const dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 6371
    if (dist < minDist) { minDist = dist; closest = ward }
  }
  
  return closest.name
}
