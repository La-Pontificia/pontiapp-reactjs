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
  TableCellLayout,
  TableRow,
  TableSelectionCell,
  Tooltip
} from '@fluentui/react-components'
import { DeleteRegular } from '@fluentui/react-icons'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { EventRecord } from '~/types/event-record'
import { format } from '~/lib/dayjs'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: EventRecord
}) {
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`events/records/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! El registro ha sido eliminado con éxito.')
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
            media={<Avatar color="colorful" name={item.fullName} />}
          >
            <p className="capitalize pt-1">{item.displayName?.toLowerCase()}</p>
            <p className="text-xs pb-1 capitalize text-blue-600 dark:text-blue-400">
              {item.career?.toLowerCase()}
            </p>
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <TableCellLayout
            media={
              <Avatar
                color="colorful"
                className="!rounded-md"
                image={{
                  src: item.businessUnit.logoURL
                }}
              />
            }
          >
            <p className="capitalize pt-1">{item.businessUnit.name}</p>
          </TableCellLayout>
        </TableCell>
        <TableCell>{format(item.created_at, 'HH:mm A')}</TableCell>
        <TableCell>
          <div>
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
      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿Estás seguro de eliminar la asistencia de {item.displayName}?
            </DialogTitle>
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
