import { useEffect, useState } from 'react'
import { C } from '../../utils/colors'
import { useMockUserStore } from '../../store/mockUserStore'
import { getMumbaiWeather, type WeatherAlert } from '../../services/weather'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { user } = useMockUserStore()
  const [weather, setWeather] = useState<WeatherAlert | null>(null)
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DU'

  useEffect(() => {
    const cacheKey = 'awaaz-weather-cache'
    const cacheTsKey = 'awaaz-weather-cache-ts'
    const now = Date.now()
    const cached = localStorage.getItem(cacheKey)
    const cachedTs = Number(localStorage.getItem(cacheTsKey) || '0')
    const isFresh = cached && cachedTs && (now - cachedTs) < (30 * 60 * 1000)

    if (isFresh) {
      try {
        setWeather(JSON.parse(cached as string))
        return
      } catch {
        // ignore parse errors and refetch
      }
    }

    getMumbaiWeather()
      .then((data) => {
        setWeather(data)
        localStorage.setItem(cacheKey, JSON.stringify(data))
        localStorage.setItem(cacheTsKey, String(now))
      })
      .catch(() => {})
  }, [])

  const weatherIcon = weather?.condition === 'storm'
    ? '⚡'
    : weather?.condition === 'rain'
      ? '🌧'
      : weather?.condition === 'extreme_heat'
        ? '☀'
        : '⛅'

  return (
    <header style={{
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid rgba(255, 158, 0, 0.10)',
      background: 'rgba(26, 26, 26, 0.5)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: 500, color: C.textPrimary, margin: 0 }}>
        {title}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Demo Mode Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '999px',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          background: 'rgba(74, 222, 128, 0.1)',
          padding: '5px 12px',
          color: '#4ade80',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}>
          DEMO MODE
        </div>

        {weather && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '999px',
            border: '1px solid rgba(255,158,0,0.2)',
            background: 'rgba(255,255,255,0.03)',
            padding: '5px 10px',
            color: '#D9D9D9',
            fontSize: '12px',
          }}>
            <span>{weatherIcon}</span>
            <span>{weather.temp}°C · {weather.description}</span>
          </div>
        )}

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: C.violetGhost,
          border: `1px solid ${C.violetBorder}`,
          color: C.violet,
          fontSize: '14px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          userSelect: 'none',
        }}>
          {initials}
        </div>
      </div>
    </header>
  )
}
