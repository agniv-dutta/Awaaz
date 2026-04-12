import type { Dispatch, DispatchStatus } from '../../types'

const dStatuses: DispatchStatus[] = ['PENDING_ACCEPT', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED']

export const dispatches: Dispatch[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `d${i}`,
  need_id: `n${i}`,
  volunteer_id: `v${i}`,
  match_score: 0.6 + (Math.random() * 0.4),
  status: dStatuses[i % dStatuses.length],
  volunteer_notes: i % 5 === 0 ? "Declined due to distance" : null,
  notified_at: new Date().toISOString(),
  responded_at: i % 5 !== 0 ? new Date().toISOString() : null,
  completed_at: i % dStatuses.length === 3 ? new Date().toISOString() : null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}))
