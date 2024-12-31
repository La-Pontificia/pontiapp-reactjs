import { Switch } from '@fluentui/react-components'
import { useTheme } from '~/providers/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <Switch
        onChange={() => {
          toggleTheme()
        }}
        checked={theme === 'dark'}
        label="Oscuro"
      />
    </div>
  )
}
