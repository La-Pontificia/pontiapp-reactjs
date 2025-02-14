import {
  Avatar,
  Checkbox,
  Combobox,
  Divider,
  Field,
  Input,
  Option,
  Switch
} from '@fluentui/react-components'
import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { FormUserValues } from './form'
import { availableDomains } from '~/const'
import { generateRandomPassword } from '~/utils'
import {
  AddRegular,
  ArrowSyncCircleRegular,
  EyeFilled,
  EyeRegular,
  WrenchRegular
} from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { UserRole } from '~/types/user-role'
import { api } from '~/lib/api'
import PrivilegesDrawer from '~/components/privileges-drawer'
import UserDrawer from '~/components/user-drawer'
import { useAuth } from '~/store/auth'

export default function AccountForm({
  control,
  open
}: {
  control: Control<FormUserValues>
  open: boolean
}) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [autoGeneratePassword, setAutoGeneratePassword] = React.useState(true)
  const { user } = useAuth()
  const { data: userRoles, isLoading: isUserRolesLoading } = useQuery<
    UserRole[]
  >({
    queryKey: ['rolesUsers'],
    enabled: open,
    queryFn: async () => {
      const res = await api.get<UserRole[]>('partials/user-roles/all')
      if (!res.ok) return []
      return res.data.map((r) => new UserRole(r))
    }
  })

  return (
    <>
      <Divider className="py-2">Cuenta</Divider>
      <Controller
        control={control}
        rules={{ required: 'Este campo es requerido' }}
        name="username"
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            label="Nombre de usuario"
            required
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
          >
            <Input
              {...field}
              className="!pr-0"
              contentAfter={
                <div className="flex items-center gap-0">
                  @
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
                          appearance="filled-lighter"
                          {...field}
                          input={{
                            className: '!px-1 w-[120px]'
                          }}
                          style={{
                            minWidth: 170,
                            width: 170
                          }}
                          onChange={field.onChange}
                          defaultSelectedOptions={[field.value]}
                          onOptionSelect={(_, data) =>
                            field.onChange(data.optionValue)
                          }
                          defaultValue={field.value}
                          placeholder="domain"
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
              }
            />
          </Field>
        )}
      />
      <Controller
        control={control}
        rules={{ required: 'Este campo es requerido' }}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            required
            label="Display name"
            validationMessage={
              error?.message ?? 'Nombre que se mostrará en la aplicación'
            }
            validationState={error ? 'error' : 'none'}
          >
            <Input {...field} />
          </Field>
        )}
        name="displayName"
      />
      <Controller
        control={control}
        rules={{
          required: 'Este campo es requerido',
          minLength: {
            value: 8,
            message: 'La contraseña debe tener al menos 8 caracteres'
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            label="Contraseña"
            required
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
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
                    <EyeFilled fontSize={22} className="text-blue-500" />
                  ) : (
                    <EyeRegular fontSize={22} className="text-blue-500" />
                  )}
                </button>
              }
              {...field}
            />
            <Checkbox
              onChange={(_, d) => {
                setAutoGeneratePassword(d.checked ? true : false)
                field.onChange(d.checked ? generateRandomPassword() : '')
              }}
              checked={autoGeneratePassword}
              label="Auto-generar contraseña"
            />
          </Field>
        )}
        name="password"
      />
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            label="Estado del usuario"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
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
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            className="w-full"
            orientation="horizontal"
            label="Rol de usuario en la aplicación"
            validationMessage={error?.message}
          >
            <Combobox
              input={{
                autoComplete: 'off'
              }}
              {...field}
              defaultSelectedOptions={field.value?.id ? [field.value?.id] : []}
              disabled={isUserRolesLoading}
              onOptionSelect={(_, data) => {
                const role = userRoles?.find((ur) => ur.id === data.optionValue)
                field.onChange(role)
              }}
              value={field.value?.title ?? ''}
              placeholder="Selecciona un rol"
            >
              {userRoles?.map((c) =>
                c.isDeveloper && !user.isDeveloper ? null : (
                  <Option key={c.id} text={c.title} value={c.id}>
                    <WrenchRegular
                      fontSize={25}
                      className="dark:text-blue-700 text-blue-500"
                    />
                    {c.title}
                  </Option>
                )
              )}
            </Combobox>
          </Field>
        )}
        name="userRole"
      />
      {user.hasPrivilege('users:asignCustomPrivileges') && (
        <Controller
          control={control}
          name="customPrivileges"
          render={({ field, fieldState: { error } }) => (
            <Field
              label="Privilegios adicionales"
              orientation="horizontal"
              validationMessage={error?.message}
              validationState={error ? 'error' : 'none'}
            >
              <PrivilegesDrawer
                title="Seleccionar privilegios"
                onSubmitTitle="Guardar"
                asignedPrivileges={field.value}
                triggerProps={{
                  icon: (
                    <AddRegular className="dark:text-blue-500 text-blue-700" />
                  ),
                  children:
                    field.value?.length > 0 ? (
                      <>{field.value?.length} Privilegios adicionales</>
                    ) : (
                      'Añadir'
                    )
                }}
                onSubmit={(p) => field.onChange(p)}
              />
            </Field>
          )}
        />
      )}
      <Controller
        control={control}
        name="manager"
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            className="min-w-[200px] text-nowrap"
            label="Administrador"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
          >
            <UserDrawer
              onSubmit={(users) => {
                field.onChange(users[0])
              }}
              users={field.value ? [field.value] : []}
              title="Seleccionar adminitrador (Jefe inmediato)"
              onSubmitTitle="Seleccionar"
              triggerProps={{
                disabled: !user.hasPrivilege('users:asignManager'),
                icon: field.value ? (
                  <ArrowSyncCircleRegular className="dark:text-blue-500 text-blue-700" />
                ) : (
                  <AddRegular className="dark:text-blue-500 text-blue-700" />
                ),
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
                )
              }}
            />
          </Field>
        )}
      />
    </>
  )
}
