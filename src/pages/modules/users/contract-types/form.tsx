import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { ContractType } from '~/types/contract-type'
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
  description?: string
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: ContractType
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || ''
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/contract-types/${defaultValues?.id}`
      : `partials/contract-types`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        description: values.description
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
          ? 'Tipo de contrato actualizado correctamente'
          : 'Tipo de contrato registrado correctamente'
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
                  ? 'Editar tipo de contrato'
                  : 'Registrar tipo de contrato'}
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
                        label="Nombre"
                        required
                      >
                        <Input placeholder="Ejemplo: Planilla" {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="description"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Descripción"
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
