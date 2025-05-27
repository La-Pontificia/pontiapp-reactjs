/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { Toaster } from 'anni'
import { useTheme } from './theme'

type UIContextValue = {
  contentRef: React.RefObject<HTMLDivElement>
}

export const UIContext = React.createContext<UIContextValue>(
  {} as UIContextValue
)
export const useUI = () => React.useContext(UIContext)

export default function UiProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  return (
    <UIContext.Provider
      value={{
        contentRef
      }}
    >
      <Toaster theme={theme} appearance="invert" position="bottom-right" />
      {children}
    </UIContext.Provider>
  )
}
