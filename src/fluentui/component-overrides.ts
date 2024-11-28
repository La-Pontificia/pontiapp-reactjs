import { IButtonStyles, ITheme } from '@fluentui/react'

export default (theme: ITheme) => ({
  PrimaryButton: {
    styles: {
      label: {
        color: theme.palette.themeLight
      }
    } as IButtonStyles
  }
})
