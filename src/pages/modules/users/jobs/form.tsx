import { toast } from '@/commons/toast'
import { api } from '@/lib/api'
import { Job } from '@/types/job'
import { handleError } from '@/utils'
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
  SpinButton,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  name: string
  codePrefix: string
  level: number
}
export default function Form({
  defaultValues,
  triggerProps,
  initialValues,
  refetch
}: {
  defaultValues?: Job
  initialValues?: Partial<FormValues>
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      codePrefix: defaultValues?.codePrefix || '',
      name: defaultValues?.name || '',
      level: defaultValues?.level || initialValues?.level || 10
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/jobs/${defaultValues?.id}`
      : `partials/jobs`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        codePrefix: values.codePrefix,
        level: values.level
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
          ? 'Puesto actualizado correctamente'
          : 'Puesto registrado correctamente'
      )
    }

    setSubmitting(false)
  })

  return (
    <>
      <Button onClick={() => setOpen(true)} {...triggerProps} />
      {open && (
        <Dialog
          open={open}
          onOpenChange={(_, e) => setOpen(e.open)}
          modalType="modal"
        >
          <DialogSurface aria-describedby={undefined}>
            <DialogBody>
              <DialogTitle>
                {defaultValues
                  ? 'Editar puesto de trabajo'
                  : 'Registrar puesto de trabajo'}
              </DialogTitle>
              <DialogContent className="space-y-4">
                <div className="grid gap-4">
                  <Controller
                    control={control}
                    name="codePrefix"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Prefijo del Código"
                        required
                      >
                        <Input placeholder="Ejemplo: P-001" {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Nombre"
                        required
                      >
                        <Input {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="level"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Nivel"
                        required
                      >
                        <SpinButton
                          value={field.value}
                          onChange={(_, value) => field.onChange(value.value)}
                          defaultValue={10}
                          min={0}
                          max={20}
                        />
                      </Field>
                    )}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cerrar</Button>
                </DialogTrigger>
                <Button
                  disabled={submitting}
                  icon={submitting ? <Spinner size="tiny" /> : undefined}
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
