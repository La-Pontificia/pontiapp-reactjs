import { type ReactZoomPanPinchState } from 'react-zoom-pan-pinch'
import { create, type StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  isEditing: boolean
  isMoveable: boolean
  isItemDragging: boolean
  setItemDragging: (isItemDragging: boolean) => void
  setIsMoveable: (isMoveable: boolean) => void
  setIsEditing: (disabledDragPanel: boolean) => void
  pinchState: ReactZoomPanPinchState
  setPinchState: (state: ReactZoomPanPinchState) => void
}

const StoreApi: StateCreator<State> = (set) => ({
  isEditing: false,
  isMoveable: true,
  isItemDragging: true,
  setItemDragging: (isItemDragging) => set(() => ({ isItemDragging })),
  setIsMoveable: (isMoveable) => set(() => ({ isMoveable })),
  setIsEditing: (isEditing) => set(() => ({ isEditing })),
  pinchState: {
    positionX: 0,
    positionY: 0,
    scale: 1,
    previousScale: 0
  },
  setPinchState: (state) => set(() => ({ pinchState: state }))
})

export const useAttentionsUi = create<State>()(
  persist(StoreApi, {
    name: 'ui-store'
  })
)
