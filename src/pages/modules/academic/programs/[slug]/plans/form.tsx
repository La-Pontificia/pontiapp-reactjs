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
  Spinner,
  Switch
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { handleError } from '@/utils'
import { Plan } from '@/types/academic/plan'
import { useSlugProgram } from '../+layout'

type FormValues = {
  name: string
  pontisisCode: string
  status: boolean
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
  defaultProp?: Plan | null
  readOnly?: boolean
}) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
          name: defaultProp.name,
          status: defaultProp.status,
          pontisisCode: defaultProp.pontisisCode || ''
        }
      : { name: '', status: true, pontisisCode: '' }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp ? `academic/plans/${defaultProp.id}` : 'academic/plans',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success('Plan de estudio guardado correctamente')
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const { program } = useSlugProgram()

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name,
      programId: program?.id,
      pontisisCode: values.pontisisCode
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
              {defaultProp ? 'Editar plan' : 'Registrar nuevo plan'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field
                label="Programa académico:"
                orientation="horizontal"
                required
              >
                <Input
                  type="text"
                  disabled
                  readOnly
                  defaultValue={
                    program.name + ' - ' + program.businessUnit.acronym
                  }
                />
              </Field>
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="pontisisCode"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Cod. pontisis:"
                    required
                  >
                    <Input {...field} />
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
                name="status"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Estado:"
                  >
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={readOnly}
                    />
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
