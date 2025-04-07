/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Persona,
  Spinner,
  Tooltip
} from '@fluentui/react-components'

import { TableCell, TableRow, TableSelectionCell } from '~/components/table'

import { DeleteRegular, EyeRegular, PenRegular } from '@fluentui/react-icons'
import React from 'react'
// import { format } from '~/lib/dayjs'
import TeacherTrackingForm from './form'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { useAuth } from '~/store/auth'
import { TeacherTraking } from '~/types/academic/teacher-traking'

export default function Item({
  evaluation,
  refetch
}: {
  evaluation: TeacherTraking
  refetch: () => void
}) {
  const [openPreview, setOpenPreview] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, seTableCelleleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    seTableCelleleting(true)
    const res = await api.post(`academic/tt/${evaluation?.id}/delete`)
    if (!res.ok) {
      seTableCelleleting(false)
      return toast.error(handleError(res.error))
    }
    seTableCelleleting(false)
    setOpenDelete(false)
    toast.success(`Eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <TableRow key={evaluation.id}>
        <TableSelectionCell type="radio" />
        <TableCell>
          <Persona
            avatar={{
              name: evaluation.sectionCourse?.planCourse?.name,
              color: 'colorful'
            }}
            name={evaluation.sectionCourse?.planCourse?.name}
            secondaryText={evaluation.sectionCourse?.section?.code}
          />
        </TableCell>
        <TableCell>
          <div>
            <p>{evaluation.sectionCourse?.section?.period?.name}</p>
            <p className="text-sm opacity-70">
              {evaluation.sectionCourse?.section?.program?.name}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p>{evaluation.evaluator?.displayName}</p>
          </div>
        </TableCell>
        <TableCell>
          <Tooltip content="Ver evaluación" relationship="description">
            <Button
              onClick={() => setOpenPreview(true)}
              appearance="transparent"
              icon={<EyeRegular />}
            />
          </Tooltip>
          {authUser.hasPrivilege('academic:tt:update') && (
            <Button
              appearance="transparent"
              onClick={() => setOpenEdit(true)}
              icon={<PenRegular />}
            />
          )}
          {authUser.hasPrivilege('academic:tt:delete') && (
            <Button
              onClick={() => setOpenDelete(true)}
              appearance="transparent"
              icon={<DeleteRegular />}
            />
          )}
        </TableCell>
      </TableRow>

      {openDelete && (
        <Dialog
          open={openDelete}
          onOpenChange={(_, e) => setOpenDelete(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                ¿Estás seguro de eliminar la evaluacion{' '}
                {evaluation.sectionCourse?.section?.code} -{' '}
                {evaluation.sectionCourse?.planCourse?.name}?
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
      )}

      <EdiTableCellialog
        evaluation={evaluation}
        refetch={refetch}
        open={openPreview}
        setOpen={setOpenPreview}
        readOnly={true}
      />

      <EdiTableCellialog
        evaluation={evaluation}
        refetch={refetch}
        open={openEdit}
        setOpen={setOpenEdit}
        readOnly={false}
      />
    </>
  )
}

export const EdiTableCellialog = ({
  open,
  setOpen,
  evaluation,
  readOnly,
  refetch
}: {
  open: boolean
  setOpen: (open: boolean) => void
  evaluation: TeacherTraking
  readOnly: boolean
  refetch?: () => void
}) => {
  if (!open) return null
  const {
    data,
    isLoading,
    refetch: refetchItem
  } = useQuery<TeacherTraking | null>({
    queryKey: ['acdemic', 'tt', 'one', evaluation.id],
    queryFn: async () => {
      const res = await api.get<TeacherTraking>(`academic/tt/${evaluation.id}`)
      if (!res.ok) return null
      return new TeacherTraking(res.data)
    }
  })
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DialogSurface>
          <DialogBody>
            <DialogContent>
              <Spinner size="huge" />
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    )
  }

  if (!data) {
    return (
      <Dialog open={open} onOpenChange={(_, { open }) => setOpen(open)}>
        <DialogSurface>
          <DialogBody>
            <DialogContent>
              <h1>
                No se pudo cargar la evaluación, por favor intente de nuevo
              </h1>
              <Button onClick={() => refetchItem()}>Intentar de nuevo</Button>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    )
  }
  return (
    <TeacherTrackingForm
      defaultFirstProp={data.er1Json}
      defaultSecondProp={data.er2Json}
      refetch={refetch}
      // defaultValues={{
      //   id: data.id,
      //   trackingTime: new Date(data.trackingTime)
      // }}
      readOnly={readOnly}
      open={open}
      setOpen={setOpen}
      onSubmitTitle={readOnly ? 'Aceptar' : 'Actualizar'}
      title={readOnly ? 'Visualizar evaluación' : 'Editar evaluación'}
    />
  )
}
