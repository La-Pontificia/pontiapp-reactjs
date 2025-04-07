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
} from '~/components/table'

import {
  DeleteRegular,
  DocumentFolderRegular,
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
import { Section } from '~/types/academic/section'
import { useNavigate } from 'react-router'
import { useSlugSection } from '../../../+layout'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: Section
}) {
  const navigate = useNavigate()
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { period, program } = useSlugSection()

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/sections/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success('En hora buena! La seccion ha sido eliminado con éxito.')
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
            {item.code}
          </TableCellLayout>
        </TableCell>
        <TableCell>{item.plan?.name}</TableCell>
        <TableCell>{item.cycle?.code}</TableCell>
        <TableCell>
          <Button
            icon={<DocumentFolderRegular />}
            onClick={() =>
              navigate(
                `/m/academic/sections/${period.id}/programs/${program?.id}/sections/${item.id}/courses`
              )
            }
            size="small"
          >
            Cursos
          </Button>
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
            <DialogTitle>
              ¿Estás seguro de eliminar la sección: {item.code}?
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
