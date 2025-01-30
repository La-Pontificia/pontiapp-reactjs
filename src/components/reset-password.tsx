import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Persona,
  Spinner
} from '@fluentui/react-components'
import { Eye20Filled, Eye20Regular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { api } from '~/lib/api'
import { User } from '~/types/user'
import { generateRandomPassword } from '~/utils'

type Values = {
  password: string
  requiredFirstLogin: boolean
}
export default function ResetPassword({
  open,
  setOpen,
  user
}: {
  open: boolean
  setOpen: (open: boolean) => void
  user: User
}) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [autoGeneratePassword, setAutoGeneratePassword] = React.useState(false)

  const { control, handleSubmit, setValue, reset } = useForm<Values>({
    defaultValues: {
      password: '',
      requiredFirstLogin: true
    }
  })

  const { mutate: resetPassword, isPending: reseting } = useMutation({
    mutationFn: (password: string) =>
      api.post<string>(`users/${user.id}/reset-password`, {
        data: JSON.stringify({
          password,
          requiredFirstLogin: true
        }),
        alreadyHandleError: false
      }),
    onError: () => {
      toast.error('Error al restablecer la contraseña ❌')
    },
    onSuccess: () => {
      toast.success('Contraseña restablecida con éxito ✅')
      reset()
      setShowPassword(false)
      setAutoGeneratePassword(false)
      setOpen(false)
    }
  })

  const handleResetPassword = handleSubmit((values) => {
    resetPassword(values.password)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(_, e) => setOpen(e.open)}
      modalType="modal"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <DialogContent>
            <div className="py-2">
              <Persona
                avatar={{
                  image: {
                    src: user.photoURL
                  }
                }}
                name={user.displayName}
                secondaryText={user.email}
              />
            </div>
            <div className="grid pt-3 gap-2">
              <Checkbox
                onChange={(_, d) => {
                  setAutoGeneratePassword(d.checked ? true : false)
                  setValue(
                    'password',
                    d.checked ? generateRandomPassword() : ''
                  )
                }}
                checked={autoGeneratePassword}
                label="Auto-generar contraseña"
              />
              <Controller
                control={control}
                name="password"
                rules={{ required: 'Requerido' }}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    label="Contraseña"
                    required
                    className="pl-9"
                    validationMessage={error?.message}
                    validationState={error ? 'error' : 'none'}
                  >
                    <Input
                      input={{
                        autoComplete: 'none'
                      }}
                      readOnly={autoGeneratePassword}
                      type={showPassword ? 'text' : 'password'}
                      contentAfter={
                        <button
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <Eye20Filled className="text-blue-500" />
                          ) : (
                            <Eye20Regular className="text-blue-500" />
                          )}
                        </button>
                      }
                      {...field}
                      value={field.value}
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="requiredFirstLogin"
                rules={{ required: 'Requerido' }}
                render={({ field }) => (
                  <Checkbox
                    onChange={(_, d) => {
                      field.onChange(d.checked)
                    }}
                    checked={field.value}
                    label="Requerir cambio de contraseña en el primer inicio de sesión"
                  />
                )}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancelar</Button>
            </DialogTrigger>
            <Button
              onClick={handleResetPassword}
              disabled={reseting}
              icon={reseting ? <Spinner size="tiny" /> : undefined}
              appearance="primary"
            >
              Restablecer
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
