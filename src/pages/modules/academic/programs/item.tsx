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
} from '@/components/table'

import {
  DeleteRegular,
  FolderOpenRegular,
  FolderRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { timeAgo } from '@/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Program } from '@/types/academic/program'
import { useNavigate } from 'react-router'
import { useAuth } from '@/store/auth'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Program
}) {
  const { user } = useAuth()
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/programs/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success(
        <p>
          En hora buena! El programa <strong>{item.name}</strong> ha sido
          eliminado con éxito.
        </p>
      )
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
          <TableCellLayout description={item.area ? item.area.name : undefined} media={<FolderRegular fontSize={25} />}>
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <p className="font-medium">{item.creator?.displayName}  <span className="opacity-70 font-normal">{timeAgo(item.created_at)}</span></p>
        </TableCell>
        <TableCell className='max-w-[200px]'>
          <div className="!flex !flex-wrap gap-1 max-lg:!p-1">
            {user.hasPrivilege('academic:plans') && (
              <Button
                onClick={() => navigate(`/m/academic/programs/${item.id}/plans`)}
                icon={<FolderOpenRegular />}
                size="small"
              >
                Planes
              </Button>
            )}
            {user.hasPrivilege('academic:cycles') && (
              <Button
                onClick={() => navigate(`/m/academic/programs/${item.id}/cycles`)}
                icon={<FolderOpenRegular />}
                size="small"
              >
                Ciclos
              </Button>
            )}
          </div>
        </TableCell>
        <TableCell className='max-w-[100px]'>
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
