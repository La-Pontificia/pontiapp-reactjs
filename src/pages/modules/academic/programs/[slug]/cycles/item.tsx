import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tooltip
} from '@fluentui/react-components'
import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'

import {
  DeleteRegular,
  DocumentRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '@/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Cycle } from '@/types/academic/cycle'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Cycle
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/cycles/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('Ciclo académico eliminado correctamente')
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout
            media={<DocumentRegular fontSize={25} />}
            className="font-semibold"
          >
            {item.code}
          </TableCellLayout>
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <p className="font-medium">{item.creator?.displayName} <span className="opacity-70 font-normal">{timeAgo(item.created_at)}</span></p>
        </TableCell>
        <TableCell>
          <div>
            <Tooltip content="Editar" relationship="description">
              <Button
                icon={<PenRegular />}
                onClick={() => setOpenForm(true)}
                appearance="transparent"
              />
            </Tooltip>
            <Tooltip content="Eliminar" relationship="description">
              <Button
                icon={<DeleteRegular />}
                onClick={() => setOpenDelete(true)}
                appearance="transparent"
              />
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
      <Form
        open={openForm}
        onOpenChange={setOpenForm}
        defaultProp={item}
        refetch={refetch}
      />
      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>¿Estás seguro de eliminar: {item.name}?</DialogTitle>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => mutate()}
                disabled={isPending}
                icon={isPending ? <Spinner size="tiny" /> : undefined}
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
