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
import { AcademicProgram } from '~/types/rm-academic-program'
import { BusinessUnit } from '~/types/business-unit'
import { handleError } from '~/utils'

type FormValues = {
  name: string
  businessUnit: BusinessUnit | null
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
  defaultProp?: AcademicProgram | null
  readOnly?: boolean
}) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
          businessUnit: defaultProp.businessUnit,
          name: defaultProp.name
        }
      : { name: '', businessUnit: null }
  })

  const { data: businessUnits } = useQuery<BusinessUnit[] | null>({
    queryKey: ['partials/businessUnits/all'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<[]>('partials/businessUnits/all')
      if (!res.ok) return null
      return res.data.map((i) => new BusinessUnit(i))
    }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp
          ? `rm/academic-programs/${defaultProp.id}`
          : 'rm/academic-programs',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
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
      businessUnitId: values.businessUnit?.id
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
              {defaultProp ? 'Editar programa' : 'Registrar nuevo programa'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Controller
                control={control}
                rules={{ required: 'Requerido' }}
                name="businessUnit"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Unidad de negocio"
                    orientation="horizontal"
                    required
                  >
                    <Combobox
                      input={{
                        autoComplete: 'off'
                      }}
                      open={readOnly ? false : undefined}
                      onOptionSelect={async (_, option) => {
                        const value = businessUnits?.find(
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
                      {businessUnits?.map((d) => (
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
                            <p className="font-semibold">{d.acronym}</p>
                            <p className="text-xs opacity-60">{d.name}</p>
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
                    label="Nombre del programa:"
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
