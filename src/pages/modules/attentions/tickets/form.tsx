import { toast } from 'anni'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { BusinessUnit } from '~/types/business-unit'
import { AttentionPosition } from '~/types/attention-position'
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
  Spinner,
  Switch
} from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  name: string
  shortName?: string
  businessUnit?: BusinessUnit
  available?: boolean
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: AttentionPosition
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const { user: authUser } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [fetching, setFetching] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      name: defaultValues?.name ?? '',
      shortName: defaultValues?.shortName ?? '',
      businessUnit: defaultValues?.business,
      available: defaultValues?.available ?? true
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setFetching(true)
    const URI = defaultValues
      ? `attentions/positions/${defaultValues?.id}`
      : `attentions/positions`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        shortName: values.shortName,
        businessUnitId: values.businessUnit?.id,
        available: values.available
      })
    })

    if (!res.ok) {
      toast.error(handleError(res.error))
    } else {
      refetch()
      setOpen(false)
      reset()
      toast(
        defaultValues
          ? 'Puesto de atencion actualizado correctamente'
          : 'Puesto de atencion registrado correctamente'
      )
    }

    setFetching(false)
  })

  const { data: businessUnits, isLoading: isLoadingBusinessUnits } = useQuery<
    BusinessUnit[] | null
  >({
    queryKey: ['partials/businessUnits/all'],
    queryFn: async () => {
      const res = await api.get<[]>('partials/businessUnits/all')
      if (!res.ok) return null
      return res.data.map((event) => new BusinessUnit(event))
    }
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
                {defaultValues
                  ? 'Editar puesto de atención'
                  : 'Registrar puesto de atención'}
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
                        label="Nombre del puesto"
                        required
                      >
                        <Input disabled={fetching} {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="shortName"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Nombre corto"
                        required
                      >
                        <Input
                          placeholder="Ejemplo: #1, #2, #3"
                          disabled={fetching}
                          {...field}
                        />
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
                        label="Unidad de negocio"
                      >
                        <Combobox
                          input={{
                            autoComplete: 'off'
                          }}
                          {...field}
                          selectedOptions={[field.value?.id ?? '']}
                          disabled={isLoadingBusinessUnits || fetching}
                          onOptionSelect={(_, data) => {
                            const job = businessUnits?.find(
                              (e) => e.id === data.optionValue
                            )
                            field.onChange(job)
                          }}
                          value={field.value?.name ?? ''}
                          placeholder="Selecciona un puesto"
                        >
                          {businessUnits?.map((e) => (
                            <Option key={e.id} text={e.name} value={e.id}>
                              {e.name}
                            </Option>
                          ))}
                        </Combobox>
                      </Field>
                    )}
                    name="businessUnit"
                  />

                  <Controller
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        validationMessage={error?.message}
                        label="Estado del puesto de atención"
                      >
                        <Switch
                          disabled={fetching}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </Field>
                    )}
                    name="available"
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
