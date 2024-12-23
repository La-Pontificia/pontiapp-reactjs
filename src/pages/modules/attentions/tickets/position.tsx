/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from '~/commons/toast'

import { DeleteFilled, TicketDiagonalRegular } from '@fluentui/react-icons'
import { useAuth } from '~/store/auth'
import { AttentionTicket } from '~/types/attention-ticket'
import { timeAgoShort } from '~/lib/dayjs'

const Status = {
  1: {
    color: 'severe',
    text: 'Pendiente'
  },
  2: {
    color: 'important',
    text: 'Llamando'
  },
  3: {
    color: 'brand',
    text: 'En proceso'
  },
  4: {
    color: 'informative',
    text: 'Completado'
  },
  5: {
    color: 'warning',
    text: 'Transferido'
  }
}

export default function Item({
  item,
  refetch
}: {
  item: AttentionTicket
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`attentions/positions/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`Ticket eliminado correctamente`)
    refetch()
  }

  const state = Status[item.state as keyof typeof Status]

  const [timeAgo, setTimeAgo] = React.useState(timeAgoShort(item.created_at))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(timeAgoShort(item.created_at))
    }, 10000)
    return () => clearInterval(interval)
  }, [item.created_at])

  return (
    <>
      <tr
        key={item.id}
        className="bg-stone-900 [&>td]:py-2 [&>td]:px-4 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
      >
        <td>
          <div className="flex items-center gap-2">
            <Avatar size={32} icon={<TicketDiagonalRegular />} />
            <p className="text-nowrap">{item.service.name}</p>
          </div>
        </td>
        <td>
          <p className="font-semibold opacity-60 text-nowrap">
            {item.service.position.shortName}
          </p>
        </td>
        <td>
          <div className="flex items-center gap-2 text-nowrap">
            <p>{item.service.position.business.name}</p>
          </div>
        </td>
        {/* <td>
          <div className="flex items-center gap-2 py-3">
            <Avatar size={40} icon={<PersonDesktopRegular />} />
            <p className="text-sm line-clamp-1 opacity-90">{item.name}</p>
          </div>
        </td>
        <td>
          {item.current ? (
            <div className="flex items-center gap-2 py-3">
              <Avatar
                size={24}
                color="colorful"
                image={{
                  src: item.current.displayName
                }}
                name={item.current.displayName}
              />
              <p className="text-sm line-clamp-1 opacity-90">
                {item.current.displayName}
              </p>
            </div>
          ) : (
            <p className="text-sm line-clamp-1 opacity-90">-</p>
          )}
        </td>
        <td>
          {item.available ? (
            <Badge color="success" appearance="tint">
              Disponible
            </Badge>
          ) : (
            <Badge color="subtle" appearance="tint">
              Inactivo
            </Badge>
          )}
        </td>*/}
        <td>
          <Badge color={state.color as any} appearance="filled">
            {state.text}
          </Badge>
        </td>
        <td>
          <p className="text-xs text-nowrap dark:text-blue-500">{timeAgo}</p>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {/* {authUser.hasPrivilege('events:positions:edit') && (
              <Form
                // defaultValues={item}
                refetch={refetch}
                triggerProps={{
                  size: 'small',
                  appearance: 'transparent',
                  children: (
                    <Badge
                      icon={<PenFilled fontSize={15} />}
                      appearance="tint"
                      color="informative"
                    >
                      Editar
                    </Badge>
                  )
                }}
              />
            )} */}
            {authUser.hasPrivilege('events:positions:delete') && (
              <button onClick={() => setOpenDelete(true)}>
                <Badge
                  icon={<DeleteFilled fontSize={15} />}
                  appearance="tint"
                  color="informative"
                >
                  Eliminar
                </Badge>
              </button>
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
                ¿Estás seguro de eliminar el ticket de: {item.personFirstNames}?
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
