import {
  Button,
  Combobox,
  Divider,
  Field,
  Option
} from '@fluentui/react-components'
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormUserValues } from './form'
import { useQuery } from '@tanstack/react-query'
import { Job } from '@/types/job'
import { api } from '@/lib/api'
import { Role } from '@/types/role'
import { ContractType } from '@/types/contract-type'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { format } from '@/lib/dayjs'
import { calendarStrings, days } from '@/const'
import {
  AddRegular,
  DeleteRegular,
  TimelineRegular
} from '@fluentui/react-icons'

import { RmBranch } from '@/types/rm-branch'
import React from 'react'
import { useAuth } from '@/store/auth'

export default function OrganizationForm({
  control,
  watch,
  setValue,
  open,
  setOpenFormSchedule
}: {
  control: Control<FormUserValues>
  watch: UseFormWatch<FormUserValues>
  setValue: UseFormSetValue<FormUserValues>
  open: boolean
  setOpenFormSchedule: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { job } = watch()
  const { user } = useAuth()
  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      if (!res.ok) return []
      return res.data.map((job) => new Job(job))
    }
  })

  const { data: roles, isLoading: isRolesLoading } = useQuery<Role[]>({
    queryKey: ['roles', job?.id],
    enabled: open && !!job,
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
    enabled: open,
    queryFn: async () => {
      const res = await api.get<ContractType[]>('partials/contract-types/all')
      if (!res.ok) return []
      return res.data.map((contractType) => new ContractType(contractType))
    }
  })

  const { data: branches, isLoading: isBranchesLoading } = useQuery<RmBranch[]>(
    {
      queryKey: ['branches'],
      enabled: open,
      queryFn: async () => {
        const res = await api.get<RmBranch[]>('rm/branches')
        if (!res.ok) return []
        return res.data.map((i) => new RmBranch(i))
      }
    }
  )

  return (
    <>
      <Divider className="py-2">Organización</Divider>
      <Controller
        control={control}
        name="branch"
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            validationMessage={error?.message}
            label="Sede"
          >
            <Combobox
              {...field}
              value={field.value?.name ?? ''}
              input={{
                autoComplete: 'off'
              }}
              selectedOptions={field.value?.id ? [field.value?.id] : []}
              disabled={isBranchesLoading}
              onOptionSelect={(_, data) => {
                const query = branches?.find((i) => i.id === data.optionValue)
                field.onChange(query)
              }}
              placeholder="Selecciona un sede"
            >
              {branches?.map((i) => (
                <Option key={i.id} text={i.name} value={i.id}>
                  {i.name}
                </Option>
              ))}
            </Combobox>
          </Field>
        )}
      />
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
              value={field.value?.name ?? ''}
              input={{
                autoComplete: 'off'
              }}
              selectedOptions={field.value?.id ? [field.value?.id] : []}
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
      <Controller
        control={control}
        name="schedules"
        render={({ field, fieldState: { error } }) => (
          <Field
            label="Horarios de trabajo"
            orientation="horizontal"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
          >
            <div>
              <Button
                onClick={() => {
                  setOpenFormSchedule(true)
                }}
                icon={
                  <AddRegular className="dark:text-blue-500 text-blue-700" />
                }
                className="w-full"
              >
                Añadir
              </Button>
              <div className="divide-y divide-neutral-500/20">
                {field.value.map((schedule) => (
                  <div
                    className="py-1 flex items-center gap-3"
                    key={schedule.id}
                  >
                    <TimelineRegular fontSize={20} className="opacity-70" />
                    <div className="flex-grow">
                      <p>
                        {format(schedule.from, 'hh:mm A')} -{' '}
                        {format(schedule.to, 'hh:mm A')}
                      </p>
                      <p className="text-xs opacity-70">
                        {schedule.days
                          ?.map((d) => days[d as keyof typeof days].short)
                          .join(', ')}
                      </p>
                    </div>
                    <Button
                      appearance="transparent"
                      icon={<DeleteRegular />}
                      onClick={() =>
                        field.onChange(
                          field.value.filter((s) => s.id !== schedule.id)
                        )
                      }
                    />
                  </div>
                ))}
                {/* <pre>{JSON.stringify(field.value, null, 2)}</pre> */}
              </div>
            </div>
          </Field>
        )}
      />
    </>
  )
}
