import { customDarkTheme } from '~/themes'
import {
  FluentProvider
  // webDarkTheme,
  // webLightTheme
} from '@fluentui/react-components'
// import { useTheme } from 'next-themes'
// import useMediaQuery from 'beautiful-react-hooks/useMediaQuery'
import React from 'react'

export default function FluentUIProvider({
  children
}: Readonly<{
  children?: React.ReactNode
}>) {
  // const { theme } = useTheme()
  // const [darkMode] = React.useState(
  //   useMediaQuery('(prefers-color-scheme: dark)')
  // )

  // const t = theme === 'system' ? (darkMode ? 'dark' : 'light') : theme

  return <FluentProvider theme={customDarkTheme}>{children}</FluentProvider>
}
