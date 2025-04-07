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
  Select,
  Spinner
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '~/lib/api'
import { handleError } from '~/utils'
import { useSlugClassroom } from '../../../+layout'
import { Classroom } from '~/types/academic/classroom'
import { CLASSROOM_TYPES } from '~/const'

type FormValues = {
  code: string
  type: string
  capacity: string
  floor: string
}

export default function Form({
  onOpenChange,
  open,
  refetch = () => {},
  defaultProp,
  readOnly = false
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch: () => void
  defaultProp?: Classroom | null
  readOnly?: boolean
}) {
  const { pavilion, period } = useSlugClassroom()
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
          ...defaultProp,
          capacity: defaultProp.capacity?.toString(),
          floor: defaultProp.floor?.toString()
        }
      : {
          capacity: '',
          code: '',
          floor: '',
          type: ''
        }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp
          ? `academic/classrooms/${defaultProp.id}`
          : 'academic/classrooms',
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
        'En hora buena! El aula ha sido guardado o actualizado con éxito.'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      pavilionId: pavilion?.id,
      code: values.code,
      type: values.type,
      floor: values.floor ? Number(values.floor) : undefined,
      capacity: values.capacity ? Number(values.capacity) : undefined
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
              {defaultProp ? 'Editar aula' : 'Registrar nueva aula'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field orientation="horizontal" label="Periodo:" required>
                <Input disabled defaultValue={period?.name} />
              </Field>
              <Field orientation="horizontal" label="Pabellon:" required>
                <Input disabled defaultValue={pavilion?.name} />
              </Field>

              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="code"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Código:"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="type"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Tipo de aula:"
                  >
                    <Select value={field.value} onChange={field.onChange}>
                      <option value="">Seleccione un tipo de aula</option>
                      {CLASSROOM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="floor"
                rules={{
                  validate: (value) => {
                    if (!value.match(/^[0-9]*$/)) {
                      return 'Solo se permiten números'
                    }
                    return true
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Piso:"
                  >
                    <Input {...field} type="number" readOnly={readOnly} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                rules={{
                  validate: (value) => {
                    if (!value.match(/^[0-9]*$/)) {
                      return 'Solo se permiten números'
                    }
                    return true
                  }
                }}
                name="capacity"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Capacidad:"
                  >
                    <Input {...field} type="number" readOnly={readOnly} />
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
