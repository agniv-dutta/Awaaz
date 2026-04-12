import { useState, useMemo } from 'react';
import { Search } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { PageWrapper } from '../components/layout/PageWrapper'
import { VolunteerCard } from '../components/volunteers/VolunteerCard'
import { useVolunteers } from '../hooks/useVolunteers'
import type { Volunteer } from '../types'

// Extend Volunteer for mock data as the name is stored in User table in DB
interface VolunteerWithUser extends Volunteer {
  name: string;
  ward: string;
  initials: string;
  available: boolean;
  distance: string;
}

const MOCK_VOLUNTEERS: VolunteerWithUser[] = [
  {
    id: '1',
    name: 'Rahul Kulkarni',
    ward: 'Dharavi Ward',
    initials: 'RK',
    available: true,
    distance: '1.2 km',
    skills: ['MEDICAL', 'LOGISTICS'],
    is_active: true,
    reliability_score: 0.92,
    home_ward_id: '1',
    completed_tasks: 12,
    user_id: 'u1',
    current_lat: 19.1,
    current_lng: 72.8,
    max_radius_km: 5,
    created_at: '',
    updated_at: '',
    languages: [],
    availability_schedule: {
      mon: ['09:00–13:00', '15:00–19:00'],
      tue: ['09:00–13:00'],
      wed: [],
      thu: ['10:00–18:00'],
      fri: ['09:00–13:00', '15:00–19:00'],
      sat: ['10:00–14:00'],
      sun: [],
    } as any,
  },
  {
    id: '2',
    name: 'Ananya Sharma',
    ward: 'Kurla East Ward',
    initials: 'AS',
    available: true,
    distance: '0.8 km',
    skills: ['TEACHING', 'TRANSLATION'],
    is_active: true,
    reliability_score: 0.87,
    home_ward_id: '2',
    completed_tasks: 8,
    user_id: 'u2',
    current_lat: 19.2,
    current_lng: 72.9,
    max_radius_km: 5,
    created_at: '',
    updated_at: '',
    languages: [],
    availability_schedule: {
      mon: ['10:00–18:00'],
      tue: ['10:00–18:00'],
      wed: ['10:00–18:00'],
      thu: [],
      fri: ['10:00–18:00'],
      sat: ['09:00–17:00'],
      sun: ['09:00–12:00'],
    } as any,
  },
  {
    id: '3',
    name: 'Devraj Patil',
    ward: 'Govandi Ward',
    initials: 'DP',
    available: false,
    distance: '1.9 km',
    skills: ['LOGISTICS', 'COOKING'],
    is_active: false,
    reliability_score: 0.78,
    home_ward_id: '3',
    completed_tasks: 5,
    user_id: 'u3',
    current_lat: 19.3,
    current_lng: 73.0,
    max_radius_km: 5,
    created_at: '',
    updated_at: '',
    languages: [],
    availability_schedule: {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    } as any,
  },
  {
    id: '4',
    name: 'Meera Iyer',
    ward: 'Bandra West Ward',
    initials: 'MI',
    available: true,
    distance: '2.1 km',
    skills: ['LEGAL', 'MEDICAL'],
    is_active: true,
    reliability_score: 0.95,
    home_ward_id: '4',
    completed_tasks: 15,
    user_id: 'u4',
    current_lat: 19.4,
    current_lng: 73.1,
    max_radius_km: 5,
    created_at: '',
    updated_at: '',
    languages: [],
    availability_schedule: {
      mon: ['08:00–17:00'],
      tue: ['08:00–17:00'],
      wed: ['08:00–17:00'],
      thu: ['08:00–17:00'],
      fri: ['08:00–17:00'],
      sat: [],
      sun: [],
    } as any,
  },
  {
    id: '5',
    name: 'Siddharth Nair',
    ward: 'Borivali Ward',
    initials: 'SN',
    available: true,
    distance: '0.5 km',
    skills: ['MEDICAL', 'LOGISTICS'],
    is_active: true,
    reliability_score: 0.89,
    home_ward_id: '5',
    completed_tasks: 9,
    user_id: 'u5',
    current_lat: 19.5,
    current_lng: 73.2,
    max_radius_km: 5,
    created_at: '',
    updated_at: '',
    languages: [],
    availability_schedule: {
      mon: ['15:00–21:00'],
      tue: ['15:00–21:00'],
      wed: ['15:00–21:00'],
      thu: ['15:00–21:00'],
      fri: ['15:00–21:00'],
      sat: ['10:00–21:00'],
      sun: ['10:00–21:00'],
    } as any,
  },
  {
    id: '6',
    name: 'Priya Desai',
    ward: 'Mankhurd Ward',
    initials: 'PD',
    available: false,
    distance: '1.5 km',
    skills: ['TEACHING', 'COOKING'],
    is_active: false,
    reliability_score: 0.73,
    home_ward_id: '1',
    completed_tasks: 4,
    user_id: 'u6',
    current_lat: 19.6,
    current_lng: 73.3,
    max_radius_km: 5,
    created_at: '',
    updated_at: '',
    languages: [],
    availability_schedule: {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    } as any,
  },
]

const allSkills = ['MEDICAL', 'LOGISTICS', 'TEACHING', 'COOKING', 'LEGAL', 'TRANSLATION']

