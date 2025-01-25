/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { Toaster } from 'anni'

type UIContextValue = {
  contentRef: React.RefObject<HTMLDivElement>
}

export const UIContext = React.createContext<UIContextValue | null>(null)

export default function UiProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  return (
    <UIContext.Provider
      value={{
        contentRef
      }}
    >
      <Toaster />
      {children}
    </UIContext.Provider>
  )
}
