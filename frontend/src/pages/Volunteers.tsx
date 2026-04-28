import { useEffect, useMemo, useState } from 'react';
import { Search, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageWrapper } from '../components/layout/PageWrapper'
import { VolunteerCard } from '../components/volunteers/VolunteerCard'
import type { Volunteer } from '../types'
import { getVolunteerInsight } from '../services/ai'
import { MapContainer, Circle, Tooltip, useMap } from 'react-leaflet'
import { ReliableTileLayer } from '../components/map/ReliableTileLayer'
import { MAP_CONFIG } from '../utils/mapConfig'
import 'leaflet/dist/leaflet.css'

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

// Extend Volunteer for mock data as the name is stored in User table in DB
interface VolunteerWithUser extends Volunteer {
  name: string;
  ward: string;
  initials: string;
  available: boolean;
  distance: string;
  lat: number;
  lng: number;
  reliability_score: number;
  completedTasks: number;
}

const MOCK_VOLUNTEERS: VolunteerWithUser[] = [
  { 
    id:'1', name:'Rahul Kulkarni',  initials:'RK', 
    lat:19.0398, lng:72.8514,  // Dharavi
    ward:'Dharavi Ward', skills:['MEDICAL','LOGISTICS'], 
    available:true, reliability_score:0.92, distance:'1.2km', completedTasks:9,
    availability_schedule:{ mon:['09:00–13:00','15:00–19:00'], tue:['09:00–13:00'], 
      wed:[], thu:['10:00–18:00'], fri:['09:00–13:00'], sat:['10:00–14:00'], sun:[] },
    is_active: true, home_ward_id: '1', completed_tasks: 12, user_id: 'u1',
    current_lat: 19.0398, current_lng: 72.8514, max_radius_km: 5,
    created_at: '', updated_at: '', languages: []
  },
  
  { 
    id:'2', name:'Ananya Sharma', initials:'AN',
    lat:19.0728, lng:72.8826,  // Kurla
    ward:'Kurla East Ward', skills:['TEACHING','TRANSLATION'],
    available:true, reliability_score:0.87, distance:'2.4km', completedTasks:7,
    availability_schedule:{ mon:['10:00–14:00'], tue:['10:00–14:00','16:00–20:00'],
      wed:['10:00–14:00'], thu:[], fri:['10:00–18:00'], sat:[], sun:['11:00–15:00'] },
    is_active: true, home_ward_id: '2', completed_tasks: 8, user_id: 'u2',
    current_lat: 19.0728, current_lng: 72.8826, max_radius_km: 5,
    created_at: '', updated_at: '', languages: []
  },
  
  { 
    id:'3', name:'Devraj Patil', initials:'DE',
    lat:19.0474, lng:72.9195,  // Govandi
    ward:'Govandi Ward', skills:['LOGISTICS','COOKING'],
    available:false, reliability_score:0.78, distance:'3.1km', completedTasks:5,
    availability_schedule:{ mon:[], tue:['15:00–21:00'], wed:['15:00–21:00'],
      thu:['15:00–21:00'], fri:['15:00–21:00'], sat:['10:00–21:00'], sun:['10:00–21:00'] },
    is_active: false, home_ward_id: '3', completed_tasks: 5, user_id: 'u3',
    current_lat: 19.0474, current_lng: 72.9195, max_radius_km: 5,
    created_at: '', updated_at: '', languages: []
  },
  
  { 
    id:'4', name:'Meera Iyer', initials:'ME',
    lat:19.0596, lng:72.8295,  // Bandra
    ward:'Bandra West Ward', skills:['LEGAL','MEDICAL'],
    available:true, reliability_score:0.95, distance:'0.8km', completedTasks:12,
    availability_schedule:{ mon:['09:00–13:00'], tue:['09:00–13:00'],
      wed:['09:00–13:00'], thu:['09:00–13:00'], fri:['09:00–13:00'], sat:[], sun:[] },
    is_active: true, home_ward_id: '4', completed_tasks: 15, user_id: 'u4',
    current_lat: 19.0596, current_lng: 72.8295, max_radius_km: 5,
    created_at: '', updated_at: '', languages: []
  },
  
  { 
    id:'5', name:'Siddharth Nair', initials:'SN',
    lat:19.0550, lng:72.8380,  // Near Bandra
    ward:'Borivali Ward', skills:['MEDICAL','TECH'],
    available:true, reliability_score:0.89, distance:'1.7km', completedTasks:8,
    availability_schedule:{ mon:['14:00–20:00'], tue:['14:00–20:00'],
      wed:[], thu:['14:00–20:00'], fri:['14:00–20:00'], sat:['10:00–18:00'], sun:[] },
    is_active: true, home_ward_id: '5', completed_tasks: 10, user_id: 'u5',
    current_lat: 19.0550, current_lng: 72.8380, max_radius_km: 5,
    created_at: '', updated_at: '', languages: []
  },
  
  { 
    id:'6', name:'Priya Desai', initials:'PD',
    lat:19.0444, lng:72.9347,  // Mankhurd
    ward:'Mankhurd Ward', skills:['TEACHING','COOKING'],
    available:false, reliability_score:0.73, distance:'4.2km', completedTasks:4,
    availability_schedule:{ mon:[], tue:[], wed:['11:00–17:00'],
      thu:['11:00–17:00'], fri:[], sat:['09:00–15:00'], sun:['09:00–15:00'] },
    is_active: false, home_ward_id: '6', completed_tasks: 4, user_id: 'u6',
    current_lat: 19.0444, current_lng: 72.9347, max_radius_km: 5,
    created_at: '', updated_at: '', languages: []
  },
]

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.72)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

