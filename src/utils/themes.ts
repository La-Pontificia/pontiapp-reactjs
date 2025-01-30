import { webDarkTheme, webLightTheme, Theme } from '@fluentui/react-components'

export const lightTheme: Theme = {
  ...webLightTheme,
  borderRadiusMedium: '6px'
}

export const darkTheme: Theme = {
  ...webDarkTheme,
  colorNeutralBackground1: '#2f2e2b',
  colorNeutralBackground1Hover: '#363531',
  colorNeutralStroke1: '#4d4c43',
  colorNeutralStroke1Pressed: '#4d4c43',
  colorNeutralStroke1Hover: '#4d4c43',
  colorNeutralStrokeAccessible: '#999685',
  borderRadiusMedium: '6px'
}
