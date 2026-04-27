import { Badge } from "../ui/Badge"
import type { NeedUrgency } from '../../types'
import type { BadgeVariant } from "../ui/Badge"

export function UrgencyBadge({ urgency }: { urgency: NeedUrgency }) {
  const variantMap: Record<NeedUrgency, BadgeVariant> = {
    CRITICAL: "red",
    HIGH: "orange",
    MEDIUM: "violet",
    LOW: "silver",
  }
  return <Badge variant={variantMap[urgency]}>{urgency}</Badge>
}
