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
  Spinner,
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell,
  Tooltip
} from '@fluentui/react-components'
import {
  KeyResetRegular,
  OpenRegular,
  PenRegular,
  PersonProhibitedRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import UserHoverInfo from '~/components/user-hover-info'
import ResetPassword from '~/components/reset-password'

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
      data: JSON.stringify({
        managerId: manager?.id
      })
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
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <UserHoverInfo slug={user.username}>
            <div className="flex items-center gap-2">
              <TableCellLayout
                media={
                  <Avatar
                    name={user.displayName}
                    color="colorful"
                    badge={{
                      status: 'available'
                    }}
                    image={{
                      src: user.photoURL
                    }}
                  />
                }
              >
                <Link
                  className="hover:underline dark:text-blue-500 text-blue-600 relative"
                  to={`/m/users/${user.username}`}
                >
                  {user.displayName}
                </Link>
              </TableCellLayout>
            </div>
          </UserHoverInfo>
        </TableCell>
        <TableCell className="max-sm:hidden">
          <div className="line-clamp-2 opacity-60 text-ellipsis overflow-hidden">
            {/* {user.role?.name ?? ''} */}
          </div>
        </TableCell>
        <TableCell className="max-lg:hidden">
          <p className="dark:text-white relative text-ellipsis overflow-hidden">
            <a href={`mailto:${user.email}`} className="hover:underline">
              {user.email}
            </a>
          </p>
        </TableCell>
        <TableCell className="max-xl:hidden">
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
                !!managerUpdating ||
                !authUser.hasPrivilege('users:asignManager'),
              children: managerUpdating ? (
                <Spinner size="extra-tiny" />
              ) : user.manager ? (
                <div className="flex rounded-xl items-center text-left p-1  shadow-black/80 dark:shadow-lg">
                  <TableCellLayout
                    media={
                      <Avatar
                        name={user.manager.displayName}
                        color="colorful"
                        image={{
                          src: user.manager.photoURL
                        }}
                      />
                    }
                  >
                    {user.manager.displayName}
                  </TableCellLayout>
                </div>
              ) : (
                <div className="p-2">
                  <span className="px-1 py-1 block">Sin jefe</span>
                </div>
              )
            }}
          />
        </TableCell>
        <TableCell>
          <UserGridOptions refetch={refetch} setUser={setUser} user={user} />
        </TableCell>
      </TableRow>
    </>
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

  const [isToggleStatusOpen, setIsToggleStatusOpen] = React.useState(false)
  const [toglingStatus, setToglingStatus] = React.useState(false)

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
      <Tooltip content="Ver perfil" relationship="description">
        <Button
          icon={<OpenRegular />}
          onClick={() => window.open(`/${user.username}`, '_blank')}
          appearance="transparent"
        />
      </Tooltip>
      {authUser.hasPrivilege('users:edit') && (
        <Tooltip content="Editar usuario" relationship="description">
          <Button
            icon={<PenRegular />}
            onClick={() => navigate(`/m/users/${user.username}/edit`)}
            appearance="transparent"
          />
        </Tooltip>
      )}
      {authUser.hasPrivilege('users:resetPassword') && (
        <Tooltip content="Restablecer contraseña" relationship="description">
          <Button
            icon={<KeyResetRegular />}
            onClick={() => setIsResetAlertOpen(true)}
            appearance="transparent"
          />
        </Tooltip>
      )}
      {authUser.hasPrivilege('users:toggleStatus') && (
        <Tooltip content={'Deshabilitar acceso'} relationship="description">
          <Button
            icon={<PersonProhibitedRegular />}
            onClick={() => setIsToggleStatusOpen(true)}
            appearance="transparent"
          />
        </Tooltip>
      )}
      <ResetPassword
        user={user}
        open={isResetAlertOpen}
        setOpen={setIsResetAlertOpen}
      />
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
