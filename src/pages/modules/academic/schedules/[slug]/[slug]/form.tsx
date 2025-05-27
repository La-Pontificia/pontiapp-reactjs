/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Select,
  Spinner
} from '@fluentui/react-components'
import {
  BuildingMultipleRegular,
  CalendarLtrRegular,
  ClockRegular,
  Dismiss24Regular
} from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { Pavilion } from '@/types/academic/pavilion'
import { SectionCourse } from '@/types/academic/section-course'
import { useSlugSchedules } from '../+layout'
import { Classroom } from '@/types/academic/classroom'
import {
  concatDateWithTime,
  format,
  parse,
  parseTimeWithFormat
} from '@/lib/dayjs'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { calendarStrings, days } from '@/const'
import { SectionCourseSchedule } from '@/types/academic/section-course-schedule'
import React from 'react'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import Calendar from '@/components/calendar'
import { getDaysShort } from '@/utils'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultProp?: Partial<SectionCourseSchedule>
  refetch: () => void
  sectionCourse: SectionCourse
}

type FormValues = {
  pavilion: Pavilion | null
  classroom: Classroom | null
  startTime: string
  endTime: string
  startDate: Date
  endDate: Date
  daysOfWeek: string[]
}

type ScheduleConflict = {
  name: string
  startDate: Date
  endDate: Date
  startTime: Date
  endTime: Date
  dates: Date[]
  daysOfWeek: string[]
}

