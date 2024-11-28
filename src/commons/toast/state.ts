/* eslint-disable @typescript-eslint/no-explicit-any */
import { create, type StateCreator } from 'zustand'
export interface ToastT {
  id: string | number
  title?: string | null | undefined | any
  content?: React.ReactNode | null | undefined
  showCloseButton?: boolean
  description?: string
  color?: 'success' | 'error' | 'warning' | 'info' | 'default' | 'empty'
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center'
  duration?: number
  onDismiss?: (toast: ToastT) => void
  onAutoClose?: (toast: ToastT) => void
}

interface State {
  toast: ToastT | null
  addToast: (t: ToastT) => void
  removeToast: () => void
}

export type ExternalToast = Omit<ToastT, 'id' | 'title'> & {
  id?: number | string
}

const StoreApi: StateCreator<State> = (set) => ({
  toast: null,
  addToast: (t) => {
    set(() => ({
      toast: {
        ...t,
        onDismiss: t.onDismiss
          ? (toast) => {
              set(() => ({
                toast: null
              }))
              t.onDismiss?.(toast)
            }
          : undefined
      }
    }))
  },
  removeToast: () => {
    set(() => ({
      toast: null
    }))
  }
})

export const useToast = create(StoreApi)

const toastFunction = (title: ToastT['title'], data?: ExternalToast): void => {
  const state = useToast.getState()
  state.addToast({
    id: Math.floor(Math.random() * 1000000),
    title,
    ...data
  })
}

const basicToast = toastFunction

export const toast = Object.assign(basicToast, {
  success: (title: ToastT['title'], data?: ExternalToast) => {
    toastFunction(title, { color: 'success', ...data })
  },
  error: (title: ToastT['title'], data?: ExternalToast) => {
    toastFunction(title, { color: 'error', ...data })
  },
  warning: (title: ToastT['title'], data?: ExternalToast) => {
    toastFunction(title, { color: 'warning', ...data })
  },
  info: (title: ToastT['title'], data?: ExternalToast) => {
    toastFunction(title, { color: 'info', ...data })
  },
  jsx: (content: React.ReactNode, data?: ExternalToast) => {
    toastFunction(undefined, { color: 'empty', ...data, content })
  }
})
