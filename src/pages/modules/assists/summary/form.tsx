import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { Department } from '~/types/department'
import { Job } from '~/types/job'
import { Role } from '~/types/role'
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
  Spinner
} from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  name: string
  department?: Department
  job?: Job
  codePrefix: string
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: Role
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const { user } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    values: {
      codePrefix: defaultValues?.codePrefix || '',
      name: defaultValues?.name || '',
      department: defaultValues?.department,
      job: defaultValues?.job
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/roles/${defaultValues?.id}`
      : `partials/roles`

    const res = await api.post(URI, {
      data: JSON.stringify({
        name: values.name,
        codePrefix: values.codePrefix,
        departmentId: values.department?.id,
        jobId: values.job?.id
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
          ? 'Cargo actualizado correctamente'
          : 'Cargo registrado correctamente'
      )
    }

    setSubmitting(false)
  })

  const { data: departments, isLoading: isDepartmentsLoading } = useQuery<
    Department[]
  >({
    queryKey: ['departments/all'],
    queryFn: async () => {
      const res = await api.get<Department[]>('partials/departments/all')
      if (!res.ok) return []
      return res.data.map((a) => new Department(a))
    },
    enabled: !!open
  })

  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs/all'],
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      if (!res.ok) return []
      return res.data.map((j) => new Job(j))
    },
    enabled: !!open
  })

  return (
    <>
      <Button onClick={() => setOpen(true)} {...triggerProps} />
      {open && (
        <Dialog
          open={open}
          onOpenChange={(_, e) => setOpen(e.open)}
          modalType="modal"
        >
          <DialogSurface aria-describedby={undefined}>
            <DialogBody>
              <DialogTitle>
                {defaultValues ? 'Editar cargo' : 'Registrar cargo'}
              </DialogTitle>
              <DialogContent className="space-y-4">
                <div className="grid gap-4">
                  <Controller
                    control={control}
                    name="codePrefix"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Prefijo del Código"
                        required
                      >
                        <Input placeholder="Ejemplo: C-001" {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="name"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Nombre"
                        required
                      >
                        <Input {...field} />
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
                        label="Puesto de trabajo"
                      >
                        <Combobox
                          input={{
                            autoComplete: 'off'
                          }}
                          {...field}
                          selectedOptions={[field.value?.id ?? '']}
                          disabled={isJobsLoading}
                          onOptionSelect={(_, data) => {
                            const job = jobs?.find(
                              (j) => j.id === data.optionValue
                            )
                            field.onChange(job)
                          }}
                          value={field.value?.name ?? ''}
                          placeholder="Selecciona un puesto"
                        >
                          {jobs?.map((j) =>
                            j.isDeveloper && !user.isDeveloper ? null : (
                              <Option key={j.id} text={j.name} value={j.id}>
                                {j.name}
                              </Option>
                            )
                          )}
                        </Combobox>
                      </Field>
                    )}
                    name="job"
                  />
                  <Controller
                    rules={{ required: 'Este campo es requerido' }}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Field
                        required
                        validationMessage={error?.message}
                        label="Departamento"
                      >
                        <Combobox
                          input={{
                            autoComplete: 'off'
                          }}
                          {...field}
                          selectedOptions={[field.value?.id ?? '']}
                          disabled={isDepartmentsLoading}
                          onOptionSelect={(_, data) => {
                            const job = departments?.find(
                              (d) => d.id === data.optionValue
                            )
                            field.onChange(job)
                          }}
                          value={field.value?.name ?? ''}
                          placeholder="Selecciona una puesto"
                        >
                          {departments?.map((d) =>
                            d.isDeveloper && !user.isDeveloper ? null : (
                              <Option key={d.id} text={d.name} value={d.id}>
                                {d.name}
                              </Option>
                            )
                          )}
                        </Combobox>
                      </Field>
                    )}
                    name="department"
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cerrar</Button>
                </DialogTrigger>
                <Button
                  disabled={submitting}
                  icon={submitting ? <Spinner size="tiny" /> : undefined}
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
