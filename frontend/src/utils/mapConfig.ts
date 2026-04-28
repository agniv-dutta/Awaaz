export const MAP_CONFIG = {
  // Primary: OpenStreetMap - most reliable, always works
  PRIMARY_TILE: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  PRIMARY_ATTR: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  
  // Fallback: CartoDB dark tiles
  FALLBACK_TILE: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  FALLBACK_ATTR: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',

  // Mumbai center
  MUMBAI_CENTER: [19.0760, 72.8777] as [number, number],
  MUMBAI_ZOOM: 12,
  
  // Ward coordinates (real Mumbai)
  WARDS: [
    { id:'1', name:'Dharavi',     lat:19.0398, lng:72.8514, needs:38, urgency:'CRITICAL', topCategory:'MEDICAL'   },
    { id:'2', name:'Kurla East',  lat:19.0728, lng:72.8826, needs:27, urgency:'HIGH',     topCategory:'FOOD'      },
    { id:'3', name:'Govandi',     lat:19.0474, lng:72.9195, needs:19, urgency:'HIGH',     topCategory:'SHELTER'   },
    { id:'4', name:'Mankhurd',    lat:19.0444, lng:72.9347, needs:14, urgency:'MEDIUM',   topCategory:'EDUCATION' },
    { id:'5', name:'Bandra West', lat:19.0596, lng:72.8295, needs:31, urgency:'CRITICAL', topCategory:'MEDICAL'   },
  ],
}

export const URGENCY_COLORS: Record<string, string> = {
  CRITICAL: '#FF9E00',
  HIGH:     '#E05A00',
  MEDIUM:   '#C77DFF',
  LOW:      'rgba(217,217,217,0.6)',
}
