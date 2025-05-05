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
import { handleError } from '@/utils'
import { toast } from 'anni'

import { DeleteFilled, TicketDiagonalFilled } from '@fluentui/react-icons'
import { useAuth } from '@/store/auth'
import { FirebaseAttentionTicket } from '@/types/attention-ticket'
import { timeAgoShort } from '@/lib/dayjs'
import { deleteTicket } from '@/services/tickets'

const Status = {
  pending: {
    color: 'severe',
    text: 'Pendiente'
  },
  calling: {
    color: 'important',
    text: 'Llamando'
  },
  attending: {
    color: 'brand',
    text: 'En proceso'
  },
  attended: {
    color: 'informative',
    text: 'Completado'
  },
  transferred: {
    color: 'warning',
    text: 'Transferido'
  },
  cancelled: {
    color: 'critical',
    text: 'Cancelado'
  }
}

export default function Item({ item }: { item: FirebaseAttentionTicket }) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const ok = await deleteTicket(item.id)
    if (!ok) {
      setDeleting(false)
      return toast(
        handleError(
          'Ocurrió un error al eliminar el ticket, por favor intenta de nuevo'
        )
      )
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`Ticket eliminado correctamente`)
  }

  const state = Status[item.state as keyof typeof Status]

  const [timeAgo, setTimeAgo] = React.useState(timeAgoShort(item.created_at))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(timeAgoShort(item.created_at))
    }, 1000)
    return () => clearInterval(interval)
  }, [item.created_at])

  return (
    <>
      <tr
        key={item.id}
        className="bg-neutral-100 dark:bg-neutral-800/80 [&>td]:py-2 [&>td]:px-2 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
      >
        <td>
          <div className="flex items-center gap-2">
            <Avatar size={32} icon={<TicketDiagonalFilled />} />
            {/* <p className="text-nowrap">{item.attentionServiceName}</p> */}
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <p className="text-nowrap">{item.displayName}</p>
          </div>
        </td>
        <td>
          <p className="font-semibold opacity-60 text-nowrap">
            {item.attentionPositionName}
          </p>
        </td>
        <td>
          <div className="flex items-center gap-2 text-nowrap">
            <p>{item.attentionPositionBusinessName}</p>
          </div>
        </td>
        <td>
          <Badge color={state.color as any} appearance="filled">
            {state.text}
          </Badge>
        </td>
        <td>
          <p className="text-xs text-nowrap dark:text-blue-500 text-blue-500 font-medium">
            {(item.state === 'pending' || item.state === 'attending') &&
              timeAgo}
          </p>
        </td>
        <td>
          <div className="flex items-center gap-2">
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
