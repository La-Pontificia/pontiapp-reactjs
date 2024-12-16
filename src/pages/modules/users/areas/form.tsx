import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { Area } from '~/types/area'
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
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  name: string
  codePrefix: string
}
export default function AreaForm({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: Area
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      codePrefix: defaultValues?.codePrefix || '',
      name: defaultValues?.name || ''
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/areas/${defaultValues?.id}`
      : `partials/areas`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        codePrefix: values.codePrefix
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
          ? 'Área actualizada correctamente'
          : 'Área registrada correctamente'
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
                {defaultValues ? 'Editar área' : 'Registrar área'}
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
                        <Input placeholder="Ejemplo: A001" {...field} />
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
                        label="Nombre del área"
                        required
                      >
                        <Input {...field} />
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
