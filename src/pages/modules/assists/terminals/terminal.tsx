import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
  TableCell,
  TableRow
} from '@fluentui/react-components'
import {
  BuildingPeopleRegular,
  CloudDatabaseRegular,
  DeleteRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { format, timeAgo } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from 'anni'

import Form from './form'
import { AssistTerminal } from '~/types/assist-terminal'

export default function Item({
  item,
  refetch
}: {
  item: AssistTerminal
  refetch: () => void
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`partials/assist-terminals/${item?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`Terminal ${item.name} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            <Avatar
              icon={<BuildingPeopleRegular />}
              color="colorful"
              size={32}
              name={item.name}
              aria-label={item.name}
            />
            <p className="line-clamp-3 font-semibold">{item.name}</p>
          </div>
        </TableCell>
        <TableCell>
          <div className="opacity-80 flex items-center gap-2">
            <CloudDatabaseRegular fontSize={24} />
            {item.database}
          </div>
        </TableCell>
        <TableCell>
          <p>Registrado el {format(item.created_at, 'DD/MM/YYYY')}</p>
          <p className="text-xs opacity-60">{timeAgo(item.created_at)}</p>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Form
              defaultValues={item}
              refetch={refetch}
              triggerProps={{
                className: '!w-fit',
                appearance: 'transparent',
                icon: <PenRegular />
              }}
            />
            <Button
              appearance="transparent"
              icon={<DeleteRegular />}
              onClick={() => setOpenDelete(true)}
            />
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
              ¿Estás seguro de eliminar el terminal biométrico: {item.name}?
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
