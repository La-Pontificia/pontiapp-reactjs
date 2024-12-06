import { PRIVILEGE_DEVELOPER, PRIVILEGES } from '@/const'
import { useAuth } from '@/store/auth'
import {
  Badge,
  Button,
  ButtonProps,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  SearchBox,
  useRestoreFocusSource,
  useRestoreFocusTarget
} from '@fluentui/react-components'
import { Dismiss24Regular, GlobeSearch24Regular } from '@fluentui/react-icons'
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
  const restoreFocusTargetAttributes = useRestoreFocusTarget()
  const restoreFocusSourceAttributes = useRestoreFocusSource()
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

  React.useEffect(() => {
    setPrivileges(PRIVILEGES)
  }, [props.asignedPrivileges])

  const handleAsignPrivilege = (key: string) => {
    setAsignedPrivileges((prev) => [...prev, key])
  }

  const handSubmit = () => {
    setOpen(false)
    props.onSubmit(asignedPrivileges)
  }

  return (
    <>
      <Button
        {...props.triggerProps}
        {...restoreFocusTargetAttributes}
        onClick={() => setOpen(true)}
      />
      <Drawer
        position="end"
        {...restoreFocusSourceAttributes}
        separator
        className="md:min-w-[50svw] min-w-full w-full max-w-full"
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
            {props.title}
          </DrawerHeaderTitle>
        </DrawerHeader>

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
          <div className="px-1 flex-grow h-full divide-y bg-black/50 rounded-2xl overflow-y-auto divide-neutral-500/20">
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
                  className="flex items-center px-5 justify-start text-left w-full gap-2 py-2"
                  key={key}
                >
                  <Checkbox checked={!!hasAsigned} />
                  <GlobeSearch24Regular className="text-blue-500" />
                  <div className="flex-grow">
                    <p>{value}</p>
                    <span className="text-xs dark:text-stone-400">{key}</span>
                  </div>
                </button>
              )
            })}
          </div>
          <footer className="py-4 flex gap-3 border-stone-500">
            <Button onClick={handSubmit} appearance="primary">
              {props.onSubmitTitle}
            </Button>
          </footer>
        </DrawerBody>
      </Drawer>
    </>
  )
}
