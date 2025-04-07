import {
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
  CloudDatabaseRegular,
  DeleteRegular,
  DocumentRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { format, timeAgo } from '~/lib/dayjs'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { toast } from 'anni'

import Form from './form'
import { AssistTerminal } from '~/types/assist-terminal'
import {
  TableSelectionCell,
  TableCell,
  TableRow,
  TableCellLayout
} from '~/components/table'

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
      return toast.error(handleError(res.error))
    }
    setDeleting(false)
    setOpenDelete(false)
    toast(`Terminal ${item.name} eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout media={<DocumentRegular fontSize={25} />}>
            <p className="line-clamp-3 font-semibold">{item.name}</p>
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <CloudDatabaseRegular fontSize={25} />
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
