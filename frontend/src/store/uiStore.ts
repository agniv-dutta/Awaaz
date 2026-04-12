import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  activePanelId: string | null
  toggleSidebar: () => void
  openPanel: (id: string) => void
  closePanel: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activePanelId: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openPanel: (id) => set({ activePanelId: id }),
  closePanel: () => set({ activePanelId: null })
}))
