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
import { DeleteRegular, GuestRegular } from '@fluentui/react-icons'
import React from 'react'
import { format } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from '~/commons/toast'

import { useAuth } from '~/store/auth'
import { EventRecord } from '~/types/event-record'

export default function Item({
  item,
  refetch
}: {
  item: EventRecord
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`events/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`${item.firstNames} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <tr className="relative bg-stone-50/40 dark:bg-stone-900 odd:bg-stone-500/10 dark:even:bg-stone-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <Avatar
              color="royal-blue"
              size={40}
              icon={<GuestRegular fontSize={27} />}
            />
            <div>
              <p className="line-clamp-3 capitalize">
                {item.displayName?.toLocaleLowerCase()}
              </p>
              <p className="text-sm capitalize opacity-70">
                {item.career?.toLocaleLowerCase()}
              </p>
            </div>
          </div>
        </td>
        <td>
          <div>
            <p className="capitalize opacity-70 text-nowrap">
              {item.business.name?.toLocaleLowerCase()}
            </p>
            <p className="text-xs dark:text-cyan-500 ">{item.period}</p>
          </div>
        </td>
        <td>
          <p className="capitalize opacity-70 text-nowrap">{item.event.name}</p>
        </td>
        <td>
          <p className="capitalize opacity-70 text-nowrap">
            {format(item.created_at, 'MMMM D, YYYY h:mm A')}
          </p>
        </td>
        <td>
          {authUser.hasPrivilege('events:records:delete') && (
            <button onClick={() => setOpenDelete(true)}>
              <Badge
                icon={<DeleteRegular fontSize={15} />}
                appearance="tint"
                color="subtle"
              >
                Eliminar
              </Badge>
            </button>
          )}
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
                ¿Estás seguro de eliminar el registro de {item.displayName}?
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
