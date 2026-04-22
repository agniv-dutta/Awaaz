import { PageWrapper } from '../components/layout/PageWrapper'
import { useMapStore } from '../store/mapStore'
import { useIsMobile } from '../hooks/useIsMobile'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.72)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
}

const ZONES = [
  { id: 'Dharavi', x: 70, y: 70, width: 120, height: 90, color: '#FF9E00', level: 'Critical' },
  { id: 'Kurla East', x: 215, y: 65, width: 120, height: 90, color: '#C77DFF', level: 'High' },
  { id: 'Govandi', x: 365, y: 78, width: 120, height: 90, color: '#6EE7B7', level: 'Moderate' },
  { id: 'Mankhurd', x: 150, y: 190, width: 125, height: 90, color: '#D9D9D9', level: 'Watch' },
  { id: 'Bandra West', x: 315, y: 200, width: 130, height: 90, color: '#FF9E00', level: 'Critical' },
]

export function NeedsMap() {
  const isMobile = useIsMobile(980)
  const selectedWard = useMapStore((s) => s.selectedWardId)
  const wards = useMapStore((s) => s.wards)

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 500 }}>Needs Map</h1>
          <p style={{ fontSize: '14px', color: '#D9D9D9', marginTop: '4px' }}>
            Zone-based operational view for ward prioritization and connector routing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px', gap: '18px' }}>
          <div style={{ ...glassCard, padding: '12px' }}>
            <div style={{ border: '1px solid rgba(217,217,217,0.12)', borderRadius: '12px', overflow: 'hidden', background: 'radial-gradient(circle at 20% 0%, rgba(255,158,0,0.08), transparent 38%), linear-gradient(180deg, #121212 0%, #1A1A1A 100%)' }}>
              <svg viewBox="0 0 560 360" style={{ width: '100%', height: isMobile ? '320px' : '100%', display: 'block' }}>
                <defs>
                  <pattern id="dotGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="rgba(217,217,217,0.12)" />
                  </pattern>
                </defs>
                <rect width="560" height="360" fill="url(#dotGrid)" />

                {ZONES.map((zone, idx) => (
                  <g key={zone.id}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      rx="14"
                      width={zone.width}
                      height={zone.height}
                      fill="rgba(255,255,255,0.02)"
                      stroke={zone.color}
                      strokeWidth={selectedWard && selectedWard !== zone.id ? 1.2 : 2.2}
                      style={{ filter: selectedWard === zone.id ? 'drop-shadow(0px 0px 8px rgba(255,158,0,0.5))' : 'none' }}
                    />
                    <text x={zone.x + 12} y={zone.y + 26} fill="#FFFFFF" fontSize="13" fontWeight="500" fontFamily="inherit">
                      {zone.id}
                    </text>
                    <text x={zone.x + 12} y={zone.y + 47} fill="rgba(217,217,217,0.85)" fontSize="11" fontFamily="inherit">
                      Priority: {zone.level}
                    </text>
                    <text x={zone.x + 12} y={zone.y + 66} fill="rgba(217,217,217,0.65)" fontSize="10" fontFamily="inherit">
                      Active relays: {3 + idx}
                    </text>
                  </g>
                ))}

                <g stroke="rgba(217,217,217,0.4)" strokeWidth="1.4" strokeDasharray="6 6" fill="none">
                  <path d="M190 112 C210 104, 220 108, 235 110" />
                  <path d="M335 112 C350 118, 362 120, 368 122" />
                  <path d="M250 200 C245 175, 235 152, 224 138" />
                  <path d="M315 205 C328 182, 338 160, 356 148" />
                </g>
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ ...glassCard, padding: '14px' }}>
              <h3 style={{ fontSize: '14px', color: '#FFFFFF', marginBottom: '8px', fontWeight: 500 }}>Map Legend</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { color: '#FF9E00', label: 'Critical Priority' },
                  { color: '#C77DFF', label: 'High Priority' },
                  { color: '#6EE7B7', label: 'Moderate Priority' },
                  { color: '#D9D9D9', label: 'Watch Zone' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: '12px', color: '#D9D9D9' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...glassCard, padding: '14px' }}>
              <h3 style={{ fontSize: '14px', color: '#FFFFFF', marginBottom: '8px', fontWeight: 500 }}>Data.gov Ward Sync</h3>
              <div style={{ fontSize: '12px', color: '#D9D9D9', lineHeight: 1.6 }}>
                {wards.length > 0
                  ? `${wards.length} wards loaded from Data.gov integration.`
                  : 'Using fallback ward catalog until Data.gov source is reachable.'}
              </div>
              {selectedWard && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#C77DFF' }}>
                  Selected ward filter: {selectedWard}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