export default function VolunteersPage() {
  // Use mock data directly for demo mode
  const volunteers = MOCK_VOLUNTEERS
  const isLoading = false
  const error = null
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerWithUser | null>(null)
  const [view, setView] = useState<'grid'|'map'>('grid')
  const [skillFilter, setSkillFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v: any) => {
      const matchesSearch = (v.name && v.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (v.ward && v.ward.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          v.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesSkill = skillFilter === 'all' || v.skills.includes(skillFilter.toUpperCase())
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && v.available) ||
        (availabilityFilter === 'unavailable' && !v.available)
      return matchesSearch && matchesSkill && matchesAvailability
    })
  }, [volunteers, searchTerm, skillFilter, availabilityFilter])

  const insight = useMemo(() => {
    if (filteredVolunteers.length === 0 || selectedVolunteer === null) return null
    return getVolunteerInsight(selectedVolunteer as any, [])
  }, [selectedVolunteer])

  const allSkills = useMemo(() => {
    const skills = new Set<string>()
    volunteers.forEach((v: VolunteerWithUser) => v.skills.forEach((s: string) => skills.add(s)))
    return Array.from(skills).sort()
  }, [volunteers])

  if (isLoading) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ fontSize: 18, color: '#FF9E00' }}>Loading volunteers...</div>
        </div>
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ fontSize: 18, color: '#E05A00' }}>Error loading volunteers</div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
            Volunteers
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(217, 217, 217, 0.7)', marginBottom: '24px' }}>
            {filteredVolunteers.length} volunteer{filteredVolunteers.length !== 1 ? 's' : ''} available
          </p>
          
          {/* View toggle */}
          <div style={{ display:'inline-flex', background:'rgba(0,0,0,0.3)',
                        border:'1px solid rgba(255,158,0,0.15)', borderRadius:10,
                        padding:4, gap:4, marginBottom:20 }}>
            {(['grid','map'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding:'8px 20px', borderRadius:8, fontSize:13, cursor:'pointer',
                border:'none', transition:'all 0.15s',
                background: view === v ? '#FF9E00' : 'transparent',
                color: view === v ? '#1A1A1A' : '#D9D9D9',
                fontWeight: view === v ? 500 : 400,
              }}>
                {v === 'grid' ? '⊞ Grid' : '🗺 Map'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ ...glassCard, padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(217, 217, 217, 0.5)' }} />
              <input
                type="text"
                placeholder="Search volunteers, skills, wards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 158, 0, 0.2)',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
            </div>
            
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 158, 0, 0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none'
              }}
            >
              <option value="all">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              style={{
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 158, 0, 0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none'
              }}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Map View */}
        {view === 'map' && (
          <div style={{ height:'calc(100vh - 280px)', borderRadius:14, 
                    overflow:'hidden', position:'relative', zIndex:2 }}>
            <MapContainer
              center={MAP_CONFIG.MUMBAI_CENTER}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <MapInitializer />
              <ReliableTileLayer />
              {MOCK_VOLUNTEERS.map(v => (
                <Circle
                  key={v.id}
                  center={[v.lat, v.lng]}
                  radius={300}
                  pathOptions={{
                    color: '#C77DFF',
                    fillColor: '#C77DFF',
                    fillOpacity: v.available ? 0.6 : 0.2,
                    weight: 2,
                    opacity: v.available ? 0.9 : 0.4,
                    dashArray: v.available ? undefined : '4 4',
                  }}
                  eventHandlers={{ click: () => setSelectedVolunteer(v) }}
                >
                  <Tooltip direction="top" offset={[0, -8]}>
                    <div>
                      <div style={{fontWeight:600, fontSize:13}}>{v.name}</div>
                      <div style={{fontSize:11, opacity:0.7}}>{v.skills.join(' · ')}</div>
                      <div style={{fontSize:11, color: v.available ? '#4ade80' : 'rgba(217,217,217,0.4)'}}>
                        {v.available ? '● Available' : '○ Unavailable'}
                      </div>
                    </div>
                  </Tooltip>
                </Circle>
              ))}
            </MapContainer>
          </div>
        )}

        {/* Grid View */}
        {view === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <AnimatePresence>
              {filteredVolunteers.map((volunteer: VolunteerWithUser) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  onClick={() => setSelectedVolunteer(volunteer)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Selected Volunteer Modal */}
        <AnimatePresence>
          {selectedVolunteer && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
              }}
              onClick={() => setSelectedVolunteer(null)}
            >
              <motion.div
                style={glassCard}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ padding: '24px', minWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                        {selectedVolunteer.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(217, 217, 217, 0.7)' }}>
                        {selectedVolunteer.ward} • {selectedVolunteer.distance}
                      </p>
                    </div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: selectedVolunteer.available ? 'rgba(74, 222, 128, 0.2)' : 'rgba(217, 217, 217, 0.1)',
                      border: `1px solid ${selectedVolunteer.available ? '#4ade80' : 'rgba(217, 217, 217, 0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: selectedVolunteer.available ? '#4ade80' : 'rgba(217, 217, 217, 0.6)'
                    }}>
                      {selectedVolunteer.initials}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', color: 'rgba(217, 217, 217, 0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Skills
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedVolunteer.skills.map(skill => (
                        <span key={skill} style={{
                          background: 'rgba(255, 158, 0, 0.1)',
                          border: '1px solid rgba(255, 158, 0, 0.3)',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          color: '#FF9E00',
                          fontWeight: 500
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <div style={{ fontSize: '13px', color: 'rgba(217, 217, 217, 0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Reliability
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>
                        {(selectedVolunteer.reliability_score * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: 'rgba(217, 217, 217, 0.5)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Completed Tasks
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF' }}>
                        {selectedVolunteer.completedTasks}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: selectedVolunteer.available ? '#FF9E00' : 'rgba(217, 217, 217, 0.1)',
                        border: `1px solid ${selectedVolunteer.available ? '#FF9E00' : 'rgba(217, 217, 217, 0.3)'}`,
                        borderRadius: '10px',
                        color: selectedVolunteer.available ? '#1A1A1A' : 'rgba(217, 217, 217, 0.6)',
                        fontSize: '15px',
                        fontWeight: 500,
                        cursor: selectedVolunteer.available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                      }}
                      disabled={!selectedVolunteer.available}
                    >
                      {selectedVolunteer.available ? 'Dispatch Volunteer' : 'Currently Unavailable'}
                    </button>
                    <button
                      onClick={() => setSelectedVolunteer(null)}
                      style={{
                        padding: '12px 24px',
                        background: 'transparent',
                        border: '1px solid rgba(217, 217, 217, 0.3)',
                        borderRadius: '10px',
                        color: 'rgba(217, 217, 217, 0.8)',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* AI Insight */}
        {insight && view === 'grid' && (
          <div style={{ ...glassCard, padding: '20px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Users size={20} style={{ color: '#FF9E00' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#FFFFFF' }}>AI Insight</h3>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(217, 217, 217, 0.8)', lineHeight: 1.6 }}>
              {insight}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
