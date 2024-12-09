/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from '@/types/user-role'
import { Controller, useForm } from 'react-hook-form'
import { useEditUser } from './+layout'
import {
  Avatar,
  Button,
  Combobox,
  Field,
  InfoLabel,
  Input,
  Option,
  Spinner,
  Switch
} from '@fluentui/react-components'
import { availableDomains } from '@/const'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/store/auth'
import PrivilegesDrawer from '@/components/privileges-drawer'
import { Add20Regular } from '@fluentui/react-icons'
import UserDrawer from '@/components/user-drawer'
import { User } from '@/types/user'
import React from 'react'
import { toast } from '@/commons/toast'
import { handleError } from '@/utils'

export type FormValues = {
  displayName: string
  username: string
  domain: string
  status: boolean
  userRole: UserRole | null
  customPrivileges: string[]
  manager?: User | null
}

export default function CollaboratorsEditPage() {
  const { user, refetch } = useEditUser()
  const { user: authUser } = useAuth()
  const [updating, setUpdating] = React.useState(false)
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    values: {
      customPrivileges: user?.customPrivileges || [],
      displayName: user?.displayName || '',
      status: user?.status || false,
      manager: user?.manager,
      userRole: user?.userRole || null,
      username: user?.username || '',
      domain: Object.keys(availableDomains)[0]
    }
  })

  const { data: userRoles, isLoading: isUserRolesLoading } = useQuery<
    UserRole[]
  >({
    queryKey: ['rolesUsers'],
    queryFn: async () => {
      const res = await api.get<UserRole[]>('partials/user-roles/all')
      if (!res.ok) return []
      return res.data.map((r) => new UserRole(r))
    }
  })

  const { manager, customPrivileges } = watch()

  const onSubmit = handleSubmit(async (values) => {
    setUpdating(true)
    const res = await api.post(`users/${user?.id}/updateAccount`, {
      data: JSON.stringify({
        managerId: values.manager?.id,
        userRoleId: values.userRole?.id,
        username: values.username,
        displayName: values.displayName,
        status: values.status,
        customPrivileges: values.customPrivileges,
        email: `${values.username}@${values.domain}`
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      toast('Usuario actualizado correctamente')
    }

    setUpdating(false)
  })

  return (
    <div className="pt-3 flex flex-col h-full w-full">
      <div className="space-y-8 max-w-2xl flex-grow p-5 pt-8">
        <div className="flex items-center gap-1">
          <Field
            required
            className="min-w-[200px] text-nowrap"
            label="Nombre principal de usuario"
          />
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                className="w-full"
                required
                validationMessage={error?.message}
              >
                <Input disabled={updating} {...field} />
              </Field>
            )}
            name="username"
          />
          <span className="block dark:text-blue-500 font-semibold">@</span>
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                required
                validationMessage={error?.message}
                style={{
                  minWidth: 170,
                  width: 170
                }}
              >
                <Combobox
                  {...field}
                  input={{
                    autoComplete: 'off',
                    style: {
                      width: '100%'
                    }
                  }}
                  style={{
                    minWidth: 170,
                    width: 170
                  }}
                  disabled={updating}
                  selectedOptions={[field.value]}
                  onOptionSelect={(_, data) => field.onChange(data.optionValue)}
                  placeholder="Selecciona un dominio"
                >
                  {Object.entries(availableDomains).map(([key]) => (
                    <Option value={key} key={key}>
                      {key}
                    </Option>
                  ))}
                </Combobox>
              </Field>
            )}
            name="domain"
          />
        </div>
        <div className="flex items-center gap-1">
          <Field
            required
            className="min-w-[200px] text-nowrap"
            label={
              <InfoLabel info="Se mostrará en mayor parte del sistema.">
                Display name
              </InfoLabel>
            }
          />
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                className="w-full"
                required
                validationMessage={error?.message}
              >
                <Input disabled={updating} {...field} />
              </Field>
            )}
            name="displayName"
          />
        </div>
        <div className="flex items-center gap-1">
          <Field
            className="min-w-[200px] text-nowrap"
            label="Cuenta habilitada"
          />
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                className="w-full"
                required
                validationMessage={error?.message}
              >
                <Switch
                  disabled={updating}
                  onChange={(_, d) => {
                    field.onChange(d.checked)
                  }}
                  checked={field.value ? true : false}
                />
              </Field>
            )}
            name="status"
          />
        </div>
        <div className="flex items-center gap-1">
          <Field required className="min-w-[200px] text-nowrap" label="Rol" />
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                className="w-full"
                required
                validationMessage={error?.message}
              >
                <Combobox
                  input={{
                    autoComplete: 'off'
                  }}
                  {...field}
                  selectedOptions={[field.value?.id ?? ''] as any}
                  disabled={isUserRolesLoading || updating}
                  onOptionSelect={(_, data) => {
                    const role = userRoles?.find(
                      (ur) => ur.id === data.optionValue
                    )
                    field.onChange(role)
                  }}
                  value={field.value?.title ?? ''}
                  placeholder="Selecciona un rol"
                >
                  {userRoles?.map((c) =>
                    c.isDeveloper && !authUser.isDeveloper ? null : (
                      <Option key={c.id} text={c.title} value={c.id}>
                        <div>
                          <p>{c.title}</p>
                          <p className="text-xs opacity-70">
                            {c.privileges?.length || 0} Privilegios
                          </p>
                        </div>
                      </Option>
                    )
                  )}
                </Combobox>
              </Field>
            )}
            name="userRole"
          />
        </div>
        <div className="flex items-center gap-1">
          <Field
            className="min-w-[200px] text-nowrap"
            label="Privilegios adicionales"
          />
          <div>
            <PrivilegesDrawer
              title="Seleccionar privilegios"
              onSubmitTitle="Guardar"
              asignedPrivileges={customPrivileges}
              triggerProps={{
                icon: <Add20Regular className="dark:text-blue-500" />,
                disabled: updating,
                children:
                  customPrivileges && customPrivileges?.length > 0 ? (
                    <>{customPrivileges?.length} Privilegios adicionales</>
                  ) : (
                    'Añadir'
                  ),
                appearance: 'transparent'
              }}
              onSubmit={(p) => setValue('customPrivileges', p)}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Controller
            control={control}
            name="manager"
            render={({ field, fieldState: { error } }) => (
              <>
                <Field
                  className="min-w-[200px] text-nowrap"
                  label="Administrador (Jefe inmediato)"
                  validationMessage={error?.message}
                />
                <UserDrawer
                  onSubmit={(users) => {
                    field.onChange(users[0])
                  }}
                  users={field.value ? [field.value] : []}
                  title="Seleccionar adminitrador (Jefe inmediato)"
                  onSubmitTitle="Seleccionar"
                  triggerProps={{
                    icon: <Add20Regular className="dark:text-blue-500" />,
                    disabled: updating,
                    children: manager ? (
                      <div className="flex items-center gap-1">
                        <Avatar
                          size={24}
                          image={{
                            src: manager.photoURL
                          }}
                        />
                        {manager.displayName}
                      </div>
                    ) : (
                      'Añadir'
                    ),
                    appearance: 'transparent'
                  }}
                />
              </>
            )}
          />
        </div>
      </div>
      <footer className="border-t w-full gap-24 flex border-neutral-500/30 p-4">
        <Button
          appearance="primary"
          icon={updating ? <Spinner size="extra-tiny" /> : null}
          disabled={
            Object.keys(errors).length > 0 ||
            updating ||
            !authUser.hasPrivilege('users.edit')
          }
          onClick={onSubmit}
        >
          {updating ? 'Actualizando...' : ' Actualizar cuenta'}
        </Button>
      </footer>
    </div>
  )
}
