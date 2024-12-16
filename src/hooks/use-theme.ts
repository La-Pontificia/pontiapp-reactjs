import { useMemo } from 'react'

import createFluentTheme from '~/fluentui/create-theme'
type ThemePreference = 'dark' | 'light'

const useTheme = (themePreference: ThemePreference) =>
  useMemo(() => createFluentTheme(themePreference), [themePreference])

export default useTheme
