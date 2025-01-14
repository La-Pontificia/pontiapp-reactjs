import { Helmet } from 'react-helmet'
import { useEditUser } from '../+layout'
import { useParams } from 'react-router'
import { Schedule } from '~/types/schedule'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { cn, handleError } from '~/utils'
import { ScheduleItem } from './schedule'
import { Spinner } from '@fluentui/react-components'
import {
  Button,
  ButtonProps,
  Checkbox,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Option
} from '@fluentui/react-components'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'anni'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { calendarStrings, days } from '~/const'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'
import React from 'react'
import { AssistTerminal } from '~/types/assist-terminal'
import { AddRegular } from '@fluentui/react-icons'
import { format } from '~/lib/dayjs'

export default function UsersEditSchedulesPage() {
  const params = useParams<{
    slug: string
  }>()

  const [showArchived, setShowArchived] = React.useState(false)

  const { user } = useEditUser()
  const slug = params.slug?.replace('@', '')

  const {
    data: schedules,
    isLoading,
    refetch
  } = useQuery<Schedule[]>({
    queryKey: ['schedules', slug],
    queryFn: async () => {
      const res = await api.get<Schedule[]>(
        'users/' + slug + '/schedules?relationship=terminal'
      )
      if (!res.ok) return []
      return res.data.map((d) => new Schedule(d))
    }
  })

  const {
    data: archivedSchedules,
    isLoading: isLoadingArchivedSchedules,
    refetch: refetchArchivedSchedules
  } = useQuery<Schedule[]>({
    queryKey: ['schedules', slug, 'archived'],
    queryFn: async () => {
      const res = await api.get<Schedule[]>(
        'users/' + slug + '/schedules?relationship=terminal&archived=true'
      )
      if (!res.ok) return []
      return res.data.map((d) => new Schedule(d))
    },
    enabled: showArchived
  })

  const countSchedules = schedules?.length || 0
  const countArchivedSchedules = archivedSchedules?.length || 0

  return (
    <div className="px-4 w-full">
      <Helmet>
        <title>
          {user ? user.displayName + ' -' : ''} Editar horarios | Ponti App
        </title>
      </Helmet>
      <div className="pb-6 space-y-3">
        <div className="w-[400px] pt-5">
          <ScheduleForm
            refetch={refetch}
            trigger={{
              icon: <AddRegular />,
              children: 'Agregar nuevo horario'
            }}
          />
        </div>
        {!isLoading && countSchedules === 0 && (
          <div className="p-10 bg-neutral-500/10 rounded-lg">
            <p className="text-center">No hay horarios activos</p>
          </div>
        )}
        <div
          className={cn(
            'grid gap-4 mt-2 grid-cols-1',
            countSchedules === 0 && 'xl:grid-cols-3 lg:grid-cols-2',
            countSchedules === 2 && 'lg:grid-cols-2',
            countSchedules > 2 && 'xl:grid-cols-3 lg:grid-cols-2'
          )}
        >
          {isLoading ? (
            <>
              <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
              <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
              <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
            </>
          ) : (
            schedules?.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                refetch={refetch}
                refetchArchivedSchedules={refetchArchivedSchedules}
              />
            ))
          )}
        </div>
        <div className="py-4 px-1 dark:text-neutral-300 text-xs">
          Solo son visibles los horarios activos{' '}
          {!showArchived && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="dark:text-blue-500 text-blue-700 hover:underline"
            >
              Ver horarios archivados
            </button>
          )}
        </div>

        {showArchived && (
          <div className="border-t pt-2 border-neutral-500/20">
            {isLoadingArchivedSchedules ? (
              <div className="flex justify-center p-10">
                <Spinner size="huge" />
              </div>
            ) : (
              <>
                <h2 className="text-blue-500">
                  Horarios archivados{' '}
                  {countArchivedSchedules > 0 && (
                    <span className="text-xs">({countArchivedSchedules})</span>
                  )}
                </h2>
                <div
                  className={cn(
                    'grid gap-4 mt-2 grid-cols-1',
                    countArchivedSchedules === 0 &&
                      'xl:grid-cols-3 lg:grid-cols-2',
                    countArchivedSchedules === 2 && 'lg:grid-cols-2',
                    countArchivedSchedules > 2 &&
                      'xl:grid-cols-3 lg:grid-cols-2'
                  )}
                >
                  {isLoading ? (
                    <>
                      <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
                      <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
                      <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
                    </>
                  ) : (
                    archivedSchedules?.map((schedule) => (
                      <ScheduleItem
                        key={schedule.id}
                        schedule={schedule}
                        refetch={refetch}
                        refetchArchivedSchedules={refetchArchivedSchedules}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

type ScheduleFormValue = {
  startDate: Date
  days: string[]
  from?: Date
  to?: Date
  terminal?: AssistTerminal
}
export function ScheduleForm(props: {
  default?: Schedule
  trigger?: ButtonProps
  refetch?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { user } = useEditUser()
  const [o, setO] = React.useState(false)

  const open = props.open !== undefined ? props.open : o
  const setOpen = props.onOpenChange ?? setO

  const [fetching, setFetching] = React.useState(false)
  const { data: terminals, isLoading: isTerminalsLoading } = useQuery<
    AssistTerminal[]
  >({
    queryKey: ['AssistTerminals'],
    queryFn: async () => {
      const res = await api.get<AssistTerminal[]>(
        'partials/assist-terminals/all'
      )
      if (!res.ok) return []
      return res.data.map((terminal) => new AssistTerminal(terminal))
    }
  })

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<ScheduleFormValue>({
      defaultValues: {
        days: props.default?.days ?? [],
        from: props.default?.from && props.default?.from,
        to: props.default?.to && props.default?.to,
        startDate: props.default?.startDate
          ? (format(props.default?.startDate, 'YYYY/MM/DD') as unknown as Date)
          : new Date(),
        terminal: props.default?.terminal
      }
    })

  const { days: watchDays } = watch()

  const onSubmit = handleSubmit(async (values) => {
    const URL = props.default ? `schedules/${props.default.id}` : 'schedules'

    if (values.days?.length === 0)
      return toast('Selecciona al menos un día de la semana')

    setFetching(true)
    const res = await api.post(URL, {
      data: JSON.stringify({
        from: format(values.from, 'YYYY-MM-DD HH:mm:ss'),
        to: format(values.to, 'YYYY-MM-DD HH:mm:ss'),
        userId: user?.id,
        days: values.days,
        assistTerminalId: values.terminal?.id,
        startDate: format(values.startDate, 'YYYY-MM-DD')
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      reset()
      props.refetch?.()
      setOpen(false)
      toast(props.default ? 'Horario actualizado' : 'Horario agregado')
    }
    setFetching(false)
  })

  return (
    <>
      {props.trigger && (
        <Button onClick={() => setOpen(true)} {...props.trigger} />
      )}
      {open && (
        <Dialog
          modalType="modal"
          open={open}
          onOpenChange={(_, e) => setOpen(e.open)}
        >
          <DialogSurface aria-describedby={undefined}>
            <DialogBody>
              <DialogTitle className="pb-5">
                {props.default ? 'Editar Horario' : 'Agregar nuevo horario'}
              </DialogTitle>
              <DialogContent className="grid gap-4">
                <Controller
                  control={control}
                  rules={{
                    required: 'Selecciona la fecha de inicio'
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      validationMessage={error?.message}
                      label="Inicia o inició a partir de la fecha"
                    >
                      <DatePicker
                        disabled={fetching}
                        value={field.value ? new Date(field.value) : null}
                        onSelectDate={(date) => {
                          field.onChange(date)
                        }}
                        formatDate={(date) => format(date, 'DD/MM/YYYY')}
                        strings={calendarStrings}
                        placeholder="Selecciona una fecha"
                      />
                    </Field>
                  )}
                  name="startDate"
                />
                <div>
                  <Field label="Días de la semana que se aplicará el horario:" />
                  <div className="flex items-center gap-2">
                    {Object.entries(days).map(([key, day]) => {
                      return (
                        <Checkbox
                          disabled={fetching}
                          checked={watchDays?.includes(key)}
                          onChange={(_, d) => {
                            setValue(
                              'days',
                              d.checked
                                ? [...(watchDays ?? []), key]
                                : watchDays
                                ? watchDays.filter((w) => w !== key)
                                : []
                            )
                          }}
                          label={day.short}
                          value={key}
                          key={key}
                        />
                      )
                    })}
                  </div>
                </div>
                <div className="border-t grid items-start grid-cols-2 pt-2 gap-4 border-neutral-500/30">
                  <Controller
                    control={control}
                    rules={{
                      required: 'Selecciona la hora de ingreso'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationMessage={error?.message}
                        label="Entrada:"
                      >
                        <TimePicker
                          ref={field.ref}
                          onBlur={field.onBlur}
                          startHour={5}
                          endHour={23}
                          increment={15}
                          disabled={fetching}
                          onTimeChange={(_, e) =>
                            field.onChange(e.selectedTime)
                          }
                          selectedTime={
                            field.value ? new Date(field.value) : undefined
                          }
                          value={
                            field.value
                              ? formatDateToTimeString(new Date(field.value))
                              : undefined
                          }
                          placeholder="Hora de ingreso"
                        />
                      </Field>
                    )}
                    name="from"
                  />
                  <Controller
                    control={control}
                    rules={{
                      required: 'Selecciona la hora de salida'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Field validationMessage={error?.message} label="Salida:">
                        <TimePicker
                          ref={field.ref}
                          onBlur={field.onBlur}
                          startHour={5}
                          endHour={23}
                          increment={15}
                          disabled={fetching}
                          onTimeChange={(_, e) =>
                            field.onChange(e.selectedTime)
                          }
                          selectedTime={
                            field.value ? new Date(field.value) : undefined
                          }
                          value={
                            field.value
                              ? formatDateToTimeString(new Date(field.value))
                              : ''
                          }
                          placeholder="Hora de salida"
                        />
                      </Field>
                    )}
                    name="to"
                  />
                </div>
                <div className="border-t grid grid-cols-2 pt-2 gap-4 border-neutral-500/30">
                  <Controller
                    rules={{
                      required: 'Selecciona un terminal de asistencia'
                    }}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        validationMessage={error?.message}
                        label="Terminal de asistencia"
                      >
                        <Combobox
                          ref={field.ref}
                          selectedOptions={[field.value?.id ?? '']}
                          disabled={isTerminalsLoading || fetching}
                          onOptionSelect={(_, data) => {
                            const terminal = terminals!.find(
                              (t) => t.id === data.optionValue
                            )
                            field.onChange(terminal)
                          }}
                          value={field.value?.name ?? ''}
                          placeholder="Selecciona un terminal"
                        >
                          {terminals?.map((terminal) => (
                            <Option
                              key={terminal.id}
                              text={terminal.name}
                              value={terminal.id}
                            >
                              {terminal.name}
                            </Option>
                          ))}
                        </Combobox>
                      </Field>
                    )}
                    name="terminal"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
                <Button
                  disabled={fetching}
                  icon={fetching ? <Spinner size="tiny" /> : undefined}
                  onClick={onSubmit}
                  appearance="primary"
                >
                  {props.default ? 'Actualizar' : 'Agregar'}
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  )
}
