import React from 'react'

type QrReaderProps = {
  onEnter?: (text: string) => void
  defaultText?: string
  disabled?: boolean
}

export const useQrCodeReader = (props?: QrReaderProps) => {
  const [capturedText, setCapturedText] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { onEnter, disabled, defaultText } = props ?? {}

  React.useEffect(() => {
    if (disabled) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (inputRef.current === document.activeElement) {
        // Si el foco está en el input, no agregar manualmente texto
        return
      }

      if (event.key === 'Enter') {
        onEnter?.(capturedText)
        setCapturedText('')
        inputRef.current?.focus()
      } else {
        setCapturedText((prev) => prev + event.key)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [capturedText, onEnter, disabled, defaultText])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapturedText(event.target.value)
  }

  const handleEnter = () => {
    onEnter?.(capturedText)
    setCapturedText('')
    inputRef.current?.focus()
  }
  return { capturedText, inputRef, onChange, handleEnter }
}
