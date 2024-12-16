import { Toaster } from '~/commons/toast'
import React from 'react'

export default function UiProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Toaster timeDuration={7000} />
      {children}
    </>
  )
}
