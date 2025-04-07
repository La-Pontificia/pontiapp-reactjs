/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { Toaster } from 'anni'

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
  return (
    <UIContext.Provider
      value={{
        contentRef
      }}
    >
      <Toaster
        defaultClassNames={{
          toast:
            '!bg-stone-950 dark:!bg-neutral-900 !shadow-[0_0_10px_rgba(0,0,0,.4)]'
        }}
        theme="dark"
        appearance="default"
        position="bottom-right"
      />
      {children}
    </UIContext.Provider>
  )
}
