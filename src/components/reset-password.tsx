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
import { CopyRegular, Eye20Filled, Eye20Regular } from '@fluentui/react-icons'
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
  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [autoGeneratePassword, setAutoGeneratePassword] = React.useState(false)

  const { control, handleSubmit, setValue, reset, watch } = useForm<Values>({
    values: {
      password: '',
      requiredFirstLogin: true
    },
    reValidateMode: 'onChange'
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
      setShowPassword(false)
      setAutoGeneratePassword(false)
      setOpen(false)
      setOpenSuccess(true)
    }
  })

  const handleResetPassword = handleSubmit((values) => {
    resetPassword(values.password)
  })

  const { password } = watch()

  return (
    <>
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
                      {open && (
                        <Input
                          {...field}
                          input={{
                            autoComplete: 'off'
                          }}
                          aria-hidden
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
                        />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={control}
                  name="requiredFirstLogin"
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
      <Dialog
        open={openSuccess}
        onOpenChange={(_, e) => setOpenSuccess(e.open)}
        modalType="modal"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Contraseña restablecida correctamente</DialogTitle>
            <DialogContent>
              <div className="grid pt-5 gap-2">
                <Field label="Usuario:" required>
                  <p className="font-semibold">{user.email}</p>
                </Field>
                <Field label="Nueva contraseña:" required>
                  <p className="font-semibold">{password}</p>
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cerrar</Button>
              </DialogTrigger>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(password)
                  toast.success('Contraseña copiada al portapapeles ✅')
                  setOpenSuccess(false)
                  reset()
                }}
                appearance="secondary"
                icon={<CopyRegular />}
              >
                <p className="text-nowrap">Copiar contraseña</p>
              </Button>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary">Aceptar</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
