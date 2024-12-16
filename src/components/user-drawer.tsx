import { toast } from '~/commons/toast'
import { useDebounced } from '~/hooks/use-debounced'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { User } from '~/types/user'
import {
  Avatar,
  Badge,
  Button,
  ButtonProps,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  SearchBox,
  SkeletonItem,
  useRestoreFocusSource,
  useRestoreFocusTarget
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

type UserDrawerProps = {
  title?: string
  max?: number
  onSubmitTitle?: string
  onSubmit: (user: User[]) => void
  triggerProps?: ButtonProps
  includeCurrentUser?: boolean
  users?: User[]
}

export default function UserDrawer(props: UserDrawerProps) {
  const restoreFocusTargetAttributes = useRestoreFocusTarget()
  const restoreFocusSourceAttributes = useRestoreFocusSource()
  const [open, setOpen] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>(
    props.users || []
  )

  const handleSubmit = () => {
    setOpen(false)
    props.onSubmit(selectedUsers)
  }
  return (
    <>
      <Button
        {...props.triggerProps}
        {...restoreFocusTargetAttributes}
        onClick={() => setOpen(true)}
      />
      {open && (
        <Drawer
          position="end"
          {...restoreFocusSourceAttributes}
          separator
          className="xl:min-w-[50svw] lg:min-w-[80svw] max-w-full min-w-full"
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
            {open && (
              <Users
                {...props}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
              />
            )}
            <footer className="border-t py-4 flex gap-3 border-stone-500">
              <Button onClick={handleSubmit} appearance="primary">
                {props.onSubmitTitle}
              </Button>
              <Button onClick={() => setOpen(false)} appearance="outline">
                Cerrar
              </Button>
            </footer>
          </DrawerBody>
        </Drawer>
      )}
    </>
  )
}

export function Users(
  props: UserDrawerProps & {
    selectedUsers: User[]
    setSelectedUsers: React.Dispatch<React.SetStateAction<User[]>>
  }
) {
  const { user } = useAuth()
  const {
    max = 1,
    selectedUsers,
    setSelectedUsers,
    includeCurrentUser = true
  } = props

  const [query, setQuery] = React.useState<string>(
    props.users?.length === 1 ? props.users[0].email : ''
  )

  const {
    data: users,
    refetch,
    isLoading
  } = useQuery<User[]>({
    queryKey: ['users/all', query],
    queryFn: async () => {
      const res = await api.get<User[]>('users/all?limit=15&q=' + query)
      if (!res.ok) return []
      return res.data.map((u) => new User(u))
    }
  })

  React.useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const { onChangeValue } = useDebounced({
    delay: 700,
    onCompleted: setQuery
  })

  const handleAddOrRemoveUser = (u: User) => {
    const selected = selectedUsers.find((user) => user.id === u.id)

    if (max === 1) {
      return selected ? setSelectedUsers([]) : setSelectedUsers([u])
    }

    if (selectedUsers.length >= max && !selected) {
      toast(`Solo puedes seleccionar ${max} usuarios`)
      return
    }

    if (selected) {
      setSelectedUsers((prev) => prev.filter((user) => user !== u))
    } else {
      setSelectedUsers((prev) => [...prev, u])
    }
  }

  return (
    <div className="flex flex-col flex-grow h-full overflow-y-auto gap-4">
      <nav className="pb-3 flex items-center gap-4">
        <SearchBox
          onChange={(_, e) => onChangeValue(e.value)}
          defaultValue={query}
          style={{
            maxWidth: '100%'
          }}
          placeholder="Filtrar colaboradores"
        />
        {selectedUsers.length > 0 && (
          <Badge appearance="tint" color="success">
            Selecionados {selectedUsers.length}
          </Badge>
        )}
      </nav>
      <div
        data-grided={max > 1 ? '' : undefined}
        className="grid data-[grided]:grid-cols-2 flex-grow pb-4 overflow-y-auto"
      >
        <div className="w-full overflow-y-auto">
          {isLoading ? (
            <div className="space-y-5">
              <div className="grid items-center gap-5 grid-cols-[min-content,20%,20%,15%,15%]">
                <SkeletonItem
                  className="animate-pulse"
                  shape="circle"
                  size={24}
                />
                <SkeletonItem className="animate-pulse" size={16} />
                <SkeletonItem className="animate-pulse" size={16} />
                <SkeletonItem className="animate-pulse" size={16} />
                <SkeletonItem className="animate-pulse" size={16} />
              </div>
              <div className="grid items-center gap-5 grid-cols-[min-content,20%,20%,15%,15%]">
                <SkeletonItem
                  className="animate-pulse"
                  shape="circle"
                  size={24}
                />
                <SkeletonItem className="animate-pulse" size={16} />
                <SkeletonItem className="animate-pulse" size={16} />
                <SkeletonItem className="animate-pulse" size={16} />
                <SkeletonItem className="animate-pulse" size={16} />
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto divide-y divide-black">
              {users?.map((u) => {
                const selected = selectedUsers.find((user) => user.id === u.id)
                if (!includeCurrentUser && u.id === user.id) return null
                return (
                  <label
                    data-blocked={!u.status ? '' : undefined}
                    key={u.id}
                    className="flex data-[blocked]:grayscale data-[blocked]:opacity-90 cursor-pointer items-center gap-2 py-3"
                  >
                    <div>
                      <Checkbox
                        checked={selected ? true : false}
                        onChange={() => handleAddOrRemoveUser(u)}
                      />
                    </div>
                    <Avatar
                      badge={{
                        status: u.status ? 'available' : 'blocked'
                      }}
                      color="colorful"
                      size={36}
                      name={u.displayName}
                      image={{
                        src: u.photoURL
                      }}
                    />
                    <div className="flex-grow">
                      <p>{u.displayName}</p>
                      <p className="text-xs dark:text-blue-500">{u.email}</p>
                    </div>
                  </label>
                )
              })}
              {users && users.length < 1 && (
                <div className="py-3">
                  <p className="text-center opacity-70 text-sm">
                    No se encontraron colaboradores
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {max > 1 && (
          <div className="ml-2 rounded-xl flex flex-col bg-black/50 py-3 overflow-y-auto">
            <h2 className="px-3">
              Personas seleccionadas ({selectedUsers.length} / {max})
            </h2>
            <div className="overflow-y-auto h-full flex-grow divide-y divide-neutral-500/60">
              {selectedUsers.map((u) => {
                return (
                  <div key={u.id} className="flex px-4 items-center gap-2 py-3">
                    <Avatar
                      size={36}
                      color="colorful"
                      name={u.displayName}
                      image={{
                        src: u.photoURL
                      }}
                    />
                    <div className="flex-grow">
                      <p className="text-nowrap">{u.displayName}</p>
                      <p className="text-nowrap text-xs opacity-50">
                        {u.email}
                      </p>
                    </div>
                    <div>
                      <Button
                        onClick={() => handleAddOrRemoveUser(u)}
                        size="small"
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                )
              })}
              {selectedUsers.length < 1 && (
                <div className="flex-grow h-full grid place-content-center">
                  <p className="text-center opacity-70 text-sm">
                    No hay usuarios seleccionados
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
