import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Switch,
  Tooltip
} from '@fluentui/react-components'
import { Dismiss24Regular, SettingsRegular } from '@fluentui/react-icons'
import React from 'react'
import { useTheme } from '~/providers/theme'

export default function SettingsDrawer() {
  const [open, setOpen] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Tooltip content="Ajustes" relationship="label">
        <button onClick={() => setOpen(true)}>
          <SettingsRegular fontSize={23} />
        </button>
      </Tooltip>
      {open && (
        <Drawer
          position="end"
          separator
          className="min-w-[400px] max-w-full"
          open={open}
          onOpenChange={(_, { open }) => setOpen(open)}
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => setOpen(false)}
                />
              }
            >
              Ajustes y preferencias
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody className="flex flex-col gap-3 overflow-y-auto ">
            <div className="pt-3">
              <label className="flex items-center justify-between font-semibold text-base">
                <h1>Modo oscuro </h1>
                <Switch
                  onChange={() => {
                    toggleTheme()
                  }}
                  checked={theme === 'dark'}
                />
              </label>
            </div>
          </DrawerBody>
        </Drawer>
      )}
    </>
  )
}
