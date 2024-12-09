import React from 'react'

type QrReaderProps = {
  onEnter?: (text: string) => void
  defaultText?: string
  disabled?: boolean
}

export const useQrCodeReader = (props?: QrReaderProps) => {
  const [capturedText, setCapturedText] = React.useState<string>('')
  const { onEnter, disabled, defaultText } = props ?? {}

  React.useEffect(() => {
    if (disabled) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onEnter?.(capturedText)
        setCapturedText('')
      } else {
        setCapturedText((prev) => prev + event.key)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [capturedText, onEnter, disabled, defaultText])

  return { capturedText }
}
