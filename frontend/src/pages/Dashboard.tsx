import { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { NeedCard } from '../components/needs/NeedCard'
import { LiveFeed } from '../components/realtime/LiveFeed'
import { useNeeds } from '../hooks/useNeeds'
import { useAnalyticsSummary } from '../hooks/useAnalytics'
import type { Need } from '../types'
import { getMumbaiWeather } from '../services/weather'
import { MapContainer, Circle, Tooltip, useMap } from 'react-leaflet'
import { ReliableTileLayer } from '../components/map/ReliableTileLayer'
import { MAP_CONFIG, URGENCY_COLORS } from '../utils/mapConfig'
import 'leaflet/dist/leaflet.css'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.72)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  overflow: 'hidden',
}

const DISPLAY_METRICS = {
  totalNeeds: 214,
  activeVolunteers: 47,
  todayDispatches: 38,
  dispatchSuccess: 89,
} as const

// CRITICAL: This useEffect must run after MapContainer mounts
// It forces tile reload if initial load fails
function MapInitializer() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])
  return null
}

type NeedCardModel = Need & { wardName?: string, reportCount?: number }

const MOCK_NEEDS: NeedCardModel[] = [
  { id:'1', category:'MEDICAL', urgency:'CRITICAL', wardName:'Dharavi', 
    description:'Elderly resident needs insulin, caretaker unavailable', reportCount:38 } as NeedCardModel,
  { id:'2', category:'FOOD', urgency:'HIGH', wardName:'Kurla East', 
    description:'Food shortage affecting 200+ families in the area', reportCount:27 } as NeedCardModel,
  { id:'3', category:'SHELTER', urgency:'HIGH', wardName:'Govandi', 
    description:'Temporary shelter required — 3 families displaced after flooding', reportCount:19 } as NeedCardModel,
  { id:'4', category:'EDUCATION', urgency:'MEDIUM', wardName:'Mankhurd', 
    description:'School supplies and tutoring volunteers urgently needed', reportCount:14 } as NeedCardModel,
  { id:'5', category:'MEDICAL', urgency:'CRITICAL', wardName:'Bandra West', 
    description:'Mental health support camp — 31 residents waiting', reportCount:31 } as NeedCardModel,
]

export function Dashboard() {
  const { data: needsData } = useNeeds()
  const [weatherBanner, setWeatherBanner] = useState<string>('')

  const needs = useMemo<NeedCardModel[]>(() => {
    if (Array.isArray(needsData) && needsData.length > 0) {
      return needsData as NeedCardModel[]
    }
    return MOCK_NEEDS
  }, [needsData])

  useEffect(() => {
    let active = true
    getMumbaiWeather()
      .then((w) => {
        if (!active) return
        if (w.alertBanner) {
          setWeatherBanner('Weather Alert: Heavy rains expected in Mumbai. Prioritize shelter and medical dispatches.')
        } else {
          setWeatherBanner('Weather Update: Moderate conditions in Mumbai. Field operations running normal priority.')
        }
      })
      .catch(() => {
        setWeatherBanner('Weather Update: Live weather unavailable, using operational defaults.')
      })
    return () => {
      active = false
    }
  }, [])

  const marqueeItems = [
    `${DISPLAY_METRICS.totalNeeds} total needs monitored`,
    `${DISPLAY_METRICS.activeVolunteers} active volunteers online`,
    `${DISPLAY_METRICS.todayDispatches} dispatches completed today`,
    `${DISPLAY_METRICS.dispatchSuccess}% dispatch success ratio`,
  ]

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={glassCard}>
          <div style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 158, 0, 0.08)',
          }}>
            <div style={{
              display: 'inline-block',
              minWidth: '100%',
              fontSize: '13px',
              color: '#D9D9D9',
              letterSpacing: '0.02em',
              animation: 'ticker-scroll 26s linear infinite',
            }}>
              {marqueeItems.join('   |   ')}
            </div>
          </div>

          <div style={{
            padding: '10px 16px',
            background: 'rgba(217,217,217,0.05)',
            borderBottom: '1px solid rgba(217,217,217,0.12)',
            fontSize: '12px',
            color: '#D9D9D9',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            {weatherBanner}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', padding: '16px' }}>
            {[
              { title: 'TOTAL NEEDS', value: DISPLAY_METRICS.totalNeeds, border: '#FF9E00' },
              { title: 'ACTIVE VOLUNTEERS', value: DISPLAY_METRICS.activeVolunteers, border: '#C77DFF' },
              { title: 'TODAY DISPATCHES', value: DISPLAY_METRICS.todayDispatches, border: '#6EE7B7' },
              { title: 'DISPATCH SUCCESS', value: `${DISPLAY_METRICS.dispatchSuccess}%`, border: '#D9D9D9' },
            ].map((card) => (
              <div key={card.title} style={{ border: '1px solid rgba(255,158,0,0.18)', borderLeft: `3px solid ${card.border}`, borderRadius: '12px', padding: '14px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '32px', color: '#FFFFFF', fontWeight: 500 }}>{card.value}</div>
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'rgba(217,217,217,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.title}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ height:1, background:'rgba(255,158,0,0.08)', margin:'24px 0' }}/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={glassCard}>
              <div style={{ padding: '16px 18px 0 18px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#FFFFFF', marginBottom: '12px' }}>Mumbai Relief Overview</h3>
              </div>
              <div style={{ padding: '0 18px 18px 18px' }}>
                <div style={{
                  height: '320px',
                  width: '100%', 
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  // CRITICAL: isolate from background layer z-index
                  zIndex: 2,
                  isolation: 'isolate',
                }}>
                  <MapContainer
                    center={MAP_CONFIG.MUMBAI_CENTER}
                    zoom={MAP_CONFIG.MUMBAI_ZOOM}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    scrollWheelZoom={false}
                    attributionControl={false}
                  >
                    <MapInitializer />
                    <ReliableTileLayer />
                    {MAP_CONFIG.WARDS.map(ward => (
                      <Circle
                        key={ward.id}
                        center={[ward.lat, ward.lng]}
                        radius={ward.needs * 22}
                        pathOptions={{
                          color: URGENCY_COLORS[ward.urgency],
                          fillColor: URGENCY_COLORS[ward.urgency],
                          fillOpacity: 0.3,
                          weight: 2,
                          opacity: 0.9,
                        }}
                      >
                        <Tooltip permanent direction="top" offset={[0, -8]}>
                          <span>{ward.name} · {ward.needs} needs</span>
                        </Tooltip>
                      </Circle>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </div>

            <div style={glassCard}>
              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#FFFFFF', marginBottom: '12px' }}>Urgent Needs</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {needs.slice(0, 3).map((need) => (
                    <NeedCard key={need.id} need={need} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ ...glassCard, minHeight: 'auto', paddingBottom: '0' }}>
            <LiveFeed />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
