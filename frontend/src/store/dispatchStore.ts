import { create } from 'zustand'
import type { Dispatch } from '../types'

interface DispatchState {
  activeDispatches: Dispatch[]
  setActiveDispatches: (dispatches: Dispatch[]) => void
  updateDispatchStatus: (id: string, status: Dispatch['status']) => void
}

export const useDispatchStore = create<DispatchState>((set) => ({
  activeDispatches: [],
  setActiveDispatches: (dispatches) => set({ activeDispatches: dispatches }),
  updateDispatchStatus: (id, status) => set((state) => ({
    activeDispatches: state.activeDispatches.map(d => d.id === id ? { ...d, status } : d)
  }))
}))
