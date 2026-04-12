import type { Volunteer } from '../../types'
import { Card } from "../ui/Card"
import { Avatar } from "../ui/Avatar"
import { ReliabilityArc } from "./ReliabilityArc"

interface VolunteerCardProps {
  volunteer: Volunteer
  onClick?: () => void
}

export function VolunteerCard({ volunteer, onClick }: VolunteerCardProps) {
  // Mock name (normally from User model)
  const name = (volunteer as any).name || "Volunteer"

  return (
    <Card 
      className="p-5 flex flex-col gap-4 cursor-pointer hover:border-silver transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={name} />
          <div className="flex flex-col">
            <span className="text-[15px] font-medium text-silver">{name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${volunteer.is_active ? 'bg-orange' : 'bg-charcoal-border'}`} />
              <span className="text-xs text-silver-muted">
                {volunteer.is_active ? 'Available today' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>
        <ReliabilityArc score={volunteer.reliability_score} />
      </div>

      <div className="flex flex-wrap gap-2">
        {volunteer.skills.map(skill => (
          <div key={skill} className="px-2 py-0.5 rounded-full bg-charcoal-border text-[11px] text-silver font-medium">
            {skill}
          </div>
        ))}
      </div>

      <div className="text-xs text-silver-muted mt-auto pt-2 flex justify-between">
        <span>Ward {volunteer.home_ward_id}</span>
        <span>{volunteer.completed_tasks} tasks done</span>
      </div>
    </Card>
  )
}
