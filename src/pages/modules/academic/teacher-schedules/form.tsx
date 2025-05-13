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
  Divider,
  Field,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { handleError } from '@/utils'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'
import { format, parse, parseTime } from '@/lib/dayjs'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { calendarStrings, days } from '@/const'
import React from 'react'
import { Schedule } from '@/types/schedule'
import { User } from '@/types/user'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultProp?: Partial<Schedule>
  refetch: () => void
  user: User
}

type FormValues = {
  from: Date
  to: Date
  startDate: Date
  endDate: Date | null
  days: string[]
}

export default function ScheduleForm({
  open,
  onOpenChange,
  defaultProp,
  refetch = () => {},
  user
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormValues>()

  React.useEffect(() => {
    if (defaultProp) {
      reset({
        from: defaultProp.from ? parse(defaultProp.from) : new Date(),
        to: defaultProp.to ? parse(defaultProp.to) : new Date(),
        startDate: defaultProp.startDate
          ? parse(defaultProp.startDate)
          : new Date(),
        endDate: defaultProp.endDate ? parse(defaultProp.endDate) : null,
        days: defaultProp.days ?? []
      })
    }
  }, [defaultProp, reset])

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp?.id
          ? `academic/teachers/schedules/${defaultProp?.id}`
          : `academic/teachers/schedules`,
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
        `En hora buena! El horario ha sido ${
          defaultProp?.id ? 'actualizado' : 'registrado'
        } con éxito`
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      userId: user.id,
      from: format(values.from),
      to: format(values.to),
      startDate: format(values.startDate, 'YYYY-MM-DD'),
      endDate: format(values.endDate, 'YYYY-MM-DD'),
      days: values.days
    })
  })

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
                ? 'Editar horario no disponible 🚫'
                : 'Registrar horario no disponible 🚫'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Controller
                control={control}
                rules={{
                  required: 'Hora no válida'
                }}
                name="from"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hora inicio:"
                  >
                    <TimePicker
                      ref={field.ref}
                      defaultValue={
                        field.value ? formatDateToTimeString(field.value) : ''
                      }
                      inlinePopup
                      startHour={6}
                      endHour={23}
                      onBlur={(e) => {
                        const parse = parseTime(e.target.value)
                        if (parse) field.onChange(parse)
                        else field.onChange(null)
                      }}
                      onTimeChange={(_, e) =>
                        field.onChange(
                          e.selectedTime ? parse(e.selectedTime) : null
                        )
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
                name="to"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hora fin:"
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
                        field.onChange(
                          e.selectedTime ? parse(e.selectedTime) : null
                        )
                      }
                      freeform
                      placeholder=""
                    />
                  </Field>
                )}
              />
              <Divider />
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
                    label="Desde:"
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
                    label="Hasta:"
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
