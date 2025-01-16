import React from 'react'

export default function Modal({
  children,
  onClose
}: {
  children?:
    | ((setIsModalOpen: (b: boolean) => void) => React.ReactNode)
    | React.ReactNode
  onClose?: () => void
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(true)
  if (!isModalOpen) return null
  return (
    <>
      <div
        onClick={() => {
          setIsModalOpen(false)
          onClose?.()
        }}
        className="fixed inset-0 dark:bg-black/80 bg-black/60 p-10 z-[99999999]"
      ></div>
      <div className="fixed inset-0 overflow-auto z-[999999999] pointer-events-none">
        {typeof children === 'function'
          ? children((o) => {
              setIsModalOpen(o)
              if (!o) onClose?.()
            })
          : children}
      </div>
    </>
  )
}
