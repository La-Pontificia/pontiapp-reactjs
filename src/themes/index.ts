import {
  BrandVariants,
  createLightTheme,
  createDarkTheme
} from '@fluentui/react-components'

const customBrandRamp: BrandVariants = {
  '10': '#001A33',
  '20': '#00264D',
  '30': '#003366',
  '40': '#004080',
  '50': '#004D99',
  '60': '#005BB3',
  '70': '#0066CC',
  '80': '#0073E6',
  '90': '#3388EB',
  '100': '#669CF0',
  '110': '#99B1F5',
  '120': '#B3C4F7',
  '130': '#CCD7FA',
  '140': '#D9E3FC',
  '150': '#E6EFFD',
  '160': '#F3FAFF'
}

export const customLightTheme = createLightTheme(customBrandRamp)
export const customDarkTheme = createDarkTheme(customBrandRamp)
