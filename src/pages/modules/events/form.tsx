import { toast } from 'anni'
import { calendarStrings } from '~/const'
import { api } from '~/lib/api'
import { format } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { Event } from '~/types/event'
import { handleError } from '~/utils'
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Spinner,
  Textarea
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  name: string
  description?: string
  date?: Date
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: Event
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const { user: authUser } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [fetching, setFetching] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      date: defaultValues?.date && new Date(defaultValues.date)
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setFetching(true)
    const URI = defaultValues ? `events/${defaultValues?.id}` : `events`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        description: values.description,
        date: format(values.date, 'YYYY-MM-DD')
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      setOpen(false)
      reset()
      toast(
        defaultValues
          ? 'Evento actualizado correctamente'
          : 'Evento registrado correctamente'
      )
    }

    setFetching(false)
  })

  return (
    <>
      <Button
        disabled={fetching || !authUser.hasPrivilege('events:create')}
        onClick={() => setOpen(true)}
        {...triggerProps}
      />
      {open && (
        <Dialog
          open={open}
          onOpenChange={(_, e) => setOpen(e.open)}
          modalType="modal"
        >
          <DialogSurface aria-describedby={undefined}>
            <DialogBody>
              <DialogTitle>
                {defaultValues ? 'Editar event' : 'Registrar nuevo evento'}
              </DialogTitle>
              <DialogContent className="space-y-4">
                <div className="grid gap-4">
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Nombre del evento"
                        required
                      >
                        <Input disabled={fetching} {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Descripcion"
                      >
                        <Textarea disabled={fetching} rows={5} {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    rules={{
                      required: 'Este campo es requerido'
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        validationMessage={error?.message}
                        label="Fecha del evento"
                      >
                        <DatePicker
                          disabled={fetching}
                          value={field.value ? new Date(field.value) : null}
                          onSelectDate={(date) => {
                            field.onChange(date)
                          }}
                          formatDate={(date) => format(date, 'MMMM D, YYYY')}
                          strings={calendarStrings}
                          placeholder="Selecciona una fecha"
                        />
                      </Field>
                    )}
                    name="date"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cerrar</Button>
                </DialogTrigger>
                <Button
                  disabled={fetching}
                  icon={fetching ? <Spinner size="tiny" /> : undefined}
                  onClick={onSubmit}
                  type="submit"
                  appearance="primary"
                >
                  {defaultValues ? 'Guardar cambios' : 'Registrar'}
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  )
}
