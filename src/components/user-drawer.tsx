import { toast } from 'anni'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { User } from '@/types/user'
import {
  Avatar,
  Badge,
  Button,
  ButtonProps,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerHeaderTitle,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular, FolderPeopleRegular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import * as React from 'react'
import SearchBox from '@/commons/search-box'
import { useDebounce } from 'hothooks'

type UserDrawerProps = {
  title?: string
  onlyTeachers?: boolean
  max?: number
  onSubmitTitle?: string
  onSubmit: (user: User[]) => void
  triggerProps?: ButtonProps
  includeCurrentUser?: boolean
  users?: User[]
}

export default function UserDrawer(props: UserDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>(
    props.users || []
  )

  const handleSubmit = () => {
    setOpen(false)
    props.onSubmit(selectedUsers)
  }

  React.useEffect(() => {
    setSelectedUsers(props.users || [])
  }, [props.users])

  return (
    <>
      <Button {...props.triggerProps} onClick={() => setOpen(true)} />
      <Drawer
        position="end"
        separator
        className="xl:min-w-[50svw] lg:min-w-[80svw] max-w-full min-w-full"
        open={open}
        type="overlay"
        modalType="alert"
        onOpenChange={(_, { open }) => setOpen(open)}
      >
        <DrawerHeaderTitle
          className="px-5 py-3 w-full"
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
          {open && (
            <Users
              {...props}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          )}
          <footer className="border-t py-4 flex gap-3 dark:border-neutral-500/30">
            <Button onClick={handleSubmit} appearance="primary">
              {props.onSubmitTitle}
            </Button>
            <Button onClick={() => setOpen(false)} appearance="outline">
              Cerrar
            </Button>
          </footer>
        </DrawerBody>
      </Drawer>
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
    onlyTeachers,
    includeCurrentUser = true
  } = props

  const [query, setQuery] = React.useState<string | null>(null)

  const uri = `users/all?status=actives&limit=15&q=${query}${
    onlyTeachers ? '&onlyTeachers=true' : ''
  }`

  const {
    data: users,
    refetch,
    isLoading
  } = useQuery<User[]>({
    queryKey: ['users/all', query],
    queryFn: async () => {
      if (!query) return []
      const res = await api.get<User[]>(
        uri.replace(/&+/g, '&').replace(/(\?|&)$/, '')
      )
      if (!res.ok) return []
      return res.data.map((u) => new User(u))
    }
  })

  React.useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const { setValue } = useDebounce({
    delay: 700,
    onFinish: setQuery
  })

  const handleAddOrRemoveUser = (u: User) => {
    const selected = selectedUsers.find((user) => user.id === u.id)

    if (max === 1) {
      return selected ? setSelectedUsers([]) : setSelectedUsers([u])
    }

    if (selectedUsers.length >= max && !selected) {
      toast.warning(`Solo puedes seleccionar ${max} usuarios`)
      return
    }

    if (selected) {
      setSelectedUsers((prev) => prev.filter((user) => user !== u))
    } else {
      setSelectedUsers((prev) => [...prev, u])
    }
  }

  const list = users && users?.length > 0 ? users : selectedUsers

  return (
    <div className="flex flex-col flex-grow h-full overflow-y-auto gap-2">
      <nav className="pb-3 flex items-center gap-4 border-b dark:border-stone-700">
        <SearchBox
          onSearch={setValue}
          className="w-[400px] max-lg:w-full"
          placeholder="Filtrar por nombre o correo"
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
            <div className="h-full grid place-content-center">
              <Spinner size="large" />
            </div>
          ) : (
            <div className="overflow-y-auto h-full flex-grow divide-neutral-500/20 divide-y">
              {list.map((u) => {
                const selected = selectedUsers.find((user) => user.id === u.id)
                if (!includeCurrentUser && u.id === user.id) return null
                return (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-center gap-2 py-1"
                  >
                    <div>
                      <Checkbox
                        checked={selected ? true : false}
                        onChange={() => handleAddOrRemoveUser(u)}
                      />
                    </div>
                    <Avatar
                      color="colorful"
                      size={40}
                      name={u?.displayName}
                      image={{
                        src: u?.photoURL
                      }}
                    />
                    <div className="flex-grow text-base font-semibold">
                      <p>{u?.displayName}</p>
                    </div>
                  </label>
                )
              })}
              {list && list.length < 1 && (
                <div className="py-3 h-full font-semibold grid place-content-center">
                  <FolderPeopleRegular fontSize={40} className="mx-auto" />
                  <p className="text-center pt-2 text-sm">
                    No se encontraron usuarios
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        {max > 1 && (
          <div className="ml-2 rounded-xl flex flex-col bg-neutral-100 dark:bg-black/50 py-3 overflow-y-auto">
            <h2 className="px-3">
              Personas seleccionadas ({selectedUsers.length} / {max})
            </h2>
            <div className="overflow-y-auto h-full flex-grow divide-y divide-neutral-500/60">
              {selectedUsers.map((u) => {
                return (
                  <div key={u.id} className="flex px-4 items-center gap-2 py-3">
                    <Avatar
                      size={40}
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
