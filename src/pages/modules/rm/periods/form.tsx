import {
  Avatar,
  Button,
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
import { BuildingMultipleFilled, Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '~/lib/api'
import { RmAcademicProgram } from '~/types/rm-academic-program'
import { RmPeriod } from '~/types/rm-period'
import { handleError } from '~/utils'

type FormValues = {
  name: string
  academicProgram: RmAcademicProgram | null
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
  defaultProp?: RmPeriod | null
  readOnly?: boolean
}) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
          academicProgram: defaultProp.academicProgram,
          name: defaultProp.name
        }
      : { name: '', academicProgram: null }
  })

  const { data: academiPrograms } = useQuery<RmAcademicProgram[] | null>({
    queryKey: ['partials/academic-programs/all'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<[]>('rm/academic-programs')
      if (!res.ok) return null
      return res.data.map((i) => new RmAcademicProgram(i))
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(defaultProp ? `rm/periods/${defaultProp.id}` : 'rm/periods', {
        alreadyHandleError: false,
        data: JSON.stringify(values)
      }),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast('Guardado correctamente')
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name,
      academicProgramId: values.academicProgram?.id
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
              {defaultProp ? 'Editar periodo' : 'Registrar nuevo periodo'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="academicProgram"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Programa académico:"
                    orientation="horizontal"
                    required
                  >
                    <Combobox
                      input={{
                        autoComplete: 'off'
                      }}
                      open={readOnly ? false : undefined}
                      onOptionSelect={async (_, option) => {
                        const value = academiPrograms?.find(
                          (d) => d.id === option.optionValue
                        )
                        if (!value) field.onChange(null)
                        field.onChange(value)
                      }}
                      defaultValue={field.value ? field.value.name : ''}
                      defaultSelectedOptions={
                        field.value ? [field.value.id] : undefined
                      }
                    >
                      {academiPrograms?.map((d) => (
                        <Option
                          disabled={readOnly}
                          text={d.name}
                          key={d.id}
                          value={d.id}
                          className="flex items-center gap-2"
                        >
                          <Avatar
                            color="steel"
                            icon={<BuildingMultipleFilled />}
                          />
                          <div>
                            <p className="font-semibold">{d.name}</p>
                            <p className="text-xs opacity-60">
                              {d.businessUnit.name}
                            </p>
                          </div>
                        </Option>
                      ))}
                    </Combobox>
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
                    label="Nombre del periodo:"
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
