import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import {
  Button,
  ButtonProps,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Option,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { AssistDatabase } from '../databases/+page'
import { AssistTerminal } from '~/types/assist-terminal'

type FormValues = {
  name: string
  database?: string
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: AssistTerminal
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      name: defaultValues?.name || '',
      database: defaultValues?.database
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/assist-terminals/${defaultValues?.id}`
      : `partials/assist-terminals`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        database: values.database
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
          ? 'Terminal biométrico actualizado correctamente'
          : 'Terminal biométrico registrado correctamente'
      )
    }

    setSubmitting(false)
  })

  const { data: databases, isLoading: isDatabasesLoading } = useQuery<
    AssistDatabase[]
  >({
    queryKey: ['assists-databases'],
    queryFn: async () => {
      const res = await api.get<AssistDatabase[]>('assists/databases')
      if (!res.ok) return []
      return res.data
    }
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
                  ? 'Editar registro de terminal biométrico'
                  : 'Registrar un terminal biométrico'}
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
                        <Input {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    rules={{ required: 'Este campo es requerido' }}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        validationMessage={error?.message}
                        label="Base de datos"
                      >
                        <Combobox
                          input={{
                            autoComplete: 'off'
                          }}
                          {...field}
                          selectedOptions={[field.value ?? '']}
                          disabled={isDatabasesLoading}
                          onOptionSelect={(_, data) => {
                            const job = databases?.find(
                              (j) => j.name === data.optionValue
                            )
                            field.onChange(job?.name)
                          }}
                          value={field.value ?? ''}
                          placeholder="Selecciona una base de datos"
                        >
                          {databases?.map((d, key) => (
                            <Option key={key} text={d.name} value={d.name}>
                              {d.name}
                            </Option>
                          ))}
                        </Combobox>
                      </Field>
                    )}
                    name="database"
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
