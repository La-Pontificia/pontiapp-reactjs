import { useParams } from 'react-router'
import { Schedule } from '~/types/schedule'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { cn, handleError, parseTime } from '~/utils'
import { ScheduleItem } from './schedule'
import { Input, Spinner } from '@fluentui/react-components'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field
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
import { format, parse } from '~/lib/dayjs'
import { useUserEdit } from './+page'
import { AddRegular } from '@fluentui/react-icons'
import { useAuth } from '~/store/auth'

export default function UsersEditSchedules() {
  const params = useParams<{
    slug: string
  }>()

  const { user: authUser } = useAuth()

  const [openForm, setOpenForm] = React.useState(false)

  const slug = params.slug?.replace('@', '')

  const {
    data: schedules,
    isLoading,
    refetch
  } = useQuery<Schedule[]>({
    queryKey: ['users', 'schedules', slug],
    queryFn: async () => {
      const res = await api.get<Schedule[]>('users/schedules/' + slug)
      if (!res.ok) return []
      return res.data.map((d) => new Schedule(d))
    }
  })

  if (isLoading)
    return (
      <div className="w-full col-span-2">
        <Spinner size="medium" appearance="inverted" />
      </div>
    )

  const countSchedules = schedules?.length || 0
  // const countArchivedSchedules = archivedSchedules?.length || 0
  const actives = schedules?.filter((s) => !s.archived) || []
  const archived =
    schedules?.filter(
      (s) => s.archived && authUser.hasPrivilege('users:schedules:archived')
    ) || []

  return (
    <div className="w-full">
      <div className="pb-2">
        <ScheduleForm
          refetch={refetch}
          open={openForm}
          onOpenChange={setOpenForm}
        />
        <button
          onClick={() => setOpenForm(true)}
          className="flex items-center gap-1"
        >
          <AddRegular
            fontSize={20}
            className="dark:text-blue-500 text-blue-700"
          />
          Nuevo horario
        </button>
      </div>
      {countSchedules > 0 ? (
        <div className={cn('grid gap-4 mt-2 lg:grid-cols-2')}>
          {actives?.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              refetch={refetch}
            />
          ))}
          {archived?.map((schedule) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              refetch={refetch}
            />
          ))}
        </div>
      ) : (
        <div className="p-10 bg-neutral-500/10 rounded-lg">
          <p className="text-center">No hay horarios activos</p>
        </div>
      )}
    </div>
  )
}

