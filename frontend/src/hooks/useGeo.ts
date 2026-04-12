import { useState, useEffect } from 'react';

export function useGeo() {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  
  useEffect(() => {
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      })
      return () => navigator.geolocation.clearWatch(id)
    }
  }, [])
  
  return location
}
