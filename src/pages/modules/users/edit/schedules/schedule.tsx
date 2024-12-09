import { toast } from '@/commons/toast'
import { calendarStrings, days } from '@/const'
import { api } from '@/lib/api'
import { countRangeMinutes, format, formatTime } from '@/lib/dayjs'
import { Schedule } from '@/types/schedule'
import { handleError } from '@/utils'
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Menu,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import {
  ArchiveRegular,
  CalendarRegular,
  ClockRegular,
  DeleteRegular,
  MoreHorizontalRegular,
  PenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScheduleForm } from './+page'

export const ScheduleItem = ({
  schedule,
  refetch,
  refetchArchivedSchedules
}: {
  schedule: Schedule
  refetch: () => void
  refetchArchivedSchedules: () => void
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

    const res = await api.post(`schedules/${schedule.id}/delete`)

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      toast('Horario eliminado correctamente')
      setDeleteDialog(false)
    }

    setDeleting(false)
  }

  const handleArchive = handleSubmit(async (values) => {
    setArchiving(true)

    const res = await api.post(`schedules/${schedule.id}/archive`, {
      data: JSON.stringify({
        endDate: format(values.endDate, 'YYYY-MM-DD')
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      refetchArchivedSchedules()
      toast('Horario archivado correctamente')
      setArchiveDialog(false)
    }

    setArchiving(false)
  })

  return (
    <div
      data-archived={schedule.archived ? '' : undefined}
      className="relative data-[archived]:grayscale data-[archived]:opacity-60 data-[archived]:pointer-events-none group divide-stone-500/30 dark:text-stone-300 bg-stone-500/10 shadow-sm border-stone-500/40 rounded-lg"
    >
      {!schedule.archived && (
        <div className="absolute inset-y-0 flex items-center z-[1] px-3 pointer-events-none">
          <Menu hasIcons positioning={{ autoSize: true }}>
            <MenuTrigger disableButtonEnhancement>
              <button className="dark:bg-stone-700 opacity-0 group-hover:opacity-100 aria-expanded:opacity-100 shadow-xl shadow-black pointer-events-auto rounded-full">
                <MoreHorizontalRegular fontSize={30} />
              </button>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuGroup>
                  <MenuItem
                    onClick={() => setEditDialog(true)}
                    icon={<PenRegular />}
                  >
                    Editar
                  </MenuItem>
                  <MenuItem
                    onClick={() => setDeleteDialog(true)}
                    icon={<DeleteRegular />}
                  >
                    Eliminar
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup>
                  <MenuItem
                    onClick={() => setArchiveDialog(true)}
                    icon={<ArchiveRegular />}
                  >
                    Archivar
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      )}
      <div className="py-2 px-4 border-b border-stone-500/40 flex items-center gap-3">
        <CalendarRegular fontSize={22} className="opacity-60" />
        <div className="justify-between flex-grow font-semibold">
          <span>
            Desde {format(schedule.startDate, 'DD/MM/YYYY')}{' '}
            {schedule.endDate
              ? `hasta ${format(schedule.endDate, 'DD/MM/YYYY')}`
              : ''}
          </span>
          <p className="text-xs line-clamp-1 overflow-hidden text-ellipsis font-normal dark:text-neutral-400">
            Los días{' '}
            {schedule
              .days!.sort((a, b) => parseInt(a) - parseInt(b))
              .map((d) => days[d as keyof typeof days].short)
              .join(', ')}
          </p>
        </div>
        <Badge appearance="tint" color="brand">
          {schedule.terminal.name}
        </Badge>
      </div>
      <div className="py-3 px-4 flex items-center gap-3">
        <ClockRegular fontSize={22} className="opacity-60" />
        <div className="flex-grow">
          <p className="text-xs">
            {formatTime(schedule.from, 'h:mm A')} -{' '}
            {formatTime(schedule.to, 'h:mm A')} (
            {countRangeMinutes(schedule.from, schedule.to)})
          </p>
        </div>
      </div>

      {/* dialogs */}
      {deleteDialog && !schedule.archived && (
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
      )}

      {archiveDialog && !schedule.archived && (
        <Dialog
          open={archiveDialog}
          onOpenChange={(_, e) => setArchiveDialog(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>¿Estás seguro de archivar el horario?</DialogTitle>
              <DialogContent>
                <p className="text-xs opacity-60">
                  Al archivar el horario, ya no será visible en la lista de
                  horarios activos. pasarás a la lista de horarios archivados
                  donde solo sera visible para los reportes de asistencia.{' '}
                  <br /> <br /> Solo lo puede desarchivar un administrador.
                </p>
                <div className="pt-5 space-y-3">
                  <div className="font-semibold">
                    Inició en {format(schedule.startDate, 'DD/MM/YYYY')}
                  </div>
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
                          appearance="filled-darker"
                          formatDate={(date) => format(date, 'DD/MM/YYYY')}
                          strings={calendarStrings}
                          placeholder="Selecciona una fecha"
                        />
                      </Field>
                    )}
                    name="endDate"
                  />
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
                  Archivar
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}

      {editDialog && (
        <ScheduleForm
          open={editDialog}
          onOpenChange={setEditDialog}
          default={schedule}
          refetch={refetch}
        />
      )}
    </div>
  )
}
