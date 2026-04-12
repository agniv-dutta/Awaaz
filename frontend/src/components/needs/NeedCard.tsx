import type { Need } from '../../types'
import { UrgencyBadge } from "./UrgencyBadge"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"

interface NeedCardProps {
  need: Need
  onDispatch?: (needId: string) => void
}

export function NeedCard({ need, onDispatch }: NeedCardProps) {
  const edgeColorMap = {
    CRITICAL: "bg-[#FF9E00]",
    HIGH: "bg-[#E05A00]",
    MEDIUM: "bg-[#C77DFF]",
    LOW: "bg-[#888888]",
  }

  // Calculate time since last report
  const timeSince = "12m ago" // Mock logic

  return (
    <Card className="relative overflow-hidden pl-4 pr-4 py-3 flex items-center justify-between">
      {/* Edge bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${edgeColorMap[need.urgency]}`} />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-silver">{need.category}</span>
          <UrgencyBadge urgency={need.urgency} />
        </div>
        <div className="text-xs text-silver-muted flex items-center gap-2">
          <span>Ward {need.ward_id}</span>
          <span>•</span>
          <span>{need.report_count} reports</span>
          <span>•</span>
          <span>{timeSince}</span>
        </div>
      </div>

      <Button onClick={() => onDispatch?.(need.id)}>Dispatch</Button>
    </Card>
  )
}
