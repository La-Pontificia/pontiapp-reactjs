import { Combobox, Field, Option } from '@fluentui/react-components'
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormUserValues } from './form'
import { useQuery } from '@tanstack/react-query'
import { Job } from '~/types/job'
import { api } from '~/lib/api'
import { Role } from '~/types/role'
import { ContractType } from '~/types/contract-type'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { format } from '~/lib/dayjs'
import { calendarStrings } from '~/const'
import { useAuth } from '~/store/auth'

export default function OrganizationForm({
  control,
  watch,
  setValue
}: {
  control: Control<FormUserValues>
  watch: UseFormWatch<FormUserValues>
  setValue: UseFormSetValue<FormUserValues>
}) {
  const { job } = watch()
  const { user } = useAuth()
  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      if (!res.ok) return []
      return res.data.map((job) => new Job(job))
    }
  })

  const { data: roles, isLoading: isRolesLoading } = useQuery<Role[]>({
    queryKey: ['roles', job?.id],
    queryFn: async () => {
      const res = await api.get<Role[]>(`partials/roles/all?job=${job?.id}`)
      if (!res.ok) return []
      return res.data.map((role) => new Role(role))
    }
  })

  const { data: contractTypes, isLoading: iscontractTypesLoading } = useQuery<
    ContractType[]
  >({
    queryKey: ['contract-types'],
    queryFn: async () => {
      const res = await api.get<ContractType[]>('partials/contract-types/all')
      if (!res.ok) return []
      return res.data.map((contractType) => new ContractType(contractType))
    }
  })

  return (
    <>
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            validationMessage={error?.message}
            label="Puesto de trabajo"
          >
            <Combobox
              {...field}
              value={field.value?.name ?? undefined}
              input={{
                autoComplete: 'off'
              }}
              defaultSelectedOptions={field.value?.id ? [field.value?.id] : []}
              disabled={isJobsLoading}
              onOptionSelect={(_, data) => {
                const job = jobs?.find((j) => j.id === data.optionValue)
                field.onChange(job)
                setValue('role', null)
              }}
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
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            validationMessage={
              error?.message ?? 'Seleccione un puesto para ver los cargos'
            }
            validationState={error?.message ? 'error' : 'warning'}
            label="Cargo"
          >
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              {...field}
              selectedOptions={[field.value?.id ?? '']}
              disabled={isRolesLoading}
              onOptionSelect={(_, data) => {
                const role = roles?.find((r) => r.id === data.optionValue)
                field.onChange(role)
              }}
              value={field.value?.name ?? ''}
              placeholder="Selecciona un cargo"
            >
              {roles?.map((role) =>
                role.isDeveloper && !user.isDeveloper ? null : (
                  <Option key={role.id} text={role.name} value={role.id}>
                    {role.name}
                  </Option>
                )
              )}
            </Combobox>
          </Field>
        )}
        name="role"
      />
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
            label="Tipo de contrato"
          >
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              {...field}
              selectedOptions={[field.value?.id ?? '']}
              disabled={iscontractTypesLoading}
              onOptionSelect={(_, data) => {
                const contractType = contractTypes?.find(
                  (c) => c.id === data.optionValue
                )
                field.onChange(contractType)
              }}
              value={field.value?.name ?? ''}
              placeholder="Selecciona un tipo de contrato"
            >
              {contractTypes?.map((c) => (
                <Option key={c.id} text={c.name} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Combobox>
          </Field>
        )}
        name="contractType"
      />
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            validationMessage={
              error?.message ?? 'Cuando inció o iniciará sus labores.'
            }
            validationState={error?.message ? 'error' : 'warning'}
            label="Fecha de ingreso"
          >
            <DatePicker
              ref={field.ref}
              value={field.value ? new Date(field.value) : null}
              onSelectDate={(date) => {
                field.onChange(date)
              }}
              formatDate={(date) =>
                format(date, '[Desde el] dddd D [de] MMMM [del] YYYY')
              }
              strings={calendarStrings}
              placeholder="Selecciona una fecha"
            />
          </Field>
        )}
        name="entryDate"
      />
    </>
  )
}
