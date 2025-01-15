import React from 'react'
import { Toaster } from 'anni'

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
