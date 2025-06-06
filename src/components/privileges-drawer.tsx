import { PRIVILEGE_DEVELOPER, PRIVILEGES } from '@/const'
import { useAuth } from '@/store/auth'
import {
  Badge,
  Button,
  ButtonProps,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeaderTitle,
  SearchBox
} from '@fluentui/react-components'
import { Dismiss24Regular, WrenchRegular } from '@fluentui/react-icons'
import * as React from 'react'

type PrivilegesDrawerProps = {
  title?: string
  onSubmitTitle?: string
  onSubmit: (privileges: string[]) => void
  asignedPrivileges?: string[]
  triggerProps?: ButtonProps
}

export default function PrivilegesDrawer(props: PrivilegesDrawerProps) {
  const { user } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [asignedPrivileges, setAsignedPrivileges] = React.useState<string[]>(
    props.asignedPrivileges ?? []
  )

  const [privileges, setPrivileges] =
    React.useState<typeof PRIVILEGES>(PRIVILEGES)

  const handleSearch = (query: string) => {
    const filteredPrivileges = Object.entries(PRIVILEGES).reduce(
      (result, [key, value]) => {
        if (value.toLowerCase().includes(query.toLowerCase()))
          result[key as keyof typeof PRIVILEGES] = value
        return result
      },
      {} as typeof PRIVILEGES
    )

    setPrivileges(filteredPrivileges)
  }

  const handleAsignPrivilege = (key: string) => {
    setAsignedPrivileges((prev) => [...prev, key])
  }

  const handSubmit = () => {
    setOpen(false)
    props.onSubmit(asignedPrivileges)
  }

  return (
    <>
      <Button {...props.triggerProps} onClick={() => setOpen(true)} />
      <Drawer
        inertTrapFocus
        position="end"
        type="overlay"
        separator
        className="md:min-w-[40svw] min-w-full w-full max-w-full"
        open={open}
        modalType="alert"
        onOpenChange={(_, { open }) => setOpen(open)}
      >
        <DrawerHeaderTitle
          className="p-3 w-full px-5"
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => setOpen(false)}
            />
          }
        >
          {props.title}
        </DrawerHeaderTitle>

        <DrawerBody className="flex flex-col overflow-y-auto">
          <nav className="pb-3 flex justify-between">
            <SearchBox
              onChange={(_, e) => handleSearch(e.value)}
              style={{
                maxWidth: '100%'
              }}
              placeholder="Filtrar los privilegios"
            />
            <Badge appearance="tint">
              Privilegios seleccionados: {asignedPrivileges.length}
            </Badge>
          </nav>
          <div className="flex-grow h-full divide-y overflow-y-auto divide-neutral-500/20">
            {Object.entries(privileges).map(([key, value]) => {
              const hasAsigned = asignedPrivileges.includes(key)
              if (key === PRIVILEGE_DEVELOPER && !user.isDeveloper) return
              return (
                <button
                  onClick={() => {
                    if (hasAsigned)
                      setAsignedPrivileges((prev) =>
                        prev.filter((p) => p !== key)
                      )
                    else handleAsignPrivilege(key)
                  }}
                  className="flex px-2 items-center justify-start text-left w-full gap-2 py-1"
                  key={key}
                >
                  <Checkbox checked={!!hasAsigned} />
                  <WrenchRegular fontSize={25} className="text-blue-500" />
                  <div className="flex-grow">{value}</div>
                </button>
              )
            })}
          </div>
          <footer className="py-4 flex gap-3">
            <Button onClick={handSubmit} appearance="primary">
              {props.onSubmitTitle}
            </Button>
            <Button onClick={() => setOpen(false)} appearance="secondary">
              Cerrar
            </Button>
          </footer>
        </DrawerBody>
      </Drawer>
    </>
  )
}
