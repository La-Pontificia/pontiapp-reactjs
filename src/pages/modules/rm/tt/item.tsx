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
  TableCell,
  TableRow,
  TableSelectionCell,
  Tooltip
} from '@fluentui/react-components'
import { DeleteRegular, EyeRegular, PenRegular } from '@fluentui/react-icons'
import React from 'react'
import { format } from '~/lib/dayjs'
import { RmTT } from '~/types/RmData'
import TeacherTrackingForm from './form'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { useAuth } from '~/store/auth'

export default function Item({
  evaluation,
  refetch
}: {
  evaluation: RmTT
  refetch: () => void
}) {
  const [openPreview, setOpenPreview] = React.useState(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, seTableCelleleting] = React.useState(false)

  const { user: authUser } = useAuth()

  const handleDelete = async () => {
    seTableCelleleting(true)
    const res = await api.post(`rm/tt/${evaluation?.id}/delete`)
    if (!res.ok) {
      seTableCelleleting(false)
      return toast(handleError(res.error))
    }
    seTableCelleleting(false)
    setOpenDelete(false)
    toast(`Eliminado correctamente`)
    refetch()
  }

  return (
    <>
      <TableRow key={evaluation.id}>
        <TableSelectionCell type="radio" />
        <TableCell>
          <Persona
            avatar={{
              name: evaluation.teacherFullName,
              color: 'colorful'
            }}
            name={evaluation.teacherFullName}
            secondaryText={evaluation.teacherDocumentId}
          />
        </TableCell>
        <TableCell>
          <div>
            <p>{evaluation.academicProgram}</p>
            <p className="text-xs opacity-70">{evaluation.period}</p>
          </div>
        </TableCell>
        <TableCell className="max-lg:!hidden">
          <div>
            <p>{evaluation.course}</p>
            <p className="text-xs opacity-70">{evaluation.section}</p>
          </div>
        </TableCell>
        <TableCell className="max-md:!hidden">
          <p>
            <span className="font-medium p-1.5 -row-end-1 row-start-1">
              {evaluation.evaluator.displayName}
            </span>{' '}
            <span className="opacity-70">
              {format(evaluation.date, '[el] dddd DD [de] MMMM')}
            </span>
          </p>
        </TableCell>
        <TableCell>
          <Tooltip content="Ver evaluación" relationship="description">
            <Button
              onClick={() => setOpenPreview(true)}
              appearance="transparent"
              icon={<EyeRegular />}
            />
          </Tooltip>
          {authUser.hasPrivilege('rm:tt:update') && (
            <Button
              appearance="transparent"
              onClick={() => setOpenEdit(true)}
              icon={<PenRegular />}
            />
          )}
          {authUser.hasPrivilege('rm:tt:delete') && (
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
                ¿Estás seguro de eliminar la evaluacion {evaluation.section} -{' '}
                {evaluation.course}?
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
  evaluation: RmTT
  readOnly: boolean
  refetch?: () => void
}) => {
  if (!open) return null
  const {
    data,
    isLoading,
    refetch: refetchItem
  } = useQuery<RmTT | null>({
    queryKey: ['branches', 'rm', 'one', evaluation.id],
    queryFn: async () => {
      const res = await api.get<RmTT>(`rm/tt/${evaluation.id}`)
      if (!res.ok) {
        return null
      }
      return new RmTT(res.data)
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
      defaultValues={{
        id: data.id,
        academicProgram: data.academicProgram,
        area: data.area,
        branch: data.branch.id,
        aditional1: data.aditional1 ?? '',
        aditional2: data.aditional2 ?? '',
        aditional3: data.aditional3 ?? '',
        businessUnit: data.businessUnit.id,
        classRoom: data.classRoom,
        course: data.course,
        cycle: data.cycle,
        date: String(data.date),
        startOfClass: new Date(data.startOfClass),
        endOfClass: new Date(data.endOfClass),
        evaluationNumber: String(data.evaluationNumber),
        evaluator: data.evaluator,
        period: data.period,
        section: data.section,
        teacherDocumentId: data.teacherDocumentId,
        teacherFullName: data.teacherFullName,
        trackingTime: new Date(data.trackingTime)
      }}
      readOnly={readOnly}
      open={open}
      setOpen={setOpen}
      onSubmitTitle={readOnly ? 'Aceptar' : 'Actualizar'}
      title={readOnly ? 'Visualizar evaluación' : 'Editar evaluación'}
    />
  )
}
