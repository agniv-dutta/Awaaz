import { useEffect, useState } from 'react'

export function useIsMobile(breakpoint = 900) {
  const getMatches = () => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  }

  const [isMobile, setIsMobile] = useState<boolean>(getMatches)

  useEffect(() => {
    const onResize = () => setIsMobile(getMatches())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return isMobile
}
