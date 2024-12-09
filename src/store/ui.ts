import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  isSidebarOpen: boolean
  toggleSidebar: () => void

  isModuleMaximized: boolean
  toggleModuleMaximized: () => void
}

const StoreApi: StateCreator<UiState> = (set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  isModuleMaximized: false,
  toggleModuleMaximized: () =>
    set((state) => ({ isModuleMaximized: !state.isModuleMaximized }))
})

export const useUi = create<UiState>()(
  persist(StoreApi, {
    name: 'ponti-app-ui-store'
  })
)
