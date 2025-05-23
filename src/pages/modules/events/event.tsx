import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import {
  DeleteRegular,
  FolderPeopleRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { format, timeAgo } from '@/lib/dayjs'
import { api } from '@/lib/api'
import { handleError } from '@/utils'
import { toast } from 'anni'

import { useAuth } from '@/store/auth'
import { Event } from '@/types/event'
import Form from './form'
import { useNavigate } from 'react-router'
import { TableSelectionCell, TableCell, TableRow } from '@/components/table'

export default function Item({
  item,
  refetch
}: {
  item: Event
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const navigate = useNavigate()

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`events/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast.error(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`${item.name} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <div className="flex items-center gap-2">
            <Avatar color="colorful" size={32} name={item.name} />
            <div>
              <p className="line-clamp-3 font-semibold">{item.name}</p>
              <p className="text-xs opacity-70">{item.description}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <p className="overflow-hidden font-medium text-nowrap capitalize text-ellipsis">
            {item.date ? format(item.date, 'DD MMM YYYY') : 'Sin fecha'}
          </p>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => navigate(`/m/events/${item.id}/records`)}
            size="small"
            icon={<FolderPeopleRegular />}
          >
            Asistentes
          </Button>
        </TableCell>
        <TableCell>
          <p>
            {item.creator?.displayName} {timeAgo(item.created_at)}
          </p>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {authUser.hasPrivilege('events:edit') && (
              <Form
                defaultValues={item}
                refetch={refetch}
                triggerProps={{
                  size: 'small',
                  appearance: 'transparent',
                  icon: <PenRegular fontSize={20} />
                }}
              />
            )}
            {authUser.hasPrivilege('events:delete') && (
              <button onClick={() => setOpenDelete(true)}>
                <DeleteRegular fontSize={20} />
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>
      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿Estás seguro de eliminar el departamento: {item.name}?
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
    </>
  )
}
