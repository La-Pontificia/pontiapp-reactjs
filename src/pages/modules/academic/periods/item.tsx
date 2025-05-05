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
  BuildingRegular,
  DeleteRegular,
  FolderGlobeRegular,
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
import { Period } from '@/types/academic/period'
import { useNavigate } from 'react-router'
import { useAuth } from '@/store/auth'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Period
}) {
  const navigate = useNavigate()
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const { user } = useAuth()
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/periods/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! El periodo ha sido eliminado con éxito.')
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
          <div className="flex flex-wrap gap-1 py-1">
            {user.hasPrivilege('academic:pavilionsClassrooms') &&
              <Button
                onClick={() =>
                  navigate(`/m/academic/classrooms/${item.id}/pavilions`)
                }
                icon={<BuildingRegular />}
                size="small"
              >
                Aulas
              </Button>
            }
            {user.hasPrivilege('academic:sections') &&
              <Button
                onClick={() =>
                  navigate(`/m/academic/sections/${item.id}`)
                }
                icon={<FolderGlobeRegular />}
                size="small"
              >
                Secciones
              </Button>
            }
          </div>
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