export function Volunteers() {
  const { data: volunteers } = useVolunteers()
  const [search, setSearch] = useState('')
  const [activeSkills, setActiveSkills] = useState<string[]>([])
  const [selectedVol, setSelectedVol] = useState<VolunteerWithUser | null>(null)

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const list = useMemo(() => {
    const dataSource = volunteers && volunteers.length > 0 ? (volunteers as VolunteerWithUser[]) : MOCK_VOLUNTEERS
    return dataSource.filter(v => {
      const matchSearch = (v.name || '').toLowerCase().includes(search.toLowerCase())
      const matchSkills = activeSkills.length === 0 || activeSkills.some(s => v.skills.includes(s))
      return matchSearch && matchSkills
    })
  }, [volunteers, search, activeSkills])

  return (
    <PageWrapper noPadding>
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Main content area with grid */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '28px 32px',
          transition: 'margin-right 0.3s ease',
          marginRight: selectedVol ? '420px' : '0',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Volunteers</h1>
              <p style={{ fontSize: '15px', color: '#D9D9D9', marginTop: '4px' }}>Browse and assign community volunteers</p>
            </div>

            {/* Search + filter chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Search box */}
              <div style={{ position: 'relative', maxWidth: '420px' }}>
                <Search style={{
                  position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                  width: '18px', height: '18px', color: 'rgba(217, 217, 217, 0.45)',
                }} />
                <input
                  placeholder="Search volunteers by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    height: '48px',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(217, 217, 217, 0.15)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255, 158, 0, 0.4)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(217, 217, 217, 0.15)')}
                />
              </div>

              {/* Skill filter chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {allSkills.map(skill => {
                  const isActive = activeSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s',
                        background: isActive ? 'rgba(255, 158, 0, 0.12)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(255, 158, 0, 0.5)' : 'rgba(217, 217, 217, 0.2)'}`,
                        color: isActive ? '#FF9E00' : 'rgba(217, 217, 217, 0.55)',
                      }}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Volunteer grid */}
            {list.length === 0 ? (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                  {[1, 2, 3].map(i => <div key={i} style={{ width: i === 2 ? '10px' : '8px', height: i === 2 ? '10px' : '8px', borderRadius: '50%', background: '#FF9E00' }} />)}
                </div>
                <div style={{ fontSize: '18px', color: '#D9D9D9', fontWeight: 500 }}>No results found</div>
                <div style={{ fontSize: '14px', color: 'rgba(217, 217, 217, 0.45)', marginTop: '4px' }}>Try adjusting your search or filters</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', paddingBottom: '32px' }}>
                {list.map(vol => (
                  <VolunteerCard
                    key={vol.id}
                    volunteer={vol as any}
                    onClick={() => setSelectedVol(vol)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed right detail drawer */}
        <AnimatePresence>
          {selectedVol && (
            <div style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '420px',
              background: 'rgba(15, 10, 5, 0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255, 158, 0, 0.2)',
              zIndex: 50,
              overflowY: 'auto',
              padding: '28px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}>
              {/* Close button */}
              <button
                onClick={() => setSelectedVol(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 158, 0, 0.1)',
                  border: '1px solid rgba(255, 158, 0, 0.2)',
                  borderRadius: '8px',
                  color: '#D9D9D9',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              >
                ✕ Close
              </button>

              {/* Volunteer header with avatar */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(199, 125, 255, 0.15)',
                  border: '2px solid rgba(199, 125, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: '#C77DFF',
                }}>
                  {selectedVol.initials}
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 500, color: '#FFFFFF' }}>{selectedVol.name}</div>
                  <div style={{ fontSize: '13px', color: '#D9D9D9', marginTop: '2px' }}>{selectedVol.ward}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: selectedVol.available ? '#4ade80' : 'rgba(217, 217, 217, 0.25)',
                    }} />
                    <span style={{
                      fontSize: '12px',
                      color: selectedVol.available ? '#4ade80' : 'rgba(217, 217, 217, 0.45)',
                    }}>
                      {selectedVol.available ? 'Available today' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills section */}
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#D9D9D9',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Skills
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedVol.skills.map(skill => (
                    <span key={skill} style={{
                      background: 'rgba(255, 158, 0, 0.1)',
                      color: '#D9D9D9',
                      border: '1px solid rgba(255, 158, 0, 0.2)',
                      borderRadius: '6px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      letterSpacing: '0.04em',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weekly availability schedule */}
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#D9D9D9',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  Weekly Availability
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => {
                    const dayLabels = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }
                    const schedule = (selectedVol.availability_schedule as any)?.[day] || []
                    return (
                      <div
                        key={day}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '8px 0',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <div style={{ width: '40px', flexShrink: 0, fontSize: '13px', color: '#D9D9D9', fontWeight: 500 }}>
                          {dayLabels[day]}
                        </div>
                        {schedule.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {schedule.map((slot: string, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  background: 'rgba(255, 158, 0, 0.12)',
                                  border: '1px solid rgba(255, 158, 0, 0.25)',
                                  color: '#FF9E00',
                                  fontSize: '11px',
                                  padding: '2px 10px',
                                  borderRadius: '20px',
                                }}
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px', color: 'rgba(217, 217, 217, 0.25)' }}>—</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Tasks done', value: selectedVol.completed_tasks },
                  { label: 'Reliability', value: Math.round(selectedVol.reliability_score * 100) + '%' },
                  { label: 'Distance', value: selectedVol.distance },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 158, 0, 0.06)',
                      border: '1px solid rgba(255, 158, 0, 0.15)',
                      borderRadius: '10px',
                      padding: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', fontWeight: 500, color: '#FF9E00' }}>{stat.value}</div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(217, 217, 217, 0.5)',
                      marginTop: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 158, 0, 0.12)',
              }}>
                <button style={{
                  flex: 1,
                  height: '46px',
                  background: 'transparent',
                  border: '1px solid rgba(217, 217, 217, 0.2)',
                  borderRadius: '10px',
                  color: '#D9D9D9',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                }}>
                  Contact
                </button>
                <button style={{
                  flex: 2,
                  height: '46px',
                  background: '#FF9E00',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#1A1A1A',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Assign to Need →
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}
