import {
  Avatar,
  Badge,
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Option,
  Spinner
} from '@fluentui/react-components'
import {
  BuildingPeopleRegular,
  DeleteFilled,
  PenFilled,
  ShareRegular
} from '@fluentui/react-icons'
import React from 'react'
import { format, timeAgo } from '@/lib/dayjs'
import { api } from '@/lib/api'
import { handleError } from '@/utils'
import { toast } from 'anni'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/store/auth'
import { UserRole } from '@/types/user-role'
import Form from './form'

export default function Item({
  item,
  refetch
}: {
  item: UserRole
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openTransfer, setOpenTransfer] = React.useState(false)

  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`partials/user-roles/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast.error(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast.success(`${item.title} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <tr className="relative bg-white dark:bg-[#292827] [&>td]:text-nowrap group [&>td]:p-2 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar
              icon={<BuildingPeopleRegular />}
              color="colorful"
              size={40}
              name={item.title}
              aria-label={item.title}
            />
            <p className="line-clamp-3">{item.title}</p>
          </div>
        </td>
        <td>
          <p className="opacity-70 text-nowrap">
            {item.privileges?.length || 0} Privilegio
            {item.privileges?.length === 1 ? '' : 's'}
          </p>
        </td>
        <td>
          <p className="text-nowrap">
            {item.usersCount} Usuario{item.usersCount === 1 ? '' : 's'}
          </p>
        </td>
        <td>
          <Badge color="warning" appearance="tint">
            Nivel {item.level}
          </Badge>
        </td>
        <td>
          <p className="text-nowrap">
            Registrado el {format(item.created_at, 'DD/MM/YYYY')}
          </p>
          <p className="text-xs opacity-60">{timeAgo(item.created_at)}</p>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Form
              defaultValues={item}
              refetch={refetch}
              triggerProps={{
                size: 'small',
                appearance: 'transparent',
                children: (
                  <Badge
                    icon={<PenFilled fontSize={15} />}
                    appearance="tint"
                    color="success"
                  >
                    Editar
                  </Badge>
                )
              }}
            />
            <button onClick={() => setOpenDelete(true)}>
              <Badge
                icon={<DeleteFilled fontSize={15} />}
                appearance="tint"
                color="danger"
              >
                Eliminar
              </Badge>
            </button>
            <button onClick={() => setOpenTransfer(true)}>
              <Badge
                icon={<ShareRegular fontSize={15} />}
                appearance="tint"
                color="important"
              >
                Transferir
              </Badge>
            </button>
            {openTransfer && (
              <TransferForm
                item={item}
                openTransfer={openTransfer}
                refetch={refetch}
                setOpenTransfer={setOpenTransfer}
              />
            )}
          </div>
        </td>
      </tr>
      {openDelete && (
        <Dialog
          open={openDelete}
          onOpenChange={(_, e) => setOpenDelete(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                ¿Estás seguro de eliminar el rol: {item.title}?
              </DialogTitle>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  icon={deleting ? <Spinner size="tiny" /> : undefined}
                  appearance="primary"
                >
                  ELiminar
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  )
}

const TransferForm = ({
  item,
  openTransfer,
  setOpenTransfer,
  refetch
}: {
  item: UserRole
  refetch: () => void
  openTransfer: boolean
  setOpenTransfer: (open: boolean) => void
}) => {
  const [transferring, setTransferring] = React.useState(false)
  const [transferItem, setTransferItem] = React.useState<UserRole>(item)

  const { user } = useAuth()

  const handleTransfer = async () => {
    if (!transferItem.id) return toast.success('Seleccione un rol')
    if (transferItem.id === item.id)
      return toast.success('No puedes transferir usuarios al mismo rol')

    setTransferring(true)
    const res = await api.post(`partials/roles-roles/${item?.id}/transfer`, {
      data: JSON.stringify({
        userRoleId: transferItem.id
      })
    })
    if (!res.ok) {
      setTransferring(false)
      return toast.error(handleError(res.error))
    }
    setTransferring(false)
    setOpenTransfer(false)
    toast.success(`Usuarios transferidos correctamente`)
    refetch()
  }

  const { data: userRoles, isLoading: isRolesLoading } = useQuery<UserRole[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get<UserRole[]>(`partials/user-roles/all`)
      if (!res.ok) return []
      return res.data.map((role) => new UserRole(role))
    }
  })

  return (
    <Dialog
      open={openTransfer}
      onOpenChange={(_, e) => setOpenTransfer(e.open)}
      modalType="modal"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            Transferir {item.usersCount} usuario
            {item.usersCount === 1 ? '' : 's'} de {item.title}.
          </DialogTitle>
          <DialogContent>
            <div className="pb-2">
              Seleccione el rol al que desea transferir.
            </div>
            <div className="pt-3">
              <Field required label="Transferir al rol:">
                <Combobox
                  input={{
                    autoComplete: 'off'
                  }}
                  selectedOptions={[transferItem.id]}
                  disabled={isRolesLoading}
                  onOptionSelect={(_, data) => {
                    const role = userRoles?.find(
                      (r) => r.id === data.optionValue
                    )
                    if (role) setTransferItem(role)
                  }}
                  value={transferItem.title ?? ''}
                  placeholder="Selecciona un rol"
                >
                  {userRoles?.map((u) =>
                    u.isDeveloper && !user.isDeveloper ? null : (
                      <Option key={u.id} text={u.title} value={u.id}>
                        {u.title}
                      </Option>
                    )
                  )}
                </Combobox>
              </Field>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancelar</Button>
            </DialogTrigger>
            <Button
              onClick={handleTransfer}
              disabled={transferring}
              icon={transferring ? <Spinner size="tiny" /> : undefined}
              appearance="primary"
            >
              Transferir
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
