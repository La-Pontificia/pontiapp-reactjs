import React from 'react'

export function useElapsedTime(startAt: Date | null) {
  const [elapsedTime, setElapsedTime] = React.useState<string>('00:00')

  React.useEffect(() => {
    if (!startAt) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const startTime = startAt.getTime()
      const diffInSeconds = Math.floor((now - startTime) / 1000)

      const hours = Math.floor(diffInSeconds / 3600)
      const minutes = String(Math.floor((diffInSeconds % 3600) / 60)).padStart(
        2,
        '0'
      )
      const seconds = String(diffInSeconds % 60).padStart(2, '0')

      if (hours > 0) {
        setElapsedTime(
          `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`
        )
      } else {
        setElapsedTime(`${minutes}:${seconds}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startAt])

  return elapsedTime
}
