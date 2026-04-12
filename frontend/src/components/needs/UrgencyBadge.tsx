import { Badge } from "../ui/Badge"
import type { NeedUrgency } from '../../types'

export function UrgencyBadge({ urgency }: { urgency: NeedUrgency }) {
  const variantMap: Record<NeedUrgency, "critical" | "high" | "medium" | "low"> = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
  }
  return <Badge variant={variantMap[urgency]}>{urgency}</Badge>
}
