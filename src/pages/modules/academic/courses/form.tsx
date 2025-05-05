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
import { useAuth } from '@/store/auth'
import { Course } from '@/types/academic/course'
import { handleError } from '@/utils'

type FormValues = {
  name: string
  code: string
  teoricHours: string
  practiceHours: string
  credits: string
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
  defaultProp?: Course | null
  readOnly?: boolean
}) {
  const { businessUnit } = useAuth()
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
        name: defaultProp.name,
        code: defaultProp.code,
        teoricHours: defaultProp.teoricHours?.toString(),
        practiceHours: defaultProp.practiceHours?.toString(),
        credits: defaultProp.credits?.toString()
      }
      : {
        name: '',
        code: '',
        teoricHours: '0',
        practiceHours: '0',
        credits: '0'
      }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp ? `academic/courses/${defaultProp.id}` : 'academic/courses',
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
        'En hora buena!, El curso ha sido registrado o actualizado con éxito'
      )
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name,
      code: values.code,
      teoricHours: values.teoricHours ? Number(values.teoricHours) : undefined,
      practiceHours: values.practiceHours
        ? Number(values.practiceHours)
        : undefined,
      credits: values.credits ? Number(values.credits) : undefined,
      businessUnitId: businessUnit?.id
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
              {defaultProp ? 'Editar curso' : 'Registrar nuevo curso'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field orientation="horizontal" label="Unidad:" required>
                <Input defaultValue={businessUnit?.name} disabled />
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
              <Controller
                control={control}
                name="teoricHours"
                render={({ field }) => (
                  <Field orientation="horizontal" label="Horas teóricas:">
                    <Input {...field} type="number" readOnly={readOnly} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="practiceHours"
                render={({ field }) => (
                  <Field orientation="horizontal" label="Horas prácticas:">
                    <Input {...field} type="number" readOnly={readOnly} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="credits"
                render={({ field }) => (
                  <Field orientation="horizontal" label="Número de créditos:">
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
