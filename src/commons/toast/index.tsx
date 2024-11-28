// eslint-disable-next-line react-refresh/only-export-components
export { toast } from './state'

import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from './toast'
import { useToast } from './state'
import { useEffect, useState } from 'react'

export const DURATION_TOAST = 5000

interface PropsToaster {
  timeDuration?: number
  defaultShowCloseButton?: boolean
  defaultShowIcon?: boolean
}

export const Toaster = ({
  timeDuration = DURATION_TOAST
}: PropsToaster): JSX.Element | null => {
  const [mounted, setMounted] = useState(false)
  const removeToast = useToast((store) => store.removeToast)
  const toast = useToast((store) => store.toast)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    toast && (
      <ToastProvider key={toast.id} swipeDirection="down">
        <Toast
          duration={toast.duration ?? timeDuration}
          open={true}
          onOpenChange={removeToast}
        >
          <ToastTitle className="font-semibold text-sm">
            {toast.title}
          </ToastTitle>
          {toast.description && (
            <ToastDescription className="text-xs opacity-40">
              {toast.description}
            </ToastDescription>
          )}
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
  )
}
