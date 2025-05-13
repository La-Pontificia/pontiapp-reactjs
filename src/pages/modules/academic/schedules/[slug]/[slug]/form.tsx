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
  Field,
  Input,
  Select,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { Pavilion } from '@/types/academic/pavilion'
import { SectionCourse } from '@/types/academic/section-course'
import { handleError } from '@/utils'
import { useSlugSchedules } from '../+layout'
import { Classroom } from '@/types/academic/classroom'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'
import { format, parse, parseTime } from '@/lib/dayjs'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { calendarStrings, days } from '@/const'
import { SectionCourseSchedule } from '@/types/academic/section-course-schedule'
import React from 'react'

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
  startTime: Date
  endTime: Date
  startDate: Date
  endDate: Date
  daysOfWeek: string[]
}

export default function ScheduleForm({
  open,
  onOpenChange,
  defaultProp,
  refetch = () => {},
  sectionCourse
}: Props) {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>()
  const { period } = useSlugSchedules()

  React.useEffect(() => {
    if (defaultProp) {
      reset({
        pavilion: defaultProp.classroom?.pavilion ?? null,
        classroom: defaultProp.classroom ?? null,
        startTime: defaultProp.startTime
          ? parse(defaultProp.startTime)
          : new Date(),
        endTime: defaultProp.endTime ? parse(defaultProp.endTime) : new Date(),
        startDate: defaultProp.startDate
          ? parse(defaultProp.startDate)
          : new Date(),
        endDate: defaultProp.endDate ? parse(defaultProp.endDate) : new Date(),
        daysOfWeek: defaultProp.daysOfWeek ?? []
      })
    }
  }, [defaultProp, reset])

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
      toast.error(handleError(error.message))
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
      startTime: format(values.startTime),
      endTime: format(values.endTime),
      startDate: format(values.startDate, 'YYYY-MM-DD'),
      endDate: format(values.endDate, 'YYYY-MM-DD'),
      daysOfWeek: values.daysOfWeek
    })
  })

  const dteacher = defaultProp?.sectionCourse?.teacher
  const steacher = sectionCourse.teacher

  return (
    <>
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
                  required: 'Hora no válida'
                }}
                name="startTime"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hora inicio de clase:"
                  >
                    <TimePicker
                      inlinePopup
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
                      placeholder=""
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: 'Hora no válida'
                }}
                name="endTime"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hora fin de clase:"
                  >
                    <TimePicker
                      inlinePopup
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
                      placeholder=""
                    />
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
