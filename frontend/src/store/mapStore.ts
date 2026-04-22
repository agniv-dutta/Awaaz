import { create } from 'zustand'
import type { Ward } from '../types'

interface MapState {
  selectedWardId: string | null
  activeCategories: string[]
  activeUrgencies: string[]
  showOnlyOpen: boolean
  wards: Ward[]
  setWard: (id: string | null) => void
  setWards: (wards: Ward[]) => void
  toggleCategory: (cat: string) => void
  toggleUrgency: (urgency: string) => void
  setShowOnlyOpen: (open: boolean) => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedWardId: null,
  activeCategories: [],
  activeUrgencies: [],
  showOnlyOpen: true,
  wards: [],
  setWard: (id) => set({ selectedWardId: id }),
  setWards: (wards) => set({ wards }),
  toggleCategory: (cat) => set((state) => ({
    activeCategories: state.activeCategories.includes(cat) 
      ? state.activeCategories.filter(c => c !== cat)
      : [...state.activeCategories, cat]
  })),
  toggleUrgency: (urgency) => set((state) => ({
    activeUrgencies: state.activeUrgencies.includes(urgency)
      ? state.activeUrgencies.filter(u => u !== urgency)
      : [...state.activeUrgencies, urgency]
  })),
  setShowOnlyOpen: (open) => set({ showOnlyOpen: open })
}))
