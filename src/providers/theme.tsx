/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

type Theme = 'light' | 'dark'

type ThemeProviderProps = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeProviderProps>(
  {} as ThemeProviderProps
)

export const useTheme = () => React.useContext(ThemeContext)

export default function ThemeProvider({
  children
}: Readonly<{
  children?: React.ReactNode
}>) {
  const [theme, set] = useLocalStorage<Theme>('theme', 'light')

  // Light mode this is maintained for future use
  const isDark = true

  React.useEffect(() => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    set(theme === 'light' ? 'dark' : 'light')
  }

  const setTheme = (theme: Theme) => {
    set(theme)
  }

  return (
    <ThemeContext.Provider
      value={{
        setTheme,
        theme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
