import { createTheme } from '@fluentui/react/'

import * as colors from './colors'
import componentOverrides from './component-overrides'

const createFluentTheme = (themePreference: keyof typeof colors) => {
  const theme = createTheme({
    ...colors[themePreference],
    components: {}
  })

  theme.components = componentOverrides(theme)

  console.log(theme)

  return theme
}

export default createFluentTheme
