import { Tooltip } from '@fluentui/react-components'
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons'
import React from 'react'
import { useTheme } from '@/providers/theme'

const themes = {
  light: {
    icon: WeatherSunnyRegular,
    text: 'Claro'
  },
  dark: {
    icon: WeatherMoonRegular,
    text: 'Oscuro'
  }
}

export default function Theme() {
  const { theme, toggleTheme } = useTheme()

  const currentTheme = React.useMemo(() => {
    return themes[theme] ?? themes.light
  }, [theme])
  return (
    <Tooltip content={`Cambiar a ${theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}`}
      relationship='label'>
      <button
        onClick={toggleTheme}
        className='flex flex-col gap-0.5 items-center'>
        <currentTheme.icon className='opacity-70' fontSize={27} />
        <p className='text-[10px] opacity-60'>
          {currentTheme.text}
        </p>
      </button>
    </Tooltip>
  )
}
