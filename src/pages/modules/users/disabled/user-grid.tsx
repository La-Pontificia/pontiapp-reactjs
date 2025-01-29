import { toast } from 'anni'
import UserDrawer from '~/components/user-drawer'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
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
  Spinner
} from '@fluentui/react-components'
import { MoreHorizontal20Filled } from '@fluentui/react-icons'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import UserHoverInfo from '~/components/user-hover-info'

export default function UserGrid({
  user: userProp,
  refetch
}: {
  user: User
  refetch: () => void
}) {
  const [managerUpdating, setManagerUpdating] = React.useState(false)
  const [user, setUser] = React.useState(new User(userProp))
  const { user: authUser } = useAuth()

  const handleManager = async (manager?: User) => {
    setManagerUpdating(true)
    const res = await api.post(`users/${user.id}/manager`, {
      data: {
        managerId: manager?.id
      }
    })
    if (!res.ok) {
      setManagerUpdating(false)
      return toast(handleAuthError(res.error))
    }
    setManagerUpdating(false)
    setUser(
      (u) =>
        new User({
          ...u,
          manager: manager ? new User(manager) : undefined
        } as User)
    )
    refetch()
    toast('Jefe actualizado correctamente.')
  }
  return (
    <tr className="relative [&>td]:text-nowrap group [&>td]:p-2 [&>td]:px-3">
      <td>
        <UserHoverInfo slug={user.username}>
          <div className="flex items-center gap-2">
            <Avatar
              size={40}
              color="colorful"
              name={user.displayName}
              aria-label={user.displayName}
              image={{
                src: user.photoURL
              }}
            />
            <Link
              className="hover:underline font-semibold relative"
              to={`/m/users/${user.username}`}
            >
              {user.displayName}
            </Link>
          </div>
        </UserHoverInfo>
      </td>
      <td className="max-sm:hidden">
        <div className="max-w-[30ch] opacity-70 text-ellipsis overflow-hidden">
          {user.role.name}
        </div>
      </td>
      <td className="max-lg:hidden">
        <p className="dark:text-white relative max-xl:max-w-[20ch] text-ellipsis overflow-hidden">
          <a href={`mailto:${user.email}`} className="hover:underline">
            {user.email}
          </a>
        </p>
      </td>
      <td className="max-xl:hidden">
        <UserDrawer
          max={1}
          users={user.manager ? [user.manager] : []}
          title="Jefe inmediato"
          onSubmitTitle="Cambiar jefe"
          onSubmit={(v) => handleManager(v[0])}
          triggerProps={{
            appearance: 'transparent',
            style: {
              padding: 0,
              'box-shadow': 'none !important',
              border: 'none !important',
              borderRadius: '12px !important'
            } as React.CSSProperties,
            disabled:
              !!managerUpdating || !authUser.hasPrivilege('users:asignManager'),
            children: managerUpdating ? (
              <Spinner size="extra-tiny" />
            ) : user.manager ? (
              <div className="flex rounded-xl items-center p-1  shadow-black/80 dark:shadow-lg">
                <Avatar
                  size={20}
                  color="steel"
                  name={user.manager.displayName}
                  image={{
                    src: user.manager.photoURL
                  }}
                />
                <span className="px-1 font-medium dark:text-white text-black">
                  {user.manager.displayName}
                </span>
              </div>
            ) : (
              <div className="p-2">
                <span className="px-1 py-1 block">Sin jefe</span>
              </div>
            )
          }}
        />
      </td>
      <td className="">
        <UserGridOptions refetch={refetch} setUser={setUser} user={user} />
      </td>
    </tr>
  )
}

export const UserGridOptions = ({
  setUser,
  user,
  refetch
}: {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  refetch: () => void
}) => {
  const navigate = useNavigate()

  const { user: authUser } = useAuth()

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
    setUser(
      (u) =>
        new User({
          ...u,
          status: !u.status
        } as User)
    )
    toast(
      `Usuario ${user.displayName} ${
        user.status ? 'deshabilitado' : 'habilitado'
      }.`
    )
    refetch()
  }

  return (
    <>
      <Menu hasIcons positioning={{ autoSize: true }}>
        <MenuTrigger disableButtonEnhancement>
          <Button
            style={{
              padding: 0
            }}
            appearance="transparent"
            className="relative opacity-60"
          >
            <MoreHorizontal20Filled />
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              onClick={() => window.open(`/${user.username}`, '_blank')}
            >
              Ver perfil
            </MenuItem>
            {authUser.hasPrivilege('users:edit') && (
              <MenuItem
                disabled={!authUser.hasPrivilege('users:edit')}
                onClick={() => navigate(`/m/users/edit/${user.username}`)}
              >
                Editar
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
          </MenuList>
        </MenuPopover>
      </Menu>

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
    </>
  )
}
