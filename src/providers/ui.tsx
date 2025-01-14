import { Toaster } from 'anni'
import React from 'react'

export default function UiProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster />
      {children}
    </>
  )
}
