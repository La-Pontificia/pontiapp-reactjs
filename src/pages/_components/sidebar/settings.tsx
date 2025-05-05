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
import { useTheme } from '@/providers/theme'
import { UIContext } from '@/providers/ui'

export default function SettingsDrawer() {
  const [open, setOpen] = React.useState(false)
  const { theme, toggleTheme } = useTheme()
  const ctxui = React.useContext(UIContext)
  return (
    <>
      <Tooltip content="Ajustes" relationship="label">
        <button
          onClick={() => setOpen(!open)}
          data-open={open ? '' : undefined}
          className="p-3 rounded-xl hover:bg-slate-200/50 data-[open]:dark:bg-slate-950/30 data-[open]:bg-slate-200/50 hover:dark:bg-slate-950/30"
        >
          <SettingsRegular fontSize={25} className="opacity-80" />
        </button>
      </Tooltip>
      <Drawer
        mountNode={ctxui?.contentRef.current}
        position="start"
        separator
        className="min-w-[400px] z-[9999] max-w-full"
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
    </>
  )
}
