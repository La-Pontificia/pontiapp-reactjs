import {
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
import {
  ConferenceRoomRegular,
  DeleteRegular,
  FolderOpenRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '@/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Pavilion } from '@/types/academic/pavilion'
import { useNavigate } from 'react-router'
import { useSlugClassroom } from '../+layout'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Pavilion
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const navigate = useNavigate()

  const { period } = useSlugClassroom()

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/pavilions/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! El pabellón ha sido eliminado con éxito.')
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
          <TableCellLayout media={<FolderOpenRegular fontSize={25} />}>
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <Button
            onClick={() =>
              navigate(
                `/m/academic/classrooms/${period.id}/pavilions/${item.id}/classrooms`
              )
            }
            icon={<ConferenceRoomRegular />}
            size="small"
          >
            Aulas
          </Button>
        </TableCell>
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
