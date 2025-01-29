'use client'

import { useState } from 'react'
import html2canvas, { Options } from 'html2canvas'

type useScreenshotProps = {
  onScreenshot: (file: File) => void
  onError?: (error: Error) => void
  onFinally?: () => void
  type?: string
  quality?: number
  node?: HTMLElement
  options?: Partial<Options>
}

const useScreenshot = (props?: useScreenshotProps) => {
  const {
    onFinally = () => {},
    onError = () => {},
    onScreenshot = () => {},
    type = 'image/png',
    quality = 1,
    node = document.body,
    options = {}
  } = props ?? {}

  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScreenshot = async () => {
    if (window === undefined) return
    setWaiting(true)
    html2canvas(node, options)
      .then((canvas) => {
        const croppedCanvas = document.createElement('canvas')
        const croppedCanvasContext = croppedCanvas.getContext('2d')

        const cropPositionTop = 0
        const cropPositionLeft = 0
        const cropWidth = canvas.width
        const cropHeight = canvas.height

        croppedCanvas.width = cropWidth
        croppedCanvas.height = cropHeight

        if (croppedCanvasContext) {
          croppedCanvasContext.drawImage(
            canvas,
            cropPositionLeft,
            cropPositionTop
          )

          const base64Image = croppedCanvas.toDataURL(type, quality)
          setScreenshot(base64Image)

          // Convert Base64 to Blob
          const byteString = atob(base64Image.split(',')[1])
          const arrayBuffer = new ArrayBuffer(byteString.length)
          const uintArray = new Uint8Array(arrayBuffer)

          for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i)
          }

          const blob = new Blob([uintArray], { type })
          const file = new File([blob], 'screenshot.png', { type })

          onScreenshot(file)
          return base64Image
        }
      })
      .catch((err) => {
        onError?.(err)
        setError(err.message)
      })
      .finally(() => {
        onFinally()
        setWaiting(false)
      })
  }

  return { screenshot, error, handleScreenshot, waiting }
}

export { useScreenshot }
