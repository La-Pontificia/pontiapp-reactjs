import {
  Avatar,
  Button,
  Combobox,
  Field,
  Input,
  Option,
  Switch,
  Tooltip
} from '@fluentui/react-components'
import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { FormUserValues } from './form'
import { availableDomains } from '@/const'
import {
  AddRegular,
  ArrowSyncCircleRegular,
  KeyResetRegular,
  WrenchRegular
} from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { UserRole } from '@/types/user-role'
import { api } from '@/lib/api'
import PrivilegesDrawer from '@/components/privileges-drawer'
import UserDrawer from '@/components/user-drawer'
import { useAuth } from '@/store/auth'
import ResetPassword from '@/components/reset-password'
import { useSlugUser } from '../+layout'

export default function AccountForm({
  control
}: {
  control: Control<FormUserValues>
}) {
  const [isResetAlertOpen, setIsResetAlertOpen] = React.useState(false)
  const { user: authUser } = useAuth()
  const { user } = useSlugUser()
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

  if (!user) return null

  return (
    <>
      <ResetPassword
        user={user}
        open={isResetAlertOpen}
        setOpen={setIsResetAlertOpen}
      />

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

      <Field orientation="horizontal" label="Contraseña">
        {authUser.hasPrivilege('users:resetPassword') && (
          <Tooltip content="Restablecer contraseña" relationship="description">
            <Button
              className="!w-full"
              icon={<KeyResetRegular />}
              onClick={() => setIsResetAlertOpen(true)}
            >
              Restablecer contraseña
            </Button>
          </Tooltip>
        )}
      </Field>
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
                c.isDeveloper && !authUser.isDeveloper ? null : (
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
                disabled: !authUser.hasPrivilege('users:asignCustomPrivileges'),
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
                disabled: !authUser.hasPrivilege('users:asignManager'),
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
