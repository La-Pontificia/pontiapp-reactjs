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
        disabled
        checked={theme === 'dark'}
        label={<p className="text-xs font-semibold pt-0.5">Oscuro</p>}
      />
    </div>
  )
}
