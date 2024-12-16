import { create, type StateCreator } from 'zustand'

interface UiState {
  isSidebarOpen: boolean
  toggleSidebar: () => void

  isModuleMaximized: boolean
  toggleModuleMaximized: () => void

  isHeaderOpen: boolean
  toggleHeader: () => void
}

const StoreApi: StateCreator<UiState> = (set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isModuleMaximized: false,
  toggleModuleMaximized: () =>
    set((state) => ({ isModuleMaximized: !state.isModuleMaximized })),
  isHeaderOpen: true,
  toggleHeader: () => set((state) => ({ isHeaderOpen: !state.isHeaderOpen }))
})

export const useUi = create<UiState>(StoreApi)
