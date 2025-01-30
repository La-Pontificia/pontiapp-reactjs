import { Button, Field, Input, Spinner } from '@fluentui/react-components'
import { Eye20Filled, Eye20Regular } from '@fluentui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'anni'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'
import Footer from '~/components/footer'
import { Lp } from '~/icons'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'

type Values = {
  password: string
  confirmPassword: string
}

export default function CreatePasswordPage() {
  const { user: authUser } = useAuth()
  const [searchParams] = useSearchParams()
  const { control, handleSubmit } = useForm<Values>()
  const [showPassword, setShowPassword] = React.useState(false)

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: (password: string) =>
      api.post('auth/create-password', {
        data: JSON.stringify({
          password
        })
      }),
    onError: () => {
      toast.error('Error al crear la contraseña ❌')
    },
    onSuccess: () => {
      toast.success('Contraseña creada con éxito ✅')
      window.location.href = searchParams.get('redirectURL') ?? '/'
    }
  })

  const onSubmit = handleSubmit((data) => {
    create(data.password)
  })
  return (
    <main className="h-svh w-full flex-col flex pt-5 overflow-y-auto bg-[#f5f4f3] dark:bg-[#21201d] text-black dark:text-neutral-100">
      <header className="text-center lg:p-20 p-5 px-5 w-full">
        <Lp
          size={40}
          className="mx-auto text-cyan-600 dark:text-cyan-500 text-dark-700"
        />
        <h2 className="text-3xl pt-5 pb-3">Hola {authUser.displayName}</h2>
        <p className="pt-1 max-w-md opacity-80 mx-auto">
          Parece que es tu primera vez aquí o se ha restablecido tu contraseña.
          Por favor, crea una nueva para continuar con tu cuenta.
        </p>
      </header>
      <form
        onSubmit={onSubmit}
        className="flex flex-col pb-10 flex-grow max-w-xl items-start px-4 mx-auto w-full"
      >
        <div className="flex-grow w-full gap-6 flex flex-col">
          <Controller
            control={control}
            rules={{
              required: 'Este campo es requerido',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres'
              }
            }}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <Field
                required
                validationMessage={
                  error?.message ??
                  'Ingresa una nueva contraseña segura, lo usarás para iniciar sesión la próxima vez.'
                }
                validationState={error?.message ? 'error' : 'none'}
                label="Nueva contraseña"
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  contentAfter={
                    <button
                      type="button"
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
                />
              </Field>
            )}
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
            name="confirmPassword"
            render={({ field, fieldState: { error } }) => (
              <Field
                required
                validationMessage={
                  error?.message ?? 'Confirma tu nueva contraseña'
                }
                validationState={error ? 'error' : 'none'}
                label="Confirmar contraseña"
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  contentAfter={
                    <button
                      type="button"
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
                />
              </Field>
            )}
          />
        </div>
        <div className="flex w-full pt-10 gap-2 justify-between">
          <Button
            onClick={() => {
              window.location.href = searchParams.get('redirectURL') ?? '/'
            }}
          >
            Omitir
          </Button>
          <Button
            disabled={creating}
            icon={creating ? <Spinner size="tiny" /> : undefined}
            appearance="primary"
            type="submit"
          >
            Crear y continuar
          </Button>
        </div>
      </form>
      <Footer />
    </main>
  )
}
