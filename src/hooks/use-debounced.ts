/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, type ChangeEvent } from 'react'
interface UseDebouncedProps {
  delay?: number
  onCompleted?: (_: string) => void
  onChange?: (_: string) => void
}

interface UseDebounceReturn {
  value: string
  onChange: (_: ChangeEvent<HTMLInputElement>) => void
  handleChange: (_: string) => void
  onChangeValue: (_: string) => void
}

export function useDebounced(props?: UseDebouncedProps): UseDebounceReturn {
  const { delay = 500, onCompleted, onChange } = props ?? {}

  const [value, setValue] = useState<string>('')

  useEffect(() => {
    if (value) {
      const timeout = setTimeout(() => {
        if (value) onCompleted?.(value)
      }, delay)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [value, delay])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
    onChange?.(e.target.value)
  }

  const handleChangeValue = (value: string): void => {
    setValue(value)
    onChange?.(value)
  }

  const handleChange = (value: string): void => {
    setValue(value)
    onChange?.(value)
  }

  return {
    value,
    onChangeValue: handleChangeValue,
    onChange: handleInputChange,
    handleChange
  }
}
