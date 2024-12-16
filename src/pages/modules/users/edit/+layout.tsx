import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { User } from '~/types/user'
import { handleAuthError } from '~/utils'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Tab,
  TabList
} from '@fluentui/react-components'
import {
  MoreHorizontal20Filled,
  PersonPasskeyRegular
} from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React, { createContext } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { IoIosGitMerge } from 'react-icons/io'
import { useAuth } from '~/store/auth'

type AuthState = {
  user?: User | null
  isLoading: boolean
  refetch: () => void
}
const UserSlugContext = createContext<AuthState>({} as AuthState)

// eslint-disable-next-line react-refresh/only-export-components
export const useEditUser = () => React.useContext(UserSlugContext)

export default function CollaboratorsEditLayout(): JSX.Element {
  const params = useParams<{
    slug: string
  }>()
  const { user: authUser } = useAuth()

  const TABS = {
    '': 'Cuenta',
    organization: 'Organización',
    properties: 'Propiedades',
    schedules: 'Horarios'
  }

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const tabKey = pathname.split('/').pop() || ''
  const tabKeyExists = tabKey in TABS
  const slug = params.slug

  const {
    data: user,
    isLoading,
    refetch
  } = useQuery<User | null>({
    queryKey: ['slug/edit', slug],
    queryFn: async () => {
      const res = await api.get<User>(
        'users/' +
          slug +
          '?relationship=role,role.department,role.job,contractType,role.department.area,userRole,manager'
      )
      if (!res.ok) return null
      return new User(res.data)
    },
    gcTime: 1000 * 60 * 60 * 5
  })

  if (!authUser.hasPrivilege('users:edit')) navigate('/m/users/all')

  if (isLoading)
    return (
      <div className="p-20 text-center w-full h-full grid place-content-center">
        <Spinner size="huge" />
      </div>
    )

  if (!user)
    return (
      <div className="p-20 text-center w-full">No se encontró el usuario</div>
    )

  return (
    <div className="relative h-full w-full flex flex-col overflow-y-auto">
      <Helmet>
        <title>{user ? user.displayName : ''} - Editar | PontiApp</title>
      </Helmet>
      <nav className="flex flex-none gap-3 py-3 border-b border-stone-500/20 w-full overflow-x-auto px-2">
        <div className="flex items-center gap-3">
          <Avatar
            size={48}
            badge={{
              status: user.status ? 'available' : 'blocked'
            }}
            color="colorful"
            name={user.displayName}
            image={{
              src: user.photoURL,
              alt: user.displayName
            }}
          />
          <div>
            <h1 className="font-bold text-lg tracking-tight text-nowrap">
              {user.fullName}
            </h1>
            <p className="text-xs opacity-60">
              {user.role?.name} {user.role?.department?.name}
            </p>
          </div>
        </div>
        <UserOptions refetch={refetch} user={user} />
      </nav>
      <nav className="flex gap-2 w-full items-center">
        <TabList
          className="h-full"
          selectedValue={tabKeyExists ? tabKey : ''}
          onTabSelect={(_, d) =>
            navigate(`/m/users/edit/${params.slug}/${d.value}`)
          }
          appearance="transparent"
        >
          {Object.entries(TABS).map(([key, value]) => (
            <Tab key={key} value={key}>
              {value}
            </Tab>
          ))}
        </TabList>
      </nav>
      <UserSlugContext.Provider
        value={{
          refetch,
          user: user,
          isLoading
        }}
      >
        <div className="flex flex-grow w-full overflow-y-auto">
          <Outlet />
        </div>
      </UserSlugContext.Provider>
    </div>
  )
}

export const UserOptions = ({
  user,
  refetch
}: {
  user: User
  refetch: () => void
}) => {
  const [isResetAlertOpen, setIsResetAlertOpen] = React.useState(false)
  const [resetingPassword, setResetingPassword] = React.useState(false)

  const [isToggleStatusOpen, setIsToggleStatusOpen] = React.useState(false)
  const [toglingStatus, setToglingStatus] = React.useState(false)

  const handleResetPassword = async () => {
    setResetingPassword(true)
    const res = await api.post<string>(`users/${user.id}/reset-password`)
    if (!res.ok) {
      setResetingPassword(false)
      return toast(handleAuthError(res.error))
    }
    setResetingPassword(false)
    setIsResetAlertOpen(false)

    // copy to clipboard
    navigator.clipboard.writeText(res.data)
    toast('Copiada a portapapeles.')
    refetch()
  }

  const handleToogleStatus = async () => {
    setToglingStatus(true)
    const res = await api.post<string>(`users/${user.id}/toggle-status`)
    if (!res.ok) {
      setToglingStatus(false)
      return toast(handleAuthError(res.error))
    }
    setToglingStatus(false)
    setIsToggleStatusOpen(false)
    toast(
      `Usuario ${user.displayName} ${
        user.status ? 'deshabilitado' : 'habilitado'
      }.`
    )
    refetch()
  }

  return (
    <div className="flex ml-auto items-center gap-1 dark:text-stone-300">
      <button
        onClick={() => setIsResetAlertOpen(true)}
        className="flex flex-col text-nowrap items-center gap-1 text-xs rounded-md p-2 hover:bg-stone-500/10"
      >
        <PersonPasskeyRegular fontSize={20} className="dark:text-blue-600" />
        <span className="max-lg:hidden"> Restablecer contraseña</span>
      </button>
      <button className="flex flex-col text-nowrap items-center gap-1 text-xs rounded-md p-2 hover:bg-stone-500/10">
        <IoIosGitMerge size={20} className="dark:text-blue-600" />
        <span className="max-lg:hidden">Crear versión</span>
      </button>
      <Menu positioning={{ autoSize: true }}>
        <MenuTrigger disableButtonEnhancement>
          <button className="relative p-0 opacity-60">
            <MoreHorizontal20Filled />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem onClick={() => setIsToggleStatusOpen(true)}>
              {user.status ? 'Deshabilitar acceso' : 'Habilitar acceso'}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {isResetAlertOpen && (
        <Dialog
          open={isResetAlertOpen}
          onOpenChange={(_, e) => setIsResetAlertOpen(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                ¿Estás seguro que deseas restablecer la contraseña de{' '}
                {user.displayName}?
              </DialogTitle>
              <DialogContent>
                Una vez restablecida, la nueva contraseña sera visible en la
                alerta de notificación.
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
                <Button
                  onClick={handleResetPassword}
                  disabled={resetingPassword}
                  icon={resetingPassword ? <Spinner size="tiny" /> : undefined}
                  appearance="primary"
                >
                  Restablecer
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}

      <Dialog
        open={isToggleStatusOpen}
        onOpenChange={(_, e) => setIsToggleStatusOpen(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿Estás seguro que deseas{' '}
              {user.status ? 'deshabilitar' : 'habilitar'} a {user.displayName}?
            </DialogTitle>
            <DialogContent>
              {user.status
                ? 'El usuario no podrá acceder a la plataforma.'
                : 'El usuario podrá acceder a la plataforma.'}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={handleToogleStatus}
                disabled={toglingStatus}
                icon={toglingStatus ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                {user.status ? 'Deshabilitar' : 'Habilitar'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
