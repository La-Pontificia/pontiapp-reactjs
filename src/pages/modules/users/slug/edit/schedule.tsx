import { toast } from 'anni'
import { calendarStrings, days } from '~/const'
import { api } from '~/lib/api'
import { countRangeMinutes, format } from '~/lib/dayjs'
import { Schedule } from '~/types/schedule'
import { handleError } from '~/utils'
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Spinner
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import {
  ArchiveRegular,
  CalendarRegular,
  ClockRegular,
  DeleteRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScheduleForm } from './schedules'

export const ScheduleItem = ({
  schedule,
  refetch,
  hasEdit = true
}: {
  schedule: Schedule
  refetch: () => void
  hasEdit?: boolean
}) => {
  const { control, handleSubmit } = useForm<{
    endDate: Date
  }>()

  const [deleteDialog, setDeleteDialog] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const [editDialog, setEditDialog] = React.useState(false)

  const [archiveDialog, setArchiveDialog] = React.useState(false)
  const [archiving, setArchiving] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)

    const res = await api.post(`users/schedules/${schedule.id}/delete`)

    if (!res.ok) {
      toast.error(handleError(res.error))
    } else {
      refetch()
      toast.success('Horario eliminado correctamente')
      setDeleteDialog(false)
    }

    setDeleting(false)
  }

  const handleArchive = handleSubmit(async (values) => {
    setArchiving(true)

    const res = await api.post(`users/schedules/${schedule.id}/archive`, {
      data: JSON.stringify({
        endDate: format(values.endDate, 'YYYY-MM-DD')
      })
    })

    if (!res.ok) {
      toast.error(handleError(res.error))
    } else {
      refetch()
      toast.success(
        schedule.archived ? 'Horario desarchivado' : 'Horario archivado'
      )
      setArchiveDialog(false)
    }

    setArchiving(false)
  })

  const turn = React.useMemo(() => {
    const start = new Date(schedule.from)
    if (start.getHours() >= 6 && start.getHours() < 12) return '☀️'
    if (start.getHours() >= 12 && start.getHours() < 18) return '🌄'
    return '🌆'
  }, [schedule.from])

  const type = React.useMemo(() => {
    return schedule.type === 'available' ? 'Laboral' : 'No disponible'
  }, [schedule.type])

  return (
    <div className="relative group bg-stone-500/10 dark:text-neutral-300 shadow-sm rounded-lg">
      <div className="py-2 px-4 border-b border-neutral-500/20 flex items-center gap-3">
        <CalendarRegular fontSize={22} className="opacity-60" />
        <div className="justify-between flex-grow">
          <span className="font-semibold">
            Desde {format(schedule.startDate, 'DD MMM YYYY')}{' '}
            {schedule.endDate
              ? `hasta ${format(schedule.endDate, 'DD MMM YYYY')}`
              : ''}
          </span>
          <p className="text-sm line-clamp-1 overflow-hidden text-ellipsis">
            Los días{' '}
            {schedule
              .days!.sort((a, b) => parseInt(a) - parseInt(b))
              .map((d) => days[d as keyof typeof days].short)
              .join(', ')}
          </p>
        </div>
        <div className="text-lg">
          {schedule.archived ? (
            <span className="text-sm">Archivado</span>
          ) : (
            turn
          )}
          <span
            data-unavailable={schedule.type === 'unavailable' ? '' : undefined}
            className="text-sm data-[unavailable]:text-red-500"
          >
            {' '}
            {type}
          </span>
        </div>
      </div>
      <div className="py-3 px-4 flex items-center gap-3">
        <ClockRegular fontSize={22} className="opacity-60" />
        <div className="flex-grow">
          <p className="text-sm">
            {format(schedule.from, 'h:mm A')} - {format(schedule.to, 'h:mm A')}{' '}
            ({countRangeMinutes(schedule.from, schedule.to)})
          </p>
        </div>
        {hasEdit && (
          <div className="flex gap-1">
            {!schedule.archived && (
              <>
                <Button
                  appearance="transparent"
                  onClick={() => setEditDialog(true)}
                  size="small"
                  icon={<PenRegular />}
                >
                  Editar
                </Button>
                <Button
                  onClick={() => setDeleteDialog(true)}
                  size="small"
                  appearance="transparent"
                  icon={<DeleteRegular />}
                />
              </>
            )}
            <Button
              onClick={() => setArchiveDialog(true)}
              size="small"
              appearance="transparent"
              icon={<ArchiveRegular />}
            />
          </div>
        )}
      </div>

      <Dialog
        open={deleteDialog}
        onOpenChange={(_, e) => setDeleteDialog(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>¿Estás seguro de eliminar el horario?</DialogTitle>
            <DialogContent>
              <p className="text-xs opacity-60">
                Por favor verificar si desea eliminar o archivar el horario.
              </p>
            </DialogContent>
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

      <Dialog
        open={archiveDialog}
        onOpenChange={(_, e) => setArchiveDialog(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿{schedule.archived ? 'Desarchivar' : 'Archivar'} el horario?
            </DialogTitle>
            <DialogContent>
              <p className="text-xs opacity-60">
                {!schedule.archived ? (
                  <>
                    Al archivar el horario, ya no será visible en la lista de
                    horarios activos. pasarás a la lista de horarios archivados
                    donde solo sera visible para los reportes de asistencia.{' '}
                    <br />{' '}
                  </>
                ) : (
                  <>
                    Al desarchivar el horario, volverá a ser visible en la lista
                    de horarios activos. <br />{' '}
                  </>
                )}
                {!schedule.archived && (
                  <>
                    <br /> Solo lo puede desarchivar un administrador.
                  </>
                )}
              </p>
              <div className="pt-5 space-y-3">
                <div className="font-semibold">
                  Inició en {format(schedule.startDate, 'DD MMM YYYY')}
                  {schedule.endDate && (
                    <>
                      {' '}
                      y finalizó en {format(schedule.endDate, 'DD MMM YYYY')}
                    </>
                  )}
                </div>
                {!schedule.archived && (
                  <Controller
                    control={control}
                    rules={{
                      required: 'Selecciona la fecha de finalización'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationMessage={error?.message}
                        label="Termina o terminó en"
                      >
                        <DatePicker
                          disabled={archiving}
                          value={field.value ? new Date(field.value) : null}
                          onSelectDate={(date) => {
                            field.onChange(date)
                          }}
                          formatDate={(date) => format(date, 'DD MMM YYYY')}
                          strings={calendarStrings}
                          placeholder="Selecciona una fecha"
                        />
                      </Field>
                    )}
                    name="endDate"
                  />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={handleArchive}
                disabled={archiving}
                icon={archiving ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                {schedule.archived ? 'Desarchivar' : 'Archivar'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <ScheduleForm
        open={editDialog}
        onOpenChange={setEditDialog}
        default={schedule}
        refetch={refetch}
      />
    </div>
  )
}
