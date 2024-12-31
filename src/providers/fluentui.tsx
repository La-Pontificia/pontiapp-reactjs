import {
  FluentProvider,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components'
import React from 'react'
import { useTheme } from './theme'

export default function FluentUIProvider({
  children
}: Readonly<{
  children?: React.ReactNode
}>) {
  const { theme } = useTheme()
  return (
    <FluentProvider theme={theme === 'dark' ? webDarkTheme : webLightTheme}>
      {children}
    </FluentProvider>
  )
}
