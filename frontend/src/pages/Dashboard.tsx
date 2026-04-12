import { ArrowUpRight, Minus } from "lucide-react"
import { PageWrapper } from "../components/layout/PageWrapper"
import { Card } from "../components/ui/Card"
import { LiveFeed } from "../components/realtime/LiveFeed"
import { NeedCard } from "../components/needs/NeedCard"
import { useNeeds } from "../hooks/useNeeds"
import { useAnalyticsSummary } from "../hooks/useAnalytics"
import { Spinner } from "../components/ui/Spinner"
import { useMemo } from 'react';

export function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useAnalyticsSummary()
  const { data: needs, isLoading: loadingNeeds } = useNeeds()

  const urgentNeeds = useMemo(() => {
    if (!needs) return []
    return [...needs]
      .sort((a, b) => b.urgency_score - a.urgency_score)
      .slice(0, 5)
  }, [needs])

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Top metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Open Needs" 
            value={summary?.open_needs ?? 0} 
            trend="up" 
            loading={loadingSummary} 
          />
          <MetricCard 
            label="Critical Today" 
            value={urgentNeeds.filter(n => n.urgency === 'CRITICAL').length} 
            trend="up" 
            loading={loadingNeeds} 
          />
          <MetricCard 
            label="Active Volunteers" 
            value={summary?.active_volunteers ?? 0} 
            trend="neutral" 
            loading={loadingSummary} 
          />
          <MetricCard 
            label="Dispatch Rate" 
            value={`${Math.round(((summary?.completed_dispatches || 0) / (summary?.total_needs || 1)) * 100)}%`} 
            trend="up" 
            loading={loadingSummary} 
          />
        </div>

        {/* Middle section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[58%]">
            <Card className="h-[300px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#222] flex items-center justify-center bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/72.8222,19.0435,11,0/600x300?access_token=none')] bg-cover bg-center brightness-50">
                <span className="text-silver-muted font-medium tracking-widest text-sm uppercase relative z-10">Live Heatmap</span>
              </div>
            </Card>
          </div>
          <div className="w-full lg:w-[42%]">
            <LiveFeed />
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium text-silver">Most urgent needs</h2>
          {loadingNeeds ? (
            <div className="py-8 flex justify-center"><Spinner /></div>
          ) : (
            <div className="flex flex-col gap-3">
              {urgentNeeds.map(need => (
                <NeedCard key={need.id} need={need} onDispatch={(id) => console.log('Dispatch', id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

function MetricCard({ label, value, trend, loading }: { label: string, value: string | number, trend: 'up' | 'neutral', loading: boolean }) {
  return (
    <Card className="p-5 flex flex-col justify-between h-28">
      <span className="text-[13px] text-silver font-medium">{label}</span>
      <div className="flex items-end justify-between mt-auto">
        {loading ? (
          <Spinner className="w-5 h-5 border-[2px]" />
        ) : (
          <span className="text-[28px] font-semibold text-white leading-none">{value}</span>
        )}
        {trend === 'up' ? (
          <ArrowUpRight className="w-5 h-5 text-orange mb-1" />
        ) : (
          <Minus className="w-4 h-4 text-silver mb-1" />
        )}
      </div>
    </Card>
  )
}
