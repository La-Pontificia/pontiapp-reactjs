import { webDarkTheme, webLightTheme, Theme } from '@fluentui/react-components'

export const lightTheme: Theme = {
  ...webLightTheme
}

// export const darkTheme: Theme = createTheme({
//   palette: {
//     themePrimary: '#2899f5',
//     themeLighterAlt: '#f3f9fd',
//     themeLighter: '#d0e7fb',
//     themeLight: '#a9d3f8',
//     themeTertiary: '#5baaf1',
//     themeSecondary: '#2b88d8',
//     themeDarkAlt: '#2491e0',
//     themeDark: '#1f7ebf',
//     themeDarker: '#175e8e',
//     neutralLighterAlt: '#323130',
//     neutralLighter: '#31302f',
//     neutralLight: '#2f2e2d',
//     neutralQuaternaryAlt: '#2c2b2a',
//     neutralQuaternary: '#2a2928',
//     neutralTertiaryAlt: '#282726',
//     neutralTertiary: '#c8c6c4',
//     neutralSecondary: '#a19f9d',
//     neutralPrimaryAlt: '#8d8b8a',
//     neutralPrimary: '#ffffff',
//     neutralDark: '#797775',
//     black: '#605e5c',
//     white: '#323130'
//   }
// })

export const darkTheme: Theme = {
  ...webDarkTheme,
  // colorBrandBackground: '#3c00fd',
  // colorBrandBackgroundHover: '#5520fd',
  // colorBrandBackgroundPressed: '#451acd',
  colorNeutralBackground1: '#2f2e2b',
  colorNeutralBackground1Hover: '#363531',
  colorNeutralStroke1: '#4d4c43',
  colorNeutralStroke1Pressed: '#4d4c43',
  colorNeutralStroke1Hover: '#4d4c43',
  colorNeutralStrokeAccessible: '#999685',
  borderRadiusMedium: '7px'
}