export default function ScheduleForm({
  open,
  onOpenChange,
  defaultProp,
  refetch = () => {},
  sectionCourse
}: Props) {
  const [scheduleConflict, setScheduleConflict] = React.useState<
    ScheduleConflict | undefined
  >(undefined)
  const [openConflict, setOpenConflict] = React.useState(false)

  const { control, handleSubmit, reset, watch } = useForm<FormValues>()
  const { period } = useSlugSchedules()

  React.useEffect(() => {
    if (defaultProp) {
      reset({
        pavilion: defaultProp.classroom?.pavilion ?? null,
        classroom: defaultProp.classroom ?? null,
        startTime: defaultProp.startTime
          ? format(defaultProp.startTime, 'HH:mm')
          : '',
        endTime: defaultProp.endTime
          ? format(defaultProp.endTime, 'HH:mm')
          : '',
        startDate: defaultProp.startDate
          ? parse(defaultProp.startDate)
          : new Date(),
        endDate: defaultProp.endDate ? parse(defaultProp.endDate) : new Date(),
        daysOfWeek: defaultProp.daysOfWeek ?? []
      })
    }
  }, [defaultProp])

  const pavilion = watch('pavilion')

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp?.id
          ? `academic/sections/courses/schedules/${defaultProp?.id}`
          : 'academic/sections/courses/schedules',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
    onError: (error) => {
      const parse = JSON.parse(error.message)
      setOpenConflict(true)
      setScheduleConflict(parse.item)
      toast.error(parse.message)
    },
    onSuccess: () => {
      toast.success(
        'En hora buena! El horario del curso ha sido registrado o actualizado con éxito'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const { data: pavilions } = useQuery<Pavilion[]>({
    queryKey: ['academic/pavilions', period],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Pavilion[]>(
        `academic/pavilions?periodId=${period?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const { data: classrooms } = useQuery<Classroom[]>({
    queryKey: ['academic/classrooms', pavilion],
    enabled: !!(open && pavilion),
    queryFn: async () => {
      const res = await api.get<Classroom[]>(
        `academic/classrooms?pavilionId=${pavilion?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      sectionCourseId: sectionCourse.id,
      pavilionId: values.pavilion?.id,
      classroomId: values.classroom?.id,
      startTime: parseTimeWithFormat(values.startTime),
      endTime: parseTimeWithFormat(values.endTime),
      startDate: format(values.startDate, 'YYYY-MM-DD'),
      endDate: format(values.endDate, 'YYYY-MM-DD'),
      daysOfWeek: values.daysOfWeek
    })
  })

  const dteacher = defaultProp?.sectionCourse?.teacher
  const steacher = sectionCourse.teacher

  const calendarComp = React.useMemo(() => {
    const sourcesEvents: EventSourceInput = {
      events: scheduleConflict?.dates?.map((date, i) => ({
        id: `schedule-conflict-${i}`,
        title: scheduleConflict?.name ?? 'Conflicto de horario',
        start: concatDateWithTime(date, scheduleConflict?.startTime),
        end: concatDateWithTime(date, scheduleConflict?.endTime),
        className: '!bg-red-700 text-white'
      }))
    }
    return (
      <Calendar
        focusDate={scheduleConflict?.dates[0]}
        highlightEventId={`schedule-conflict-0`}
        events={sourcesEvents}
        defaultView="timeGridWeek"
        nav={<div className="text-center">{scheduleConflict?.name}</div>}
      />
    )
  }, [scheduleConflict])

  return (
    <>
      <Dialog
        open={openConflict}
        onOpenChange={(_, { open }) => setOpenConflict(open)}
      >
        <DialogSurface className="max-xl:!max-w-[95vw] !overflow-hidden !bg-[#f5f5f4] dark:!bg-[#2f2e2b] !max-h-[95vh] xl:!min-w-[1000px] !p-0">
          <DialogBody
            style={{
              maxHeight: '99vh',
              gap: 0
            }}
          >
            <DialogContent className="flex !p-1 !pb-0 xl:!h-[600px] !max-h-[100%]">
              {calendarComp}
              {scheduleConflict && (
                <div className="w-[350px] max-md:hidden overflow-auto max-w-[350px] flex gap-1 flex-col p-2">
                  <div className="grow overflow-y-auto flex gap-1.5 flex-col">
                    <div className="p-2 flex bg-white dark:bg-stone-900 items-center gap-2 text-left rounded-lg">
                      <div className="grow">
                        <p className="overflow-ellipsis font-medium line-clamp-1 pb-1">
                          {scheduleConflict?.name}
                        </p>
                        <div className="text-xs flex items-center gap-1">
                          <BuildingMultipleRegular
                            fontSize={19}
                            className="opacity-50"
                          />
                          {scheduleConflict.name}
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <CalendarLtrRegular
                            fontSize={19}
                            className="opacity-50"
                          />
                          {format(scheduleConflict.startDate, 'DD MMM, YYYY')} -{' '}
                          {format(scheduleConflict.endDate, 'DD MMM, YYYY')}
                        </div>
                        <div className="text-xs flex items-center gap-1">
                          <ClockRegular fontSize={19} className="opacity-50" />
                          {format(scheduleConflict.startTime, 'hh:mm A')} -{' '}
                          {format(scheduleConflict.endTime, 'hh:mm A')}
                        </div>
                        <div className="py-1 pl-5">
                          <Badge color="warning">
                            {getDaysShort(scheduleConflict?.daysOfWeek)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogActions className="flex justify-end">
                    <Button
                      onClick={() => setOpenConflict(false)}
                      appearance="outline"
                    >
                      Cerrar
                    </Button>
                  </DialogActions>
                </div>
              )}
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={open} onOpenChange={(_, { open }) => onOpenChange(open)}>
        <DialogSurface className="min-w-[550px] w-[550px]">
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              {defaultProp?.id
                ? 'Editar programa'
                : 'Registrar horario de clase'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field required label="Sección:" orientation="horizontal">
                <Input
                  disabled
                  readOnly
                  defaultValue={sectionCourse.section.code}
                />
              </Field>
              <Field required label="Codigo curso:" orientation="horizontal">
                <Input
                  disabled
                  readOnly
                  defaultValue={
                    defaultProp?.sectionCourse?.planCourse?.course?.code ??
                    sectionCourse.planCourse?.course?.code
                  }
                />
              </Field>
              <Field required label="Nombre curso:" orientation="horizontal">
                <Input
                  disabled
                  readOnly
                  defaultValue={
                    defaultProp?.sectionCourse?.planCourse.name ??
                    sectionCourse?.planCourse?.name
                  }
                />
              </Field>
              <Field required label="Docente:" orientation="horizontal">
                <Input
                  disabled
                  readOnly
                  defaultValue={
                    dteacher
                      ? `${dteacher?.documentId ?? ''} - ${
                          dteacher?.fullName || dteacher?.displayName || ''
                        }`
                      : `${steacher?.documentId ?? ''} - ${
                          steacher?.fullName || steacher?.displayName || ''
                        }`
                  }
                />
              </Field>
              <Field required label="Pab/Aula:" orientation="horizontal">
                <div className="grid grid-cols-2 !gap-4">
                  <Controller
                    control={control}
                    rules={{ required: 'Requerido' }}
                    name="pavilion"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationMessage={error?.message}
                        validationState={error ? 'error' : 'none'}
                      >
                        <Select
                          onChange={(_, d) => {
                            const pavilion = pavilions?.find(
                              (c) => c.id === d.value
                            )
                            if (pavilion) {
                              field.onChange(pavilion)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          value={field.value?.id}
                        >
                          <option value={''}>Seleccionar pabellon</option>
                          {pavilions?.map((pavilion) => (
                            <option key={pavilion.id} value={pavilion.id}>
                              {pavilion.name}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{ required: 'Requerido' }}
                    name="classroom"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationMessage={error?.message}
                        validationState={error ? 'error' : 'none'}
                      >
                        <Select
                          onChange={(_, d) => {
                            const classroom = classrooms?.find(
                              (c) => c.id === d.value
                            )
                            if (classroom) {
                              field.onChange(classroom)
                            } else {
                              field.onChange(null)
                            }
                          }}
                          value={field.value?.id}
                        >
                          <option value={''}>Seleccionar aula</option>
                          {classrooms?.map((classroom) => (
                            <option key={classroom.id} value={classroom.id}>
                              {classroom.code}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                  />
                </div>
              </Field>
              <Controller
                control={control}
                rules={{
                  required: 'Requerido',
                  pattern: {
                    value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: 'Ingrese la hora en formato HH:mm y 24 horas'
                  }
                }}
                name="startTime"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hora inicio de clase:"
                  >
                    <Input {...field} placeholder="HH:mm" />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: 'Requerido',
                  pattern: {
                    value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                    message: 'Ingrese la hora en formato HH:mm y 24 horas'
                  }
                }}
                name="endTime"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hora fin de clase:"
                  >
                    <Input {...field} placeholder="HH:mm" />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: 'Requerido'
                }}
                name="startDate"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Repetir desde:"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onSelectDate={(date) => {
                        field.onChange(date)
                      }}
                      formatDate={(date) =>
                        format(date, '[Desde el] dddd D [de] MMMM')
                      }
                      strings={calendarStrings}
                      placeholder="Selecciona una fecha"
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: 'Requerido'
                }}
                name="endDate"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Repetir hasta:"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onSelectDate={(date) => {
                        field.onChange(date)
                      }}
                      formatDate={(date) =>
                        format(date, '[Hasta el] dddd D [de] MMMM')
                      }
                      strings={calendarStrings}
                      placeholder="Selecciona una fecha"
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="daysOfWeek"
                rules={{
                  validate: (value) => {
                    if (!value || value.length === 0) {
                      return 'Selecciona al menos un día'
                    }
                    return true
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Field
                      required
                      orientation="vertical"
                      label="Días de la semana"
                      validationMessage={error?.message}
                      validationState={error ? 'error' : 'none'}
                    />
                    <div className="flex">
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
                            required={false}
                            label={day.short}
                            value={key}
                            key={key}
                          />
                        )
                      })}
                    </div>
                  </>
                )}
              />
            </DialogContent>
            <DialogActions className="pt-5">
              <Button
                disabled={fetching}
                icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
                onClick={() => {
                  onSubmit()
                }}
                appearance="primary"
              >
                {defaultProp?.id ? 'Actualizar' : 'Registrar'}
              </Button>
              <Button onClick={() => onOpenChange(false)} appearance="outline">
                Cerrar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
