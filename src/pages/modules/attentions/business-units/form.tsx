import { toast } from 'anni'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
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
  OptionGroup,
  Spinner
} from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AttentionService } from '~/types/attention-service'

type FormValues = {
  name: string
  attentionPosition?: AttentionPosition
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: AttentionService
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const { user: authUser } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [fetching, setFetching] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      name: defaultValues?.name ?? '',
      attentionPosition: defaultValues?.position
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setFetching(true)
    const URI = defaultValues
      ? `attentions/services/${defaultValues?.id}`
      : `attentions/services`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        attentionPositionId: values.attentionPosition?.id
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
          ? 'Opción de servicio actualizado correctamente'
          : 'Opción de servicio registrado correctamente'
      )
    }

    setFetching(false)
  })

  const { data: attentionPositions, isLoading: isLoadingAttentionPositions } =
    useQuery<AttentionPosition[] | null>({
      queryKey: ['attentions/positions/all', 'business'],
      queryFn: async () => {
        const res = await api.get<[]>(
          'attentions/positions/all?relationship=business'
        )
        if (!res.ok) return null
        return res.data.map((e) => new AttentionPosition(e))
      }
    })

  const attentionPositionsGrouped = React.useMemo(() => {
    const positionMap = attentionPositions?.reduce((acc, item) => {
      const businessId = item.business.id

      if (!acc[businessId]) {
        acc[businessId] = {
          business: item.business,
          positions: []
        }
      }

      acc[businessId].positions.push(item)
      return acc
    }, {} as Record<string, { business: AttentionPosition['business']; positions: AttentionPosition[] }>)

    return Object.values(positionMap ?? {})
  }, [attentionPositions])

  return (
    <>
      <Button
        {...triggerProps}
        disabled={
          fetching || !authUser.hasPrivilege('attentions:services:create')
        }
        onClick={() => setOpen(true)}
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
                        label="Nombre del servicio"
                        required
                      >
                        <Input disabled={fetching} {...field} />
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
                        label="Puesto de atención"
                      >
                        <Combobox
                          input={{
                            autoComplete: 'off'
                          }}
                          {...field}
                          selectedOptions={[field.value?.id ?? '']}
                          disabled={isLoadingAttentionPositions || fetching}
                          onOptionSelect={(_, data) => {
                            const job = attentionPositions?.find(
                              (e) => e.id === data.optionValue
                            )
                            field.onChange(job)
                          }}
                          value={field.value?.name ?? ''}
                          placeholder="Selecciona un puesto de atención"
                        >
                          {attentionPositionsGrouped.map((group) => (
                            <OptionGroup label={group.business.name}>
                              {group.positions.map((position) => (
                                <Option key={position.id} value={position.id}>
                                  {position.name}
                                </Option>
                              ))}
                            </OptionGroup>
                          ))}
                        </Combobox>
                      </Field>
                    )}
                    name="attentionPosition"
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
