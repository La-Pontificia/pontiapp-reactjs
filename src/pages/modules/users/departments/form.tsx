import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { Area } from '~/types/area'
import { Department } from '~/types/department'
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
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  name: string
  area?: Area
  codePrefix: string
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: Department
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const { user } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      codePrefix: defaultValues?.codePrefix || '',
      name: defaultValues?.name || '',
      area: defaultValues?.area
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/departments/${defaultValues?.id}`
      : `partials/departments`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        codePrefix: values.codePrefix,
        areaId: values.area?.id
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
          ? 'Departamento actualizado correctamente'
          : 'Departamento registrado correctamente'
      )
    }

    setSubmitting(false)
  })

  const { data: areas, isLoading: isAreaLoading } = useQuery<Area[]>({
    queryKey: ['areas/all'],
    queryFn: async () => {
      const res = await api.get<Area[]>('partials/areas/all')
      if (!res.ok) return []
      return res.data.map((a) => new Area(a))
    },
    enabled: !!open
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
                  ? 'Editar departamento'
                  : 'Registrar departamento'}
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
                        <Input placeholder="Ejemplo: D-001" {...field} />
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
                    rules={{ required: 'Este campo es requerido' }}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        validationMessage={error?.message}
                        label="Area de trabajo"
                      >
                        <Combobox
                          input={{
                            autoComplete: 'off'
                          }}
                          {...field}
                          selectedOptions={[field.value?.id ?? '']}
                          disabled={isAreaLoading}
                          onOptionSelect={(_, data) => {
                            const job = areas?.find(
                              (j) => j.id === data.optionValue
                            )
                            field.onChange(job)
                          }}
                          value={field.value?.name ?? ''}
                          placeholder="Selecciona una area"
                        >
                          {areas?.map((a) =>
                            a.isDeveloper && !user.isDeveloper ? null : (
                              <Option key={a.id} text={a.name} value={a.id}>
                                {a.name}
                              </Option>
                            )
                          )}
                        </Combobox>
                      </Field>
                    )}
                    name="area"
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
