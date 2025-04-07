import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Divider,
  Field,
  Input,
  Select,
  Spinner
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { Dismiss24Regular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import { Controller, useForm } from 'react-hook-form'
import { calendarStrings } from '~/const'
import { api } from '~/lib/api'
import { format } from '~/lib/dayjs'
import { useAuth } from '~/store/auth'
import { Period } from '~/types/academic/period'
import { handleError } from '~/utils'

type FormValues = {
  name: string
  cloneByPeriod: Period | null
  startDate: Date | null
  endDate: Date | null
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
  defaultProp?: Period | null
  readOnly?: boolean
}) {
  const { businessUnit } = useAuth()
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: defaultProp
      ? {
          cloneByPeriod: null,
          name: defaultProp.name,
          startDate: defaultProp.startDate,
          endDate: defaultProp.endDate
        }
      : { name: '', startDate: null, endDate: null, cloneByPeriod: null }
  })

  const { mutate: fetch, isPending: fetching } = useMutation({
    mutationFn: (values: object) =>
      api.post(
        defaultProp ? `academic/periods/${defaultProp.id}` : 'academic/periods',
        {
          alreadyHandleError: false,
          data: JSON.stringify(values)
        }
      ),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success('Guardado correctamente')
      reset()
      refetch()
      onOpenChange(false)
    }
  })

  const { data: periods } = useQuery<Period[]>({
    queryKey: ['academic/periods', businessUnit],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Period[]>(
        `academic/periods?businessUnitId=${businessUnit?.id}`
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const onSubmit = handleSubmit((values) => {
    fetch({
      name: values.name,
      startDate: format(values.startDate, 'YYYY-MM-DD'),
      endDate: format(values.endDate, 'YYYY-MM-DD'),
      businessUnitId: businessUnit?.id,
      cloneByPeriodId: values.cloneByPeriod?.id
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
              <Field orientation="horizontal" label="Unidad:" required>
                <Input
                  defaultValue={
                    businessUnit?.name + ' ' + businessUnit?.acronym
                  }
                  disabled
                  readOnly={true}
                />
              </Field>
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
                rules={{
                  required: 'Requerido'
                }}
                name="startDate"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Fecha inicio:"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onSelectDate={(date) => {
                        field.onChange(date)
                      }}
                      formatDate={(date) =>
                        format(date, '[Desde el] dddd D [de] MMMM')
                      }
                      strings={calendarStrings}
                      placeholder="Selecciona una fecha"
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: 'Requerido'
                }}
                name="endDate"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    orientation="horizontal"
                    validationMessage={error?.message}
                    label="Fecha fin:"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onSelectDate={(date) => {
                        field.onChange(date)
                      }}
                      formatDate={(date) =>
                        format(date, '[Hasta el] dddd D [de] MMMM')
                      }
                      strings={calendarStrings}
                      placeholder="Selecciona una fecha"
                    />
                  </Field>
                )}
              />
              {!defaultProp && (
                <>
                  <Divider />
                  <Controller
                    control={control}
                    name="cloneByPeriod"
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        validationState={error ? 'error' : 'none'}
                        orientation="horizontal"
                        validationMessage={
                          error?.message ??
                          'Por favor, selecciona el período del cual deseas clonar las aulas y pabellones.'
                        }
                        label="Clonar aulas:"
                      >
                        <Select
                          onChange={(e) => {
                            const selected = periods?.find(
                              (period) => period.id === e.target.value
                            )
                            field.onChange(selected)
                          }}
                          value={field.value?.id}
                        >
                          {periods?.map((period) => (
                            <option key={period.id} value={period.id}>
                              {period.name}
                            </option>
                          )) ?? []}
                        </Select>
                      </Field>
                    )}
                  />
                </>
              )}
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
