import {
  Button,
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
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { Area } from '@/types/academic/area'
import { handleError } from '@/utils'

type FormValues = {
  name: string
}

export default function Form({
  onOpenChange,
  open,
  refetch = () => { },
  defaultProp,
  readOnly = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch: () => void
  defaultProp?: Area | null
  readOnly?: boolean
}) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
        name: defaultProp.name
      }
      : {
        name: ''
      }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp ? `academic/areas/${defaultProp.id}` : 'academic/areas',
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
        'En hora buena!, El área ha sido registrado o actualizado con éxito'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name
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
              {defaultProp ? 'Editar area' : 'Registrar nueva area'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="name"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Nombre:"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
                  </Field>
                )}
              />
            </DialogContent>
            <DialogActions className="pt-5">
              <Button
                disabled={fetching}
                icon={fetching ? <Spinner size="extra-tiny" /> : undefined}
                onClick={() => {
                  if (readOnly) {
                    onOpenChange(false)
                  } else {
                    onSubmit()
                  }
                }}
                appearance="primary"
              >
                {defaultProp ? 'Actualizar' : 'Registrar'}
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
