export interface WeatherAlert {
  condition: 'clear' | 'rain' | 'extreme_heat' | 'flood_risk' | 'storm'
  temp: number
  description: string
  alertBanner: string | null
}

export async function getMumbaiWeather(): Promise<WeatherAlert> {
  const key = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim()
  if (!key) {
    return { condition: 'clear', temp: 32, description: 'Partly cloudy', alertBanner: null }
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai,IN&appid=${key}&units=metric`)
    if (!res.ok) {
      throw new Error('weather request failed')
    }
    const data = await res.json()
    const temp = Math.round(data?.main?.temp ?? 32)
    const weatherId = data?.weather?.[0]?.id ?? 800
    const desc = data?.weather?.[0]?.description ?? 'Partly cloudy'

    let condition: WeatherAlert['condition'] = 'clear'
    let alertBanner: string | null = null

    if (weatherId >= 200 && weatherId < 300) {
      condition = 'storm'
      alertBanner = 'Thunderstorm warning - shelter needs may spike'
    } else if (weatherId >= 500 && weatherId < 600) {
      condition = 'rain'
      alertBanner = 'Active rainfall - flooding risk in low-lying wards'
    } else if (temp > 38) {
      condition = 'extreme_heat'
      alertBanner = `Heat alert ${temp}°C - elderly and medical needs elevated`
    }

    return { condition, temp, description: desc, alertBanner }
  } catch {
    return { condition: 'clear', temp: 32, description: 'Partly cloudy', alertBanner: null }
  }
}
