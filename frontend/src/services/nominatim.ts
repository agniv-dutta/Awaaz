const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const HEADERS = { 
  'User-Agent': 'Awaaz-Community-Platform/1.0 (google-solution-challenge-2025)',
  'Accept-Language': 'en'
}

export interface GeocodedPlace {
  displayName: string
  lat: number
  lng: number
  placeId: string
  type: string
  boundingBox: [number, number, number, number]
}

// Forward geocode: address → coordinates
export async function geocodeAddress(address: string): Promise<GeocodedPlace[]> {
  const params = new URLSearchParams({
    q: `${address}, Mumbai, India`,
    format: 'json',
    limit: '5',
    countrycodes: 'in',
    viewbox: '72.77,19.30,73.00,18.85',  // Mumbai bounding box
    bounded: '1',
  })
  
  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, 
    { headers: HEADERS })
  const data = await res.json()
  
  return data.map((r: any) => ({
    displayName: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    placeId: r.place_id,
    type: r.type,
    boundingBox: r.boundingbox.map(Number),
  }))
}

// Reverse geocode: coordinates → address
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    zoom: '16',
    addressdetails: '1',
  })
  
  const res = await fetch(`${NOMINATIM_BASE}/reverse?${params}`,
    { headers: HEADERS })
  const data = await res.json()
  
  return data.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}` 
}

// Debounce utility (use for all Nominatim calls — 1 req/sec limit)
export function createDebouncedGeocoder(ms = 1100) {
  let timer: ReturnType<typeof setTimeout>
  return (address: string, callback: (results: GeocodedPlace[]) => void) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      geocodeAddress(address).then(callback).catch(() => callback([]))
    }, ms)
  }
}
