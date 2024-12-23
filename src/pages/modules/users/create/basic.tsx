/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormValues } from './+page'
import {
  Avatar,
  Checkbox,
  Combobox,
  Field,
  InfoLabel,
  Input,
  Option,
  Switch
} from '@fluentui/react-components'
import { availableDomains } from '~/const'
import React from 'react'
import { Add20Regular, Eye20Filled, Eye20Regular } from '@fluentui/react-icons'
import { generateRandomPassword } from '~/utils'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { UserRole } from '~/types/user-role'
import { useAuth } from '~/store/auth'
import PrivilegesDrawer from '~/components/privileges-drawer'
import UserDrawer from '~/components/user-drawer'

export default function BasicUser({
  control,
  watch,
  setValue
}: {
  control: Control<FormValues, any>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
}) {
  const { user } = useAuth()
  const { customPrivileges } = watch()
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
  const [showPassword, setShowPassword] = React.useState(false)
  const [autoGeneratePassword, setAutoGeneratePassword] = React.useState(true)

  return (
    <div className="space-y-5">
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
              <Input {...field} />
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
              <Input {...field} />
            </Field>
          )}
          name="displayName"
        />
      </div>
      <div className="flex items-start gap-1">
        <Field
          required
          className="min-w-[200px] text-nowrap"
          label="Contraseña"
        />
        <div className="space-y-2 w-full">
          <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                className="w-full"
                required
                validationMessage={error?.message}
              >
                <Input
                  input={{
                    autoComplete: 'new-password'
                  }}
                  readOnly={autoGeneratePassword}
                  type={showPassword ? 'text' : 'password'}
                  contentAfter={
                    <button onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? (
                        <Eye20Filled className="text-blue-500" />
                      ) : (
                        <Eye20Regular className="text-blue-500" />
                      )}
                    </button>
                  }
                  {...field}
                />
              </Field>
            )}
            name="password"
          />
          <Checkbox
            onChange={(_, d) => {
              setAutoGeneratePassword(d.checked ? true : false)
              setValue('password', d.checked ? generateRandomPassword() : '')
            }}
            checked={autoGeneratePassword}
            label="Auto-generar contraseña"
          />
        </div>
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
                disabled={isUserRolesLoading}
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
                  c.isDeveloper && !user.isDeveloper ? null : (
                    <Option key={c.id} text={c.title} value={c.id}>
                      <div>
                        <p>{c.title}</p>
                        <p className="text-xs opacity-70">
                          {c.privileges?.length} Privilegios
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
              disabled: !user.hasPrivilege('users:asignCustomPrivileges'),
              icon: <Add20Regular />,
              children:
                customPrivileges?.length > 0 ? (
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
                  disabled: !user.hasPrivilege('users:asignManager'),
                  icon: <Add20Regular />,
                  children: field.value ? (
                    <div className="flex items-center gap-1">
                      <Avatar
                        size={24}
                        image={{
                          src: field.value.photoURL
                        }}
                      />
                      {field.value.displayName}
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
  )
}