type ScheduleFormValue = {
  startDate: Date
  days: string[]
  from?: Date
  to?: Date
  tolerance?: string
}
export function ScheduleForm(props: {
  default?: Schedule
  refetch?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { user } = useUserEdit()
  const [o, setO] = React.useState(false)

  const open = props.open !== undefined ? props.open : o
  const setOpen = props.onOpenChange ?? setO

  const { control, handleSubmit, reset } = useForm<ScheduleFormValue>({
    defaultValues: {
      days: props.default?.days ?? [],
      from: props.default?.from && parse(props.default?.from),
      to: props.default?.to && parse(props.default?.to),
      startDate: props.default?.startDate
        ? parse(props.default?.startDate)
        : new Date(),
      tolerance: props.default?.tolerance || '5'
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationKey: ['schedules'],
    mutationFn: ({ values, id }: { values: string; id?: string }) =>
      api.post(id ? `users/schedules/${id}` : 'users/schedules', {
        data: values,
        alreadyHandleError: false
      }),
    onSuccess: () => {
      reset()
      props.refetch?.()
      setOpen(false)
      toast(props.default ? 'Horario actualizado' : 'Horario agregado')
    },
    onError: (error) => {
      toast(handleError(error.message))
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    if (values.days?.length === 0)
      return toast('Selecciona al menos un día de la semana')
    fetch({
      values: JSON.stringify({
        from: format(values.from, 'YYYY-MM-DD HH:mm:ss'),
        to: format(values.to, 'YYYY-MM-DD HH:mm:ss'),
        userId: user?.id,
        days: values.days,
        tolerance: Number(values.tolerance),
        startDate: format(values.startDate, 'YYYY-MM-DD')
      }),
      id: props.default?.id
    })
  })

  return (
    <Dialog
      modalType="modal"
      open={open}
      onOpenChange={(_, e) => setOpen(e.open)}
    >
      <DialogSurface aria-describedby={undefined}>
        <DialogBody>
          <DialogTitle className="pb-5">
            {props.default ? 'Editar horario' : 'Agregar horario'}
          </DialogTitle>
          <DialogContent className="grid gap-2">
            <Controller
              control={control}
              rules={{
                required: 'Selecciona la fecha de inicio'
              }}
              render={({ field, fieldState: { error } }) => (
                <Field
                  required
                  orientation="horizontal"
                  validationMessage={error?.message}
                  label="Inicia o inició a partir de la fecha"
                >
                  <DatePicker
                    value={field.value ? new Date(field.value) : null}
                    onSelectDate={(date) => {
                      field.onChange(date)
                    }}
                    formatDate={(date) =>
                      format(date, '[Desde el] dddd D [de] MMMM [del] YYYY')
                    }
                    strings={calendarStrings}
                    placeholder="Selecciona una fecha"
                  />
                </Field>
              )}
              name="startDate"
            />
            <Controller
              control={control}
              name="days"
              rules={{
                validate: (value) => {
                  if (!value || value.length === 0) {
                    return 'Selecciona al menos un día'
                  }
                  return true
                }
              }}
              render={({ field, fieldState: { error } }) => (
                <Field
                  required
                  orientation="horizontal"
                  label="Días de la semana que se aplicará el horario:"
                  validationMessage={error?.message}
                  validationState={error ? 'error' : 'none'}
                >
                  <div className="flex flex-col">
                    {Object.entries(days).map(([key, day]) => {
                      return (
                        <Checkbox
                          checked={field.value?.includes(key)}
                          onChange={(_, d) => {
                            field.onChange(
                              d.checked
                                ? [...(field.value ?? []), key]
                                : field.value
                                ? field.value.filter((w) => w !== key)
                                : []
                            )
                          }}
                          label={day.label}
                          value={key}
                          key={key}
                        />
                      )
                    })}
                  </div>
                </Field>
              )}
            />
            <Controller
              control={control}
              rules={{
                required: 'Selecciona la hora de ingreso'
              }}
              render={({ field, fieldState: { error } }) => (
                <Field
                  required
                  orientation="horizontal"
                  validationMessage={error?.message}
                  label="Entrada:"
                >
                  <TimePicker
                    ref={field.ref}
                    defaultValue={
                      field.value ? formatDateToTimeString(field.value) : ''
                    }
                    startHour={6}
                    endHour={23}
                    onBlur={(e) => {
                      const parse = parseTime(e.target.value)
                      if (parse) field.onChange(parse)
                      else field.onChange(null)
                    }}
                    onTimeChange={(_, e) =>
                      e.selectedTime && field.onChange(parse(e.selectedTime))
                    }
                    freeform
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
                <Field
                  required
                  orientation="horizontal"
                  validationMessage={error?.message}
                  label="Salida:"
                >
                  <TimePicker
                    ref={field.ref}
                    defaultValue={
                      field.value ? formatDateToTimeString(field.value) : ''
                    }
                    startHour={6}
                    endHour={23}
                    onBlur={(e) => {
                      const parse = parseTime(e.target.value)
                      if (parse) field.onChange(parse)
                      else field.onChange(null)
                    }}
                    onTimeChange={(_, e) =>
                      e.selectedTime && field.onChange(parse(e.selectedTime))
                    }
                    freeform
                    placeholder="Hora de salida"
                  />
                </Field>
              )}
              name="to"
            />
            <Controller
              control={control}
              rules={{
                required: 'Ingresa la tolerancia en minutos'
              }}
              render={({ field, fieldState: { error } }) => (
                <Field
                  required
                  orientation="horizontal"
                  validationMessage={error?.message}
                  label="Tolerancia:"
                  validationState={error ? 'error' : 'none'}
                >
                  <Input
                    className="w-[100px]"
                    {...field}
                    contentAfter={<>min.</>}
                  />
                </Field>
              )}
              name="tolerance"
            />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancelar</Button>
            </DialogTrigger>
            <Button
              disabled={fetching}
              icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
              onClick={onSubmit}
              appearance="primary"
            >
              {props.default ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
