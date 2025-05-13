import { Controller, useForm } from 'react-hook-form'
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
  Input
} from '@fluentui/react-components'

import { Schedule } from '@/types/schedule'
import { format, parse, parseTime } from '@/lib/dayjs'
import { calendarStrings, days } from '@/const'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'

export const ScheduleForm = ({
  open,
  setOpen,
  onSubmit: onSubmitProp
}: {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (s: Partial<Schedule>) => void
}) => {
  const { control, handleSubmit, reset } = useForm<Schedule>({
    defaultValues: {
      days: [],
      tolerance: '5'
    }
  })

  const onSubmit = handleSubmit((values) => {
    reset()
    setOpen(false)
    onSubmitProp({
      ...values,
      id: crypto.randomUUID()
    })
  })

  return (
    <>
      <Dialog
        modalType="modal"
        open={open}
        onOpenChange={(_, e) => setOpen(e.open)}
      >
        <DialogSurface aria-describedby={undefined}>
          <DialogBody>
            <DialogTitle className="pb-5">Agregar horario</DialogTitle>
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
                  <>
                    <Field
                      required
                      orientation="horizontal"
                      label={`Días de la semana que se aplicará el horario:`}
                      validationMessage={error?.message}
                      validationState={error ? 'error' : 'none'}
                    ></Field>
                    <div className="flex items-center">
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
              <Controller
                control={control}
                rules={{
                  required: 'Requerido'
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Desde:"
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
                        const parsed = parseTime(e.target.value)
                        if (parsed) field.onChange(parsed)
                        else field.onChange(null)
                      }}
                      onTimeChange={(_, e) =>
                        e.selectedTime && field.onChange(parse(e.selectedTime))
                      }
                      freeform
                    />
                  </Field>
                )}
                name="from"
              />
              <Controller
                control={control}
                rules={{
                  required: 'Requerido'
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Hasta:"
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
                        const parsed = parseTime(e.target.value)
                        if (parsed) field.onChange(parsed)
                        else field.onChange(null)
                      }}
                      onTimeChange={(_, e) =>
                        e.selectedTime && field.onChange(parse(e.selectedTime))
                      }
                      freeform
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
              <Button onClick={onSubmit} appearance="primary">
                Agregar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
