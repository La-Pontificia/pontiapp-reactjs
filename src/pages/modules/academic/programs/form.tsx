import {
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
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { handleError } from '@/utils'
import { Program } from '@/types/academic/program'
import { useAuth } from '@/store/auth'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { Area } from '@/types/academic/area'

type FormValues = {
  name: string
  area?: Area | null
  pontisisCode?: string
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
  defaultProp?: Program | null
  readOnly?: boolean
}) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
          name: defaultProp.name,
          area: defaultProp.area,
          pontisisCode: defaultProp.pontisisCode || ''
        }
      : { name: '', area: null, pontisisCode: '' }
  })

  const { businessUnit } = useAuth()

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp
          ? `academic/programs/${defaultProp.id}`
          : 'academic/programs',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success('El programa ha sido guardado correctamente')
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const { data: areas } = useQuery<Area[]>({
    queryKey: ['areas'],
    queryFn: async () => {
      const res = await api.get<Area[]>('academic/areas')
      if (!res.ok) return []
      return res.data.map((area) => new Area(area))
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name,
      businessUnitId: businessUnit?.id,
      areaId: values.area?.id,
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
              {defaultProp ? 'Editar programa' : 'Registrar nuevo programa'}
            </DialogTitle>
            <DialogContent className="grid gap-2">
              <Field
                orientation="horizontal"
                label="Unidad de Negocio:"
                required
              >
                <Input
                  defaultValue={businessUnit?.name}
                  disabled
                  readOnly={readOnly}
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
                    label="Nombre del programa:"
                    required
                  >
                    <Input {...field} readOnly={readOnly} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: 'Requerido'
                }}
                name="area"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    orientation="horizontal"
                    validationState={error ? 'error' : 'none'}
                    validationMessage={error?.message}
                    label="Area:"
                    required
                  >
                    <Combobox
                      clearable
                      value={field.value ? field.value.name : ''}
                      selectedOptions={field.value ? [field.value.id] : []}
                      onOptionSelect={(_, data) => {
                        field.onChange(
                          areas?.find((p) => p.id === data.optionValue)
                        )
                      }}
                      placeholder="Seleciona una area"
                    >
                      {areas?.map((area) => (
                        <Option key={area.id} value={area.id}>
                          {area.name}
                        </Option>
                      ))}
                    </Combobox>
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
