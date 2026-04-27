import { useEffect, useMemo, useState } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { NeedCard } from '../components/needs/NeedCard'
import { LiveFeed } from '../components/realtime/LiveFeed'
import { useNeeds } from '../hooks/useNeeds'
import { useAnalyticsSummary } from '../hooks/useAnalytics'
import type { Need } from '../types'
import { getMumbaiWeather } from '../services/weather'

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
                  height: '280px',
                  border: '1px solid rgba(217,217,217,0.12)',
                  borderRadius: '12px',
                  background: 'rgba(10,7,4,0.6)',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="none">
                    {/* Dharavi */}
                    <rect x="10" y="10" width="180" height="120" fill="rgba(255,158,0,0.15)" stroke="rgba(255,158,0,0.3)" strokeWidth="1" rx="8" />
                    <text x="25" y="40" fill="#FFFFFF" fontSize="14" fontWeight="500">Dharavi</text>
                    <text x="25" y="60" fill="#FF9E00" fontSize="12">38 Needs</text>
                    
                    {/* Kurla East */}
                    <rect x="200" y="10" width="190" height="80" fill="rgba(199,125,255,0.1)" stroke="rgba(199,125,255,0.2)" strokeWidth="1" rx="8" />
                    <text x="215" y="40" fill="#FFFFFF" fontSize="14" fontWeight="500">Kurla East</text>
                    <text x="215" y="60" fill="#C77DFF" fontSize="12">27 Needs</text>

                    {/* Govandi */}
                    <rect x="200" y="100" width="190" height="170" fill="rgba(217,217,217,0.05)" stroke="rgba(217,217,217,0.15)" strokeWidth="1" rx="8" />
                    <text x="215" y="130" fill="#FFFFFF" fontSize="14" fontWeight="500">Govandi</text>
                    <text x="215" y="150" fill="#D9D9D9" fontSize="12">19 Needs</text>

                    {/* Mankhurd */}
                    <rect x="10" y="140" width="85" height="130" fill="rgba(217,217,217,0.05)" stroke="rgba(217,217,217,0.15)" strokeWidth="1" rx="8" />
                    <text x="20" y="170" fill="#FFFFFF" fontSize="12" fontWeight="500">Mankhurd</text>
                    <text x="20" y="190" fill="#D9D9D9" fontSize="10">14 Needs</text>

                    {/* Bandra West */}
                    <rect x="105" y="140" width="85" height="130" fill="rgba(255,158,0,0.1)" stroke="rgba(255,158,0,0.25)" strokeWidth="1" rx="8" />
                    <text x="115" y="170" fill="#FFFFFF" fontSize="12" fontWeight="500">Bandra W.</text>
                    <text x="115" y="190" fill="#FF9E00" fontSize="10">31 Needs</text>
                  </svg>
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

          <div style={{ ...glassCard, minHeight: '100%' }}>
            <LiveFeed />
          </div>
        </div>

        <div style={{ height:1, background:'rgba(255,158,0,0.08)', margin:'24px 0' }}/>

        <div style={glassCard}>
          <div style={{ padding: '16px 18px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 500,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
            }}>
              About Awaaz
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {[
                {
                  title: 'Disaster Mapping',
                  description: 'Visualize live crisis zones and resource demand across wards.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 4.5L10 3L14 4.5L18 3V19.5L14 21L10 19.5L6 21V4.5Z" stroke="#D9D9D9" strokeWidth="1.5"/>
                      <path d="M10 3V19.5" stroke="#D9D9D9" strokeWidth="1.5"/>
                      <path d="M14 4.5V21" stroke="#D9D9D9" strokeWidth="1.5"/>
                    </svg>
                  ),
                },
                {
                  title: 'Needs Aggregation',
                  description: 'Cluster duplicate reports into clear, actionable need signals.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 7.5H14" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M4 12H20" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 16.5H20" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  title: 'Volunteer Matching',
                  description: 'Pair verified volunteers to urgent requests using AI + proximity.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5Z" stroke="#D9D9D9" strokeWidth="1.5"/>
                      <path d="M16.5 10.5C18.1569 10.5 19.5 9.15685 19.5 7.5C19.5 5.84315 18.1569 4.5 16.5 4.5C14.8431 4.5 13.5 5.84315 13.5 7.5C13.5 9.15685 14.8431 10.5 16.5 10.5Z" stroke="#D9D9D9" strokeWidth="1.5"/>
                      <path d="M3.5 19.5C4.4 16.9 6.4 15.5 8.9 15.5H10.1C12.6 15.5 14.6 16.9 15.5 19.5" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M14.5 19.5C15.1 17.9 16.5 17 18.2 17H18.9C20 17 21 17.4 21.7 18.2" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ),
                },
                {
                  title: 'Real-time Coordination',
                  description: 'Broadcast updates instantly so teams can react without delay.',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 4.5C15.5899 4.5 18.5 7.41015 18.5 11C18.5 15.5 12 20.5 12 20.5C12 20.5 5.5 15.5 5.5 11C5.5 7.41015 8.41015 4.5 12 4.5Z" stroke="#D9D9D9" strokeWidth="1.5"/>
                      <path d="M12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z" fill="#D9D9D9"/>
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    border: '1px solid rgba(217,217,217,0.16)',
                    borderRadius: '12px',
                    padding: '14px',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.2s, transform 0.2s',
                  }}
                >
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid rgba(217,217,217,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: '14px', color: '#D9D9D9', lineHeight: 1.6, marginTop: '6px' }}>{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
