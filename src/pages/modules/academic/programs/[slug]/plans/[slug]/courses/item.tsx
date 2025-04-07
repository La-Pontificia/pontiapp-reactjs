import {
  Badge,
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
  DeleteRegular,
  DocumentRegular,
  PenRegular
} from '@fluentui/react-icons'

import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '~/components/table'

import React from 'react'
import { timeAgo } from '~/lib/dayjs'
import Form from './form'
import { useMutation } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { PlanCourse } from '~/types/academic/plan'

export default function Item({
  item,
  refetch
}: {
  refetch: () => void
  item: PlanCourse
}) {
  const [openForm, setOpenForm] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`academic/plans/courses/${item.id}/delete`),
    onSuccess: () => {
      setOpenDelete(false)
      refetch()
      toast.success(
        <p>
          En hora buena! El curso <b>{item.name}</b> ha sido removido con éxito.
        </p>
      )
    },
    onError: (error) => {
      toast.error(handleError(error.message))
    }
  })

  const { mutate: toggleStatus } = useMutation({
    mutationFn: () => api.post(`academic/plans/courses/${item.id}/status`),
    onSuccess: () => {
      refetch()
      toast.success(
        <p>
          En hora buena! El curso <b>{item.name}</b> ha sido{' '}
          {item.status ? 'deshabilitado' : 'habilitado'} con éxito.
        </p>
      )
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
          <TableCellLayout media={<DocumentRegular fontSize={25} />}>
            {item.course.code}
          </TableCellLayout>
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell className="max-lg:!hidden">
          {item.cycle.code} - {item.cycle.name}
        </TableCell>
        <TableCell className="max-lg:!hidden">
          {item.teoricHours ?? '-'}
        </TableCell>
        <TableCell className="max-lg:!hidden">
          {item.practiceHours ?? '-'}
        </TableCell>
        <TableCell>{item.credits ?? '-'}</TableCell>
        <TableCell>
          <Button onClick={() => toggleStatus()} appearance="transparent">
            <Badge color={item.status ? 'danger' : 'success'}>
              {item.status ? 'Deshabilitar' : 'Habilitar'}
            </Badge>
          </Button>
        </TableCell>
        <TableCell className="max-lg:!hidden">
          <p className="font-medium">{item.creator?.displayName} </p>
          <span className="opacity-70">{timeAgo(item.created_at)}</span>
        </TableCell>
        <TableCell>
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
