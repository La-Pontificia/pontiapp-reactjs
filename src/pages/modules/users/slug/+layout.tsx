import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { User } from '~/types/user'
import { handleAuthError } from '~/utils'
import {
  Avatar,
  Badge,
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
  SplitButton,
  Tab,
  TabList
} from '@fluentui/react-components'
import {
  CopyRegular,
  MoreHorizontal20Filled,
  PenRegular,
  SendFilled
} from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React, { createContext } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '~/store/auth'
import ExpiryStatusRenderer from '~/components/expiry-status-renderer'

type AuthState = {
  user?: User | null
  isLoading: boolean
  rootURL: string
}
const UserSlugContext = createContext<AuthState>({} as AuthState)

// eslint-disable-next-line react-refresh/only-export-components
export const useSlugUser = () => React.useContext(UserSlugContext)

export default function CollaboratorsSlugLayout(): JSX.Element {
  const { user: authUser } = useAuth()

  const params = useParams<{
    slug: string
  }>()

  const TABS: Record<
    string,
    {
      label: string
      badge?: string
      fromBadge?: Date
    }
  > = {
    '': {
      label: 'Descripción general'
    },
    organization: {
      label: 'Organización'
    },
    properties: {
      label: 'Propiedades'
    },
    schedules: {
      label: 'Horarios'
    },
    assists: {
      label: 'Asistencias',
      badge: 'Nuevo',
      fromBadge: new Date('2025-01-04')
    }
    // history: 'Historial'
  }

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const tabKey = pathname.split('/').pop() || ''
  const tabKeyExists = tabKey in TABS
  const slug = params.slug
  const isRouteInternal = pathname.startsWith('/m/users')
  const rootURL = isRouteInternal ? '/m/users' : ''

  const {
    data: user,
    isLoading,
    refetch
  } = useQuery<User | null>({
    queryKey: ['slug', slug],
    queryFn: async () => {
      const res = await api.get<User>(
        'users/' +
          slug +
          '?relationship=role,role.department,role.department.area'
      )
      if (!res.ok) return null
      return new User(res.data)
    },
    gcTime: 1000 * 60 * 60 * 5
  })

  if (!isLoading && !user)
    return (
      <div className="p-20 text-center">
        <h1>
          OPPS! No se ha encontrado el id <code>{slug}</code>
        </h1>
      </div>
    )

  const phoneContact = user?.contacts?.find(
    (c) => c.type === 'phone' || c.type === 'whatsapp'
  )

  return (
    <div className="relative p-2 max-lg:pt-0 h-full w-full flex flex-col overflow-y-auto rounded-0">
      <Helmet>
        <title>{user ? user.displayName : ''} | PontiApp</title>
      </Helmet>
      <div className="mx-auto max-lg:min-h-auto min-h-[180px] flex max-w-5xl flex-col w-full pr-5">
        <div className="h-full flex flex-grow items-center">
          <div className="flex flex-grow h-full items-center gap-5 py-5 pl-5">
            {isLoading ? (
              <>
                <div className="aspect-square w-[128px] bg-neutral-500/20 animate-pulse rounded-full"></div>
                <div className="space-y-4">
                  <div className="w-[128px] h-[20px] bg-neutral-500/20 animate-pulse rounded-full"></div>
                  <div className="w-[200px] h-[10px] bg-neutral-500/20 animate-pulse rounded-full"></div>
                </div>
              </>
            ) : (
              user && (
                <>
                  <Avatar
                    badge={{
                      status: user.status ? 'available' : 'blocked'
                    }}
                    size={128}
                    color="colorful"
                    name={user.displayName}
                    image={{
                      src: user.photoURL,
                      alt: user.displayName
                    }}
                  />
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold line-clamp-1">
                      {user.displayName}
                    </h1>
                    <p className="line-clamp-1 overflow-hidden text-ellipsis gap-2 hover:[&>a]:underline">
                      {user.role?.name} • {user.role?.department?.name}
                    </p>
                    <div className="flex gap-4 items-center">
                      <SplitButton
                        menuButton={{
                          icon: <CopyRegular fontSize={25} />,
                          onClick: () => {
                            navigator.clipboard.writeText(user.email)
                            toast('Copiado a portapapeles.')
                          }
                        }}
                        primaryActionButton={{
                          icon: (
                            <SendFilled className="-rotate-45" fontSize={16} />
                          ),
                          onClick: () => {
                            window.open(
                              `mailto:${user.email}?subject=Hola ${user.displayName}`
                            )
                          }
                        }}
                        appearance="primary"
                      >
                        Enviar mensaje
                      </SplitButton>
                      {phoneContact && (
                        <button
                          onClick={() => {
                            window.open(`https://wa.me/${phoneContact.value}`)
                          }}
                          className="flex gap-1 items-center"
                        >
                          <FaWhatsapp
                            size={25}
                            className="dark:text-green-500 text-green-600"
                          />
                          WhatsApp
                        </button>
                      )}
                      {authUser.hasPrivilege('users:edit') && (
                        <div className="max-lg:hidden">
                          <Button
                            onClick={() =>
                              navigate(`/m/users/edit/${user.username}`)
                            }
                            appearance="secondary"
                            icon={<PenRegular />}
                          >
                            Editar
                          </Button>
                        </div>
                      )}
                      {user && <UserOptions refetch={refetch} user={user} />}
                    </div>
                    {!user?.status && (
                      <p className="dark:text-red-500 text-red-700 text-sm">
                        Sin acceso a la aplicación.
                      </p>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
      <nav className="flex border-b dark:border-neutral-800 items-center gap-4 px-2">
        <div className="max-w-5xl mx-auto w-full">
          {isLoading ? (
            <div className="my-3 flex gap-10 px-4">
              <div className="w-[50px] h-[20px] bg-neutral-500/20 animate-pulse rounded-full"></div>
              <div className="w-[50px] h-[20px] bg-neutral-500/20 animate-pulse rounded-full"></div>
              <div className="w-[50px] h-[20px] bg-neutral-500/20 animate-pulse rounded-full"></div>
              <div className="w-[50px] h-[20px] bg-neutral-500/20 animate-pulse rounded-full"></div>
            </div>
          ) : (
            <TabList
              selectedValue={tabKeyExists ? tabKey : ''}
              onTabSelect={(_, d) =>
                navigate(`${rootURL}/${params.slug}/${d.value}`)
              }
              appearance="subtle"
            >
              {Object.entries(TABS).map(([key, value]) => (
                <Tab key={key} value={key}>
                  {value.label}
                  {value.badge && (
                    <ExpiryStatusRenderer from={value.fromBadge!}>
                      <Badge className="ml-1" appearance="tint">
                        {value.badge}
                      </Badge>
                    </ExpiryStatusRenderer>
                  )}
                </Tab>
              ))}
            </TabList>
          )}
        </div>
      </nav>
      <UserSlugContext.Provider
        value={{
          user: user,
          isLoading,
          rootURL
        }}
      >
        <div className="flex flex-grow w-full mx-auto overflow-y-auto">
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
  const navigate = useNavigate()
  const [isResetAlertOpen, setIsResetAlertOpen] = React.useState(false)
  const [resetingPassword, setResetingPassword] = React.useState(false)

  const [isToggleStatusOpen, setIsToggleStatusOpen] = React.useState(false)
  const [toglingStatus, setToglingStatus] = React.useState(false)

  const { user: authUser } = useAuth()

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
    <>
      <Menu positioning={{ autoSize: true }}>
        <MenuTrigger disableButtonEnhancement>
          <button className="relative p-0 opacity-60">
            <MoreHorizontal20Filled />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {authUser.hasPrivilege('users:edit') && (
              <MenuItem
                onClick={() => navigate(`/m/users/edit/${user.username}`)}
              >
                Editar usuario
              </MenuItem>
            )}
            {authUser.hasPrivilege('users:resetPassword') && (
              <MenuItem onClick={() => setIsResetAlertOpen(true)}>
                Restablecer contraseña
              </MenuItem>
            )}
            {authUser.hasPrivilege('users:toggleStatus') && (
              <MenuItem onClick={() => setIsToggleStatusOpen(true)}>
                {user.status ? 'Deshabilitar acceso' : 'Habilitar acceso'}
              </MenuItem>
            )}
            {authUser.hasPrivilege('users:createVersion') && (
              <MenuItem>Crear una version</MenuItem>
            )}
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

      {isToggleStatusOpen && (
        <Dialog
          open={isToggleStatusOpen}
          onOpenChange={(_, e) => setIsToggleStatusOpen(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                ¿Estás seguro que deseas{' '}
                {user.status ? 'deshabilitar' : 'habilitar'} a{' '}
                {user.displayName}?
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
      )}
    </>
  )
}
