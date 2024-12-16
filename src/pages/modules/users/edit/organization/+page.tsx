import { Controller, useForm } from 'react-hook-form'
import { useEditUser } from '../+layout'
import { useAuth } from '~/store/auth'
import { Job } from '~/types/job'
import { Role } from '~/types/role'
import { ContractType } from '~/types/contract-type'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import {
  Button,
  Combobox,
  Field,
  Option,
  Spinner
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { format } from '~/lib/dayjs'
import { calendarStrings } from '~/const'
import React from 'react'
import { toast } from '~/commons/toast'
import { handleError } from '~/utils'

type FormValues = {
  job: Job | null
  role: Role | null
  contractType: ContractType | null
  entryDate: Date | null
}

export default function UsersEditOrganizationPage() {
  const { user, refetch } = useEditUser()
  const { user: authUser } = useAuth()
  const [updating, setUpdating] = React.useState(false)

  const { watch, control, setValue, handleSubmit } = useForm<FormValues>({
    values: {
      job: user?.role.job ?? null,
      role: user?.role ?? null,
      contractType: user?.contractType ?? null,
      entryDate: user?.entryDate ?? null
    }
  })

  const { job } = watch()

  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      if (!res.ok) return []
      return res.data.map((job) => new Job(job))
    }
  })

  const { data: roles, isLoading: isRolesLoading } = useQuery<Role[]>({
    queryKey: ['roles', job],
    queryFn: async () => {
      const res = await api.get<Role[]>(`partials/roles/all?job=${job?.id}`)
      if (!res.ok) return []
      return res.data.map((role) => new Role(role))
    },
    enabled: !!job
  })

  const { data: contractTypes, isLoading: iscontractTypesLoading } = useQuery<
    ContractType[]
  >({
    queryKey: ['contract-types'],
    queryFn: async () => {
      const res = await api.get<ContractType[]>('partials/contract-types/all')
      if (!res.ok) return []
      return res.data.map((c) => new ContractType(c))
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setUpdating(true)
    const res = await api.post(`users/${user?.username}/updateOrganization`, {
      data: JSON.stringify({
        jobId: values.job?.id,
        roleId: values.role?.id,
        contractTypeId: values.contractType?.id,
        entryDate: values.entryDate
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      toast('Cuenta actualizada correctamente')
    }
    setUpdating(false)
  })

  return (
    <div className="flex flex-col  pt-2">
      <div className="flex-grow">
        <div className="grid grid-cols-2 gap-4 items-start">
          <Controller
            rules={{
              required: 'Seleccione un puesto de trabajo.'
            }}
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
                  disabled={
                    isJobsLoading ||
                    updating ||
                    !authUser.hasPrivilege('users:edit')
                  }
                  onOptionSelect={(_, data) => {
                    const job = jobs?.find((j) => j.id === data.optionValue)
                    field.onChange(job)
                    setValue('role', null)
                  }}
                  value={field.value?.name ?? ''}
                  placeholder="Selecciona un puesto"
                >
                  {jobs?.map((j) =>
                    j.isDeveloper && !authUser.isDeveloper ? null : (
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
            rules={{
              required: 'Seleccione un cargo.'
            }}
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
                  disabled={
                    isRolesLoading ||
                    updating ||
                    !authUser.hasPrivilege('users:edit')
                  }
                  onOptionSelect={(_, data) => {
                    const role = roles?.find((r) => r.id === data.optionValue)
                    field.onChange(role)
                  }}
                  value={field.value?.name ?? ''}
                  placeholder="Selecciona un cargo"
                >
                  {roles?.map((role) =>
                    role.isDeveloper && !authUser.isDeveloper ? null : (
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
                  disabled={
                    iscontractTypesLoading ||
                    updating ||
                    !authUser.hasPrivilege('users:edit')
                  }
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
                    disabled={updating || !authUser.hasPrivilege('users:edit')}
                    formatDate={(date) => format(date, 'MMMM D, YYYY')}
                    strings={calendarStrings}
                    placeholder="Selecciona una fecha"
                  />
                </Field>
              )}
              name="entryDate"
            />
          </div>
        </div>
      </div>
      <footer className="border-t w-full gap-24 flex border-neutral-500/30 p-4">
        <Button
          appearance="primary"
          disabled={updating || !authUser.hasPrivilege('users:edit')}
          icon={updating ? <Spinner size="extra-tiny" /> : null}
          onClick={onSubmit}
        >
          {updating ? 'Actualizando...' : ' Actualizar organización'}
        </Button>
      </footer>
    </div>
  )
}

// export const CreateEntryHistory = ({ refresh }: { refresh: () => void }) => {
//   const { user } = useEditUser()
//   const [creating, setCreating] = React.useState(false)
//   const [openDialog, setOpenDialog] = React.useState(false)

//   const { control, handleSubmit } = useForm<{
//     entryDate: Date | null
//     exitDate: Date | null
//   }>({
//     values: {
//       entryDate: user?.entryDate ?? null
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } as any,
//     defaultValues: {
//       exitDate: new Date()
//     }
//   })

//   const handleCreate = handleSubmit(async (values) => {
//     setCreating(true)
//     const res = await api.post(`users/${user?.username}/create-entry-history`, {
//       data: JSON.stringify({
//         exitDate: values.exitDate
//       })
//     })

//     if (!res.ok) {
//       toast(handleError(res.error))
//     } else {
//       setOpenDialog(false)
//       refresh()
//       toast('Historial creado con exito')
//     }

//     setCreating(false)
//   })
//   return (
//     <>
//       <Tooltip
//         relationship="description"
//         content="Crear un historial de cambios de cuando ingresó y salió de la empresa."
//       >
//         <Button
//           onClick={() => setOpenDialog(true)}
//           icon={<ArrowCircleDownSplitRegular />}
//           className="text-nowrap"
//         >
//           Crear Historial
//         </Button>
//       </Tooltip>
//       {openDialog && (
//         <Dialog
//           open={openDialog}
//           onOpenChange={(_, e) => setOpenDialog(e.open)}
//           modalType="modal"
//         >
//           <DialogSurface>
//             <DialogBody>
//               <DialogTitle>
//                 Crear un historial de cambios para {user?.displayName}
//               </DialogTitle>
//               <DialogContent>
//                 <div className="pb-2">
//                   Seleccione el cargo al que desea transferir.
//                 </div>
//                 <div className="pt-3 space-y-4">
//                   <Controller
//                     control={control}
//                     disabled
//                     render={({ field, fieldState: { error } }) => (
//                       <Field
//                         validationMessage={
//                           error?.message ?? 'Cuando inició sus labores.'
//                         }
//                         validationState={error?.message ? 'error' : 'warning'}
//                         label="Fecha de entrada"
//                       >
//                         <DatePicker
//                           ref={field.ref}
//                           value={field.value ? new Date(field.value) : null}
//                           onSelectDate={(date) => {
//                             field.onChange(date)
//                           }}
//                           disabled
//                           formatDate={(date) => format(date, 'MMMM D, YYYY')}
//                           strings={calendarStrings}
//                           placeholder="Selecciona una fecha"
//                         />
//                       </Field>
//                     )}
//                     name="entryDate"
//                   />
//                   <Controller
//                     control={control}
//                     render={({ field, fieldState: { error } }) => (
//                       <Field
//                         validationMessage={
//                           error?.message ??
//                           'Cuando finaliza o finalizó sus labores.'
//                         }
//                         validationState={error?.message ? 'error' : 'warning'}
//                         label="Fecha de salida"
//                       >
//                         <DatePicker
//                           ref={field.ref}
//                           value={field.value ? new Date(field.value) : null}
//                           onSelectDate={(date) => {
//                             field.onChange(date)
//                           }}
//                           disabled={creating}
//                           formatDate={(date) => format(date, 'MMMM D, YYYY')}
//                           strings={calendarStrings}
//                           placeholder="Selecciona una fecha"
//                         />
//                       </Field>
//                     )}
//                     name="exitDate"
//                   />
//                 </div>
//               </DialogContent>
//               <DialogActions>
//                 <DialogTrigger disableButtonEnhancement>
//                   <Button appearance="secondary">Cancelar</Button>
//                 </DialogTrigger>
//                 <Button
//                   onClick={handleCreate}
//                   disabled={creating}
//                   icon={creating ? <Spinner size="tiny" /> : undefined}
//                   appearance="primary"
//                 >
//                   {creating ? 'Creando...' : 'Crear'}
//                 </Button>
//               </DialogActions>
//             </DialogBody>
//           </DialogSurface>
//         </Dialog>
//       )}
//     </>
//   )
// }
