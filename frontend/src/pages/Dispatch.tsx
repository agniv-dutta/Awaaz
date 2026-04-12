import { useState } from 'react';
import { PageWrapper } from "../components/layout/PageWrapper"
import { useDispatch } from "../hooks/useDispatch"
import { Spinner } from "../components/ui/Spinner"
import { MatchScoreBar } from "../components/ui/MatchScoreBar"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import type { Dispatch as DispatchModel } from '../types'
import { motion,  } from "framer-motion"
import { useSocket } from "../hooks/useSocket"
import { useQueryClient } from "@tanstack/react-query"

export function Dispatch() {
  const { data: dispatches, isLoading } = useDispatch()
  const queryClient = useQueryClient()
  const [flashingId, setFlashingId] = useState<string | null>(null)

  useSocket('dispatch_status_changed', (payload) => {
    setFlashingId(payload.id)
    queryClient.invalidateQueries({ queryKey: ['dispatches'] })
    setTimeout(() => setFlashingId(null), 600)
  })

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-medium text-silver">Dispatch Tracking</h1>
        
        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : (
          <div className="w-full border border-charcoal-border rounded-lg bg-charcoal-light overflow-hidden flex flex-col">
            <div className="grid grid-cols-6 gap-4 p-4 border-b border-charcoal-border text-xs font-semibold text-silver uppercase tracking-wider">
              <span>Category & Ward</span>
              <span>Volunteer</span>
              <span className="col-span-2">Match Score</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            
            <div className="flex flex-col">
              {dispatches?.map((d) => (
                <DispatchRow key={d.id} dispatch={d} isFlashing={flashingId === d.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

function DispatchRow({ dispatch, isFlashing }: { dispatch: DispatchModel, isFlashing: boolean }) {
  const borderMap: Record<string, string> = {
    PENDING_ACCEPT: "border-[#2E2E2E]",
    ACCEPTED: "border-[#C77DFF]",
    IN_PROGRESS: "border-[#FF9E00]",
    COMPLETED: "border-transparent",
    DECLINED: "border-transparent",
  }

  const badgeVariantMap: Record<string, "pending" | "accepted" | "in_progress" | "completed" | "declined"> = {
    PENDING_ACCEPT: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    DECLINED: "declined",
  }

  const isCompleted = dispatch.status === 'COMPLETED'
  const isDeclined = dispatch.status === 'DECLINED'

  return (
    <motion.div 
      initial={false}
      animate={{ backgroundColor: isFlashing ? '#FF9E0010' : 'transparent' }}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-6 gap-4 p-4 border-b border-charcoal-border items-center border-l-4 ${borderMap[dispatch.status]} ${isCompleted ? 'opacity-50' : ''}`}
    >
      <div className="flex flex-col">
        <span className="font-medium text-silver text-sm">Need Category</span>
        <span className="text-xs text-silver-muted">Ward</span>
      </div>
      <div className="text-sm font-medium text-silver">
        <span className={isDeclined ? 'line-through' : ''}>Volunteer Name</span>
      </div>
      <div className="col-span-2">
        <MatchScoreBar score={dispatch.match_score} />
      </div>
      <div>
        <Badge variant={badgeVariantMap[dispatch.status]}>
          {dispatch.status.replace('_', ' ')}
        </Badge>
      </div>
      <div>
        <Button variant="secondary" className="text-[11px] py-1 px-3">View</Button>
      </div>
    </motion.div>
  )
}
