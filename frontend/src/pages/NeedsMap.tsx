import { useState, useEffect } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { useMapStore } from '../store/mapStore'
import { useIsMobile } from '../hooks/useIsMobile'
import { MapContainer, Circle, Tooltip, Popup, useMap } from 'react-leaflet'
import { ReliableTileLayer } from '../components/map/ReliableTileLayer'
import { MAP_CONFIG, URGENCY_COLORS } from '../utils/mapConfig'
import 'leaflet/dist/leaflet.css'
import { needs } from '../mocks/data/needs'
import { volunteers } from '../mocks/data/volunteers'

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

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.72)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}


export function NeedsMap() {
  const isMobile = useIsMobile(980)
  const selectedWard = useMapStore((s) => s.selectedWardId)
  const wards = useMapStore((s) => s.wards)
  const [selectedNeed, setSelectedNeed] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterUrgency, setFilterUrgency] = useState('All')

  const filteredNeeds = needs.filter(need => {
    const categoryMatch = filterCategory === 'All' || need.category === filterCategory
    const urgencyMatch = filterUrgency === 'All' || need.urgency === filterUrgency
    return categoryMatch && urgencyMatch && need.status === 'OPEN'
  })

  const activeVolunteers = volunteers.filter(v => v.is_active && v.current_lat)

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 500 }}>Needs Map</h1>
          <p style={{ fontSize: '14px', color: '#D9D9D9', marginTop: '4px' }}>
            Real-time interactive map of community needs and volunteer locations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px', gap: '18px' }}>
          <div style={{ 
            height: 'calc(100vh - 120px)', 
            width: '100%', 
            overflow: 'hidden',
            border: '1px solid rgba(255,158,0,0.18)',
            zIndex: 1,
            position: 'relative',
            isolation: 'isolate'
          }}>
            <MapContainer 
              center={MAP_CONFIG.MUMBAI_CENTER}
              zoom={MAP_CONFIG.MUMBAI_ZOOM}
              style={{ height: '100%', width: '100%' }}
              attributionControl={false}
            >
              <MapInitializer />
              <ReliableTileLayer />
              
              {/* Heatmap circles per ward */}
              {MAP_CONFIG.WARDS.map(ward => (
                <Circle key={ward.id} center={[ward.lat, ward.lng]} 
                  radius={ward.needs * 25}
                  pathOptions={{ 
                    color: URGENCY_COLORS[ward.urgency], 
                    fillColor: URGENCY_COLORS[ward.urgency], 
                    fillOpacity:0.2, weight:1.5 }}
                />
              ))}
              
              {/* Individual need markers */}
              {filteredNeeds.map(need => (
                <Circle key={need.id}
                  center={[need.location_lat!, need.location_lng!]}
                  radius={200}
                  pathOptions={{
                    color: need.urgency==='CRITICAL' ? '#FF9E00' : 
                           need.urgency==='HIGH' ? '#E05A00' : '#C77DFF',
                    fillOpacity: 0.6, weight: 2
                  }}
                  eventHandlers={{ click: () => setSelectedNeed(need) }}
                >
                  <Tooltip>{need.ward_id} — {need.category}</Tooltip>
                </Circle>
              ))}
              
              {/* Volunteer location markers */}
              {activeVolunteers.map(v => (
                <Circle key={v.id} center={[v.current_lat!, v.current_lng!]} radius={150}
                  pathOptions={{ color:'#C77DFF', fillColor:'#C77DFF', fillOpacity:0.5, weight:2 }}
                >
                  <Tooltip>{v.name} — {v.skills[0]}</Tooltip>
                </Circle>
              ))}
            </MapContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Left Panel - Filters */}
            <div style={{ ...glassCard, padding: '20px' }}>
              <h3 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 500, marginBottom: '16px' }}>
                Filter needs
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#D9D9D9', marginBottom: '8px' }}>Category</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['All', 'FOOD', 'MEDICAL', 'SHELTER', 'EDUCATION', 'LEGAL', 'MENTAL_HEALTH'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        border: filterCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        background: filterCategory === cat ? '#FF9E00' : 'transparent',
                        color: filterCategory === cat ? '#1A1A1A' : '#D9D9D9',
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#D9D9D9', marginBottom: '8px' }}>Urgency</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(urg => (
                    <button
                      key={urg}
                      onClick={() => setFilterUrgency(urg)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        border: filterUrgency === urg ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        background: filterUrgency === urg ? '#FF9E00' : 'transparent',
                        color: filterUrgency === urg ? '#1A1A1A' : '#D9D9D9',
                        cursor: 'pointer'
                      }}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid rgba(255,158,0,0.08)', 
                paddingTop: '12px',
                fontSize: '13px', 
                color: '#D9D9D9' 
              }}>
                {filteredNeeds.length} active needs
              </div>
            </div>

            {/* Right Panel - Need Details */}
            {selectedNeed && (
              <div style={{ ...glassCard, padding: '20px' }}>
                <h3 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 500, marginBottom: '12px' }}>
                  Need Details
                </h3>
                <div style={{ fontSize: '13px', color: '#D9D9D9', lineHeight: 1.6 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Category:</strong> {selectedNeed.category}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Urgency:</strong> <span style={{ 
                      color: selectedNeed.urgency === 'CRITICAL' ? '#FF9E00' : 
                             selectedNeed.urgency === 'HIGH' ? '#E05A00' : '#D9D9D9' 
                    }}>{selectedNeed.urgency}</span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Ward:</strong> {selectedNeed.ward_id}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Description:</strong> {selectedNeed.description}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Reports:</strong> {selectedNeed.report_count}
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '8px',
                    background: '#FF9E00',
                    color: '#1A1A1A',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}>
                    Dispatch volunteers →
                  </button>
                </div>
              </div>
            )}

            <div style={{ ...glassCard, padding: '14px' }}>
              <h3 style={{ fontSize: '14px', color: '#FFFFFF', marginBottom: '8px', fontWeight: 500 }}>Map Legend</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { color: '#FF9E00', label: 'Critical Need' },
                  { color: '#E05A00', label: 'High Need' },
                  { color: '#C77DFF', label: 'Medium Need' },
                  { color: '#C77DFF', label: 'Volunteer Location' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
