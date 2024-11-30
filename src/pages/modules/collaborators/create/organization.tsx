/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FormValues } from './+page'

import {
  Badge,
  Button,
  Checkbox,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Option
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { Job } from '@/types/job'
import { api } from '@/lib/api'
import * as React from 'react'
import { format } from '@/lib/dayjs'
import { calendarStrings, days } from '@/const'
import { Add20Regular, Clock24Regular } from '@fluentui/react-icons'
import { Role } from '@/types/role'
import { useAuth } from '@/store/auth'
import { ContractType } from '@/types/contract-type'
import { Schedule } from '@/types/schedule'
import { AssistTerminal } from '@/types/assist-terminal'
import {
  formatDateToTimeString,
  TimePicker
} from '@fluentui/react-timepicker-compat'
import { toast } from '@/commons/toast'

export default function OrganizationUser({
  control,
  watch,
  setValue
}: {
  control: Control<FormValues, any>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
}) {
  const { job, schedules } = watch()
  const { user } = useAuth()

  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      return res.map((job) => new Job(job))
    }
  })

  const { data: roles, isLoading: isRolesLoading } = useQuery<Role[]>({
    queryKey: ['roles', job],
    queryFn: async () => {
      const res = await api.get<Role[]>(`partials/roles/all?job=${job?.id}`)
      return res.map((role) => new Role(role))
    },
    enabled: !!job
  })

  const { data: contractTypes, isLoading: iscontractTypesLoading } = useQuery<
    ContractType[]
  >({
    queryKey: ['contract-types'],
    queryFn: async () =>
      await api.get<ContractType[]>('partials/contract-types/all')
  })

  return (
    <div className="grid grid-cols-2 items-start gap-4 pt-2">
      <Controller
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
                const job = jobs?.find((j) => j.id === data.optionValue)
                field.onChange(job)
                setValue('role', null)
              }}
              value={field.value?.name ?? ''}
              placeholder="Selecciona un puesto"
            >
              {jobs?.map((j) =>
                j.isDeveloper() && !user.isDeveloper() ? null : (
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
            required
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
                role.isDeveloper() && !user.isDeveloper() ? null : (
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
            required
            validationMessage={error?.message}
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
      <div className="col-span-2">
        <Controller
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Field
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
                formatDate={(date) => format(date, 'MMMM D, YYYY')}
                strings={calendarStrings}
                placeholder="Selecciona una fecha"
              />
            </Field>
          )}
          name="entryDate"
        />
      </div>
      <div className="col-span-2 pt-3 space-y-2">
        <Field className="pb-1" label="Horarios de trabajo" />
        <FormSchedule
          trigger={
            <Button
              icon={<Add20Regular className="text-blue-500" />}
              appearance="subtle"
              className="w-fit"
            >
              Agregar horario
            </Button>
          }
          onCreate={(s) => setValue('schedules', schedules.concat(s))}
          onUpdate={(id, updated) =>
            setValue(
              'schedules',
              schedules.map((current) =>
                current.id === id ? { ...current, updated } : current
              )
            )
          }
        />
        <div className="col-span-2 divide-y divide-neutral-500/20">
          {schedules.map((schedule) => (
            <div className="p-2 flex items-center gap-4" key={schedule.id}>
              <Clock24Regular className="text-blue-500" />
              <div className="flex-grow">
                <p className="font-semibold">
                  {formatDateToTimeString(new Date(schedule.from!))} -{' '}
                  {formatDateToTimeString(new Date(schedule.to!))}
                </p>
                <p className="text-xs dark:text-neutral-400">
                  {schedule
                    .days!.map((d) => days[d as keyof typeof days].short)
                    .join(', ')}
                </p>
              </div>
              <Badge appearance="tint" color="success">
                {schedule.terminal?.name}
              </Badge>
              <Button
                onClick={() =>
                  setValue(
                    'schedules',
                    schedules.filter((s) => s.id !== schedule.id)
                  )
                }
              >
                Eliminar
              </Button>
            </div>
          ))}
          {schedules.length === 0 && (
            <div className="p-10 flex items-center justify-center gap-2">
              <p className="font-semibold">No hay horarios de trabajo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FormSchedule(props: {
  default?: Partial<Schedule>
  trigger?: any
  onCreate: (schedule: Schedule) => void
  onUpdate: (id: string, schedule: Schedule) => void
}) {
  const [open, setOpen] = React.useState(false)
  const { data: terminals, isLoading: isTerminalsLoading } = useQuery<
    AssistTerminal[]
  >({
    queryKey: ['AssistTerminals'],
    queryFn: async () =>
      await api.get<AssistTerminal[]>('partials/assist-terminals/all')
  })

  const { control, handleSubmit, reset, watch, setValue } = useForm<Schedule>({
    defaultValues: {
      days: []
    }
  })

  const { days: watchDays } = watch()

  const onSubmit = handleSubmit((data) => {
    if (data.days?.length === 0)
      return toast('Selecciona al menos un día de la semana')

    if (props.default) props.onUpdate(data.id, data)
    else
      props.onCreate({
        ...data,
        id: crypto.randomUUID()
      })

    setOpen(false)
    reset()
  })

  return (
    <div className="col-span-2 grid grid-cols-2">
      <Dialog
        modalType="modal"
        open={open}
        onOpenChange={(_, e) => setOpen(e.open)}
      >
        <DialogTrigger disableButtonEnhancement>{props.trigger}</DialogTrigger>
        <DialogSurface aria-describedby={undefined}>
          <DialogBody>
            <DialogTitle className="pb-5">
              {props.default ? 'Editar Horario' : 'Agregar nuevo horario'}
            </DialogTitle>
            <DialogContent className="grid gap-4">
              <Controller
                control={control}
                rules={{
                  required: 'Selecciona la fecha de inicio'
                }}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationMessage={error?.message}
                    label="Inicia o inició a partir de la fecha"
                  >
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onSelectDate={(date) => {
                        field.onChange(date)
                      }}
                      appearance="filled-darker"
                      formatDate={(date) => format(date, 'DD/MM/YYYY')}
                      strings={calendarStrings}
                      placeholder="Selecciona una fecha"
                    />
                  </Field>
                )}
                name="startDate"
              />
              <div>
                <Field label="Días de la semana que se aplicará el horario:" />
                <div className="flex items-center gap-2">
                  {Object.entries(days).map(([key, day]) => {
                    return (
                      <Checkbox
                        checked={watchDays?.includes(key)}
                        onChange={(_, d) => {
                          setValue(
                            'days',
                            d.checked
                              ? [...(watchDays ?? []), key]
                              : watchDays
                              ? watchDays.filter((w) => w !== key)
                              : []
                          )
                        }}
                        label={day.short}
                        value={key}
                        key={key}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="border-t grid items-start grid-cols-2 pt-2 gap-4 border-neutral-500/30">
                <Controller
                  control={control}
                  rules={{
                    required: 'Selecciona la hora de ingreso'
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Field validationMessage={error?.message} label="Entrada:">
                      <TimePicker
                        ref={field.ref}
                        onBlur={field.onBlur}
                        startHour={5}
                        endHour={23}
                        increment={15}
                        onTimeChange={(_, e) => field.onChange(e.selectedTime)}
                        selectedTime={
                          field.value ? new Date(field.value) : undefined
                        }
                        value={
                          field.value
                            ? formatDateToTimeString(new Date(field.value))
                            : undefined
                        }
                        placeholder="Hora de ingreso"
                      />
                    </Field>
                  )}
                  name="from"
                />
                <Controller
                  control={control}
                  rules={{
                    required: 'Selecciona la hora de salida'
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Field validationMessage={error?.message} label="Salida:">
                      <TimePicker
                        ref={field.ref}
                        onBlur={field.onBlur}
                        startHour={5}
                        endHour={23}
                        increment={15}
                        onTimeChange={(_, e) => field.onChange(e.selectedTime)}
                        selectedTime={
                          field.value ? new Date(field.value) : undefined
                        }
                        value={
                          field.value
                            ? formatDateToTimeString(new Date(field.value))
                            : ''
                        }
                        placeholder="Hora de salida"
                      />
                    </Field>
                  )}
                  name="to"
                />
              </div>
              <div className="border-t grid grid-cols-2 pt-2 gap-4 border-neutral-500/30">
                <Controller
                  rules={{
                    required: 'Selecciona un puesto de trabajo'
                  }}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Field
                      required
                      validationMessage={error?.message}
                      label="Terminal de asistencia"
                    >
                      <Combobox
                        {...field}
                        selectedOptions={[field.value.id ?? '']}
                        disabled={isTerminalsLoading}
                        onOptionSelect={(_, data) => {
                          const terminal = terminals!.find(
                            (t) => t.id === data.optionValue
                          )
                          field.onChange(terminal)
                        }}
                        value={field.value.name ?? ''}
                        placeholder="Selecciona un terminal"
                      >
                        {terminals?.map((terminal) => (
                          <Option
                            key={terminal.id}
                            text={terminal.name}
                            value={terminal.id}
                          >
                            {terminal.name}
                          </Option>
                        ))}
                      </Combobox>
                    </Field>
                  )}
                  name="terminal"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button onClick={onSubmit} appearance="primary">
                {props.default ? 'Actualizar' : 'Agregar'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
