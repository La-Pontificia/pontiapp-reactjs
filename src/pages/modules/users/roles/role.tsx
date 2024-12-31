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
import { format, timeAgo } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from '~/commons/toast'

import { Role } from '~/types/role'
import Form from './form'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/store/auth'

export default function Item({
  item,
  refetch
}: {
  item: Role
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openTransfer, setOpenTransfer] = React.useState(false)

  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`partials/roles/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`${item.name} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <tr className="relative bg-stone-50/40 dark:bg-stone-900 odd:bg-stone-500/10 dark:even:bg-stone-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar
              icon={<BuildingPeopleRegular />}
              color="colorful"
              size={40}
              name={item.name}
              aria-label={item.name}
            />
            <p className="line-clamp-1  max-w-[40ch] text-ellipsis overflow-hidden">
              {item.name}
            </p>
          </div>
        </td>
        <td>
          <Badge color="severe" appearance="tint">
            {item.codePrefix}
          </Badge>
        </td>
        <td>
          <p>{item.job.name}</p>
        </td>
        <td>
          <p className="max-w-[20ch] overflow-hidden text-ellipsis">
            {item.department.name}
          </p>
        </td>
        <td>
          <p>Registrado el {format(item.created_at, 'DD/MM/YYYY')}</p>
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
                ¿Estás seguro de eliminar el cargo: {item.name}?
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
  item: Role
  refetch: () => void
  openTransfer: boolean
  setOpenTransfer: (open: boolean) => void
}) => {
  const [transferring, setTransferring] = React.useState(false)
  const [role, setRole] = React.useState<Role>(item)

  const { user } = useAuth()

  const handleTransfer = async () => {
    if (!role.id) return toast('Seleccione un cargo')
    if (role.id === item.id)
      return toast('No puedes transferir usuarios al mismo cargo')

    setTransferring(true)
    const res = await api.post(`partials/roles/${item?.id}/transfer`, {
      data: JSON.stringify({
        roleId: role.id
      })
    })
    if (!res.ok) {
      setTransferring(false)
      return toast(handleError(res.error))
    }
    setTransferring(false)
    setOpenTransfer(false)
    toast(`Usuarios transferidos correctamente`)
    refetch()
  }

  const { data: roles, isLoading: isRolesLoading } = useQuery<Role[]>({
    queryKey: ['roles', item.job.id],
    queryFn: async () => {
      const res = await api.get<Role[]>(`partials/roles/all?job=${item.job.id}`)
      if (!res.ok) return []
      return res.data.map((role) => new Role(role))
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
            {item.usersCount === 1 ? '' : 's'} del cargo {item.name}.
          </DialogTitle>
          <DialogContent>
            <div className="pb-2">
              Seleccione el cargo al que desea transferir.
            </div>
            <div className="pt-3">
              <Field required label="Cargo a transferir">
                <Combobox
                  input={{
                    autoComplete: 'off'
                  }}
                  selectedOptions={[role.id]}
                  disabled={isRolesLoading}
                  onOptionSelect={(_, data) => {
                    const role = roles?.find((r) => r.id === data.optionValue)
                    if (role) setRole(role)
                  }}
                  value={role.name ?? ''}
                  placeholder="Selecciona un cargo"
                >
                  {roles?.map((role) =>
                    role.isDeveloper && !user.isDeveloper ? null : (
                      <Option key={role.id} text={role.name} value={role.id}>
                        {role.name}
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
