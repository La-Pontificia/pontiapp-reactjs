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
  TableRow,
  TableSelectionCell,
  TableCell,
  TableCellLayout
} from '~/components/table'

import {
  DeleteRegular,
  FolderOpenRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '~/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { Program } from '~/types/academic/program'
import { useNavigate } from 'react-router'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Program
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`rm/academic-programs/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('Eliminado correctamente')
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const navigate = useNavigate()

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
          <p className="font-medium">{item.creator?.displayName} </p>
          <span className="opacity-70">{timeAgo(item.created_at)}</span>
        </TableCell>
        <TableCell>
          <div className="!flex !flex-wrap gap-1 max-lg:!p-1">
            <Button
              onClick={() => navigate(`/m/academic/programs/${item.id}/plans`)}
              icon={<FolderOpenRegular />}
              size="small"
            >
              Planes
            </Button>
            <Button
              onClick={() => navigate(`/m/academic/programs/${item.id}/cycles`)}
              icon={<FolderOpenRegular />}
              size="small"
            >
              Ciclos
            </Button>
          </div>
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
