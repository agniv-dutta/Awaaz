import { PageWrapper } from "../components/layout/PageWrapper"
import { Card } from "../components/ui/Card"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

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
  { name: 'OTHER', value: 10, color: '#888888' },
]

export function Analytics() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-silver">Analytics</h1>
          <div className="flex gap-4">
            <Input type="date" className="w-40" />
            <Input type="date" className="w-40" />
            <Button variant="secondary">Export CSV</Button>
          </div>
        </div>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-silver mb-6">Needs over time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#FF9E00" strokeOpacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #2E2E2E', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="FOOD" stroke="#FF9E00" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="MEDICAL" stroke="#C77DFF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SHELTER" stroke="#D9D9D9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 flex flex-col items-center">
             <h3 className="text-sm font-medium text-silver mb-6 w-full text-left">Needs by Category</h3>
             <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#2A2A2A', border: '1px solid #2E2E2E', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
             </div>
          </Card>

          <Card className="p-6">
             <h3 className="text-sm font-medium text-silver mb-6">Ward Leaderboard</h3>
             <div className="flex flex-col">
                <div className="grid grid-cols-4 gap-4 pb-3 border-b border-charcoal-border text-[11px] font-semibold text-silver-muted uppercase">
                  <span>Rank</span>
                  <span>Ward</span>
                  <span>Open Needs</span>
                  <span>Top Issue</span>
                </div>
                {[1,2,3,4,5].map(rank => (
                  <div key={rank} className="grid grid-cols-4 gap-4 py-3 border-b last:border-0 border-charcoal-border items-center">
                    <span className="text-silver font-medium">#{rank}</span>
                    <span className="text-silver text-sm">Ward {rank}</span>
                    <span className="text-orange">{Math.floor(40/rank)}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-ghost text-violet border border-violet-border w-max">MEDICAL</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
