import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Persona,
  Spinner,
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell,
  Tooltip
} from '@fluentui/react-components'
import { DeleteRegular, PenRegular } from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '~/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { RmPeriod } from '~/types/rm-period'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: RmPeriod
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`rm/periods/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('Eliminado correctamente')
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
          <TableCellLayout media={<Avatar color="colorful" name={item.name} />}>
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <Persona
            avatar={{
              size: 28,
              className: '!rounded-none',
              color: 'colorful',
              name: item.academicProgram?.name
            }}
            name={item.academicProgram?.name}
            secondaryText={item.academicProgram?.businessUnit?.name}
          />
        </TableCell>
        <TableCell>
          <p className="font-medium">{item.creator?.displayName} </p>
          <span className="opacity-70">{timeAgo(item.created_at)}</span>
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
