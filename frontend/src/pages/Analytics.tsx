import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { C } from '../utils/colors'

const glassCard: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.65)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 158, 0, 0.18)',
  borderRadius: '16px',
}

const lineData = [
  { name: 'Mon', FOOD: 12, MEDICAL: 19, SHELTER: 3 },
  { name: 'Tue', FOOD: 15, MEDICAL: 15, SHELTER: 5 },
  { name: 'Wed', FOOD: 10, MEDICAL: 22, SHELTER: 2 },
  { name: 'Thu', FOOD: 18, MEDICAL: 18, SHELTER: 6 },
  { name: 'Fri', FOOD: 14, MEDICAL: 25, SHELTER: 4 },
  { name: 'Sat', FOOD: 20, MEDICAL: 20, SHELTER: 7 },
  { name: 'Sun', FOOD: 17, MEDICAL: 16, SHELTER: 5 },
]

const donutData = [
  { name: 'MEDICAL', value: 45, color: '#C77DFF' },
  { name: 'FOOD', value: 30, color: '#FF9E00' },
  { name: 'SHELTER', value: 15, color: '#D9D9D9' },
  { name: 'EDUCATION', value: 12, color: '#E05A00' },
  { name: 'LEGAL', value: 8, color: 'rgba(199,125,255,0.6)' },
  { name: 'OTHER', value: 5, color: 'rgba(217,217,217,0.3)' },
]

export function Analytics() {
  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF', letterSpacing: '-0.5px' }}>Analytics</h1>
            <p style={{ fontSize: '15px', color: '#D9D9D9', marginTop: '4px' }}>Trends, ward performance and need breakdowns</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Input type="date" style={{ width: '160px', height: '38px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,158,0,0.2)' }} />
            <Input type="date" style={{ width: '160px', height: '38px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,158,0,0.2)' }} />
            <Button variant="secondary" style={{ height: '38px' }}>Export CSV</Button>
          </div>
        </div>

        {/* Line chart */}
        <div className="glass-card" style={{ ...glassCard, padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF', border: 'none', padding: 0, marginBottom: '20px' }}>Needs over time</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="rgba(255,158,0,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(217,217,217,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(217,217,217,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomLineTooltip />} />
                <Line type="monotone" dataKey="FOOD" stroke="#FF9E00" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="MEDICAL" stroke="#C77DFF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SHELTER" stroke="#D9D9D9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two-column lower section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Donut */}
          <div className="glass-card" style={{ ...glassCard, padding: '24px', position: 'relative' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF', border: 'none', padding: 0, marginBottom: '16px' }}>Needs by Category</h3>
            <div style={{ height: '260px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius="68%"
                    outerRadius="90%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center total label */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 500, color: '#FFFFFF' }}>214</div>
                <div style={{ fontSize: '11px', color: 'rgba(217,217,217,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>total needs</div>
              </div>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: '20px' }}>
              {donutData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', background: d.color, borderRadius: '2px' }} />
                  <span style={{ fontSize: '13px', color: '#D9D9D9' }}>{d.name}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(217,217,217,0.5)', marginLeft: 'auto' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ward leaderboard */}
          <div className="glass-card" style={{ ...glassCard, padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#FFFFFF', border: 'none', padding: 0, marginBottom: '16px' }}>Ward Leaderboard</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 80px 100px 40px',
                gap: '12px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(217, 217, 217, 0.08)',
                marginBottom: '4px',
              }}>
                {['Rank', 'Ward', 'Open', 'Top Issue', 'Trend'].map(h => (
                  <span key={h} style={{ fontSize: '11px', color: '#D9D9D9', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{h}</span>
                ))}
              </div>
              {[
                { rank: 1, ward: 'Ward 1', count: 42, top: 'MEDICAL', trend: 'up' },
                { rank: 2, ward: 'Ward 2', count: 31, top: 'FOOD', trend: 'down' },
                { rank: 3, ward: 'Ward 3', count: 28, top: 'SHELTER', trend: 'dash' },
                { rank: 4, ward: 'Ward 4', count: 19, top: 'MEDICAL', trend: 'up' },
                { rank: 5, ward: 'Ward 5', count: 14, top: 'EDUCATION', trend: 'dash' },
              ].map(item => (
                <div key={item.rank} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 80px 100px 40px',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: item.rank < 5 ? '1px solid rgba(255,158,0,0.06)' : 'none',
                  borderLeft: item.rank === 1 ? '3px solid #FF9E00' : 'none',
                  paddingLeft: item.rank === 1 ? '12px' : '0',
                  marginLeft: item.rank === 1 ? '-12px' : '0',
                  alignItems: 'center',
                }}>
                  <span style={{ 
                    color: item.rank === 1 ? '#FF9E00' : item.rank === 2 ? 'rgba(199,125,255,0.8)' : 'rgba(217,217,217,0.5)',
                    fontWeight: 500, fontSize: '14px' 
                  }}>#{item.rank}</span>
                  <span style={{ color: C.silver, fontSize: '14px' }}>{item.ward}</span>
                  <span style={{ color: C.orange, fontSize: '14px' }}>{item.count}</span>
                  <span style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                    background: item.top === 'MEDICAL' ? C.violetGhost : C.orangeGhost,
                    color: item.top === 'MEDICAL' ? C.violet : C.orange,
                    border: `1px solid ${item.top === 'MEDICAL' ? C.violetBorder : 'rgba(255,158,0,0.2)'}`,
                    letterSpacing: '0.04em', width: 'max-content'
                  }}>
                    {item.top}
                  </span>
                  <span style={{ fontSize: '12px', textAlign: 'center' }}>
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function CustomLineTooltip({ active, label, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(26,26,26,0.95)', border: '1px solid rgba(255,158,0,0.2)',
        borderRadius: '8px', padding: '10px 14px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '12px', color: 'rgba(217,217,217,0.6)', marginBottom: '8px' }}>{label} Stats</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {payload.map((p: any) => (
            <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
              <span style={{ color: '#D9D9D9' }}>{p.dataKey}:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}
