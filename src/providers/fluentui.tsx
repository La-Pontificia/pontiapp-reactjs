import { FluentProvider } from '@fluentui/react-components'
import React from 'react'
import { useTheme } from './theme'
import { lightTheme, darkTheme } from '@/utils/themes'

export default function FluentUIProvider({
  children
}: Readonly<{
  children?: React.ReactNode
}>) {
  const { theme } = useTheme()
  return (
    <FluentProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      {children}
    </FluentProvider>
  )
}
