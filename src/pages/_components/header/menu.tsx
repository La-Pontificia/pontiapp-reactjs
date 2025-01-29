import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip
} from '@fluentui/react-components'
import {
  CameraRegular,
  PersonPasskeyRegular,
  SignOutRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'anni'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { User } from '~/types/user'
import { handleError } from '~/utils'

export default function UserMenu() {
  const { user, signOut, setUser } = useAuth()
  const imageRef = React.useRef<HTMLInputElement>(null)
  const [changing, setChanging] = React.useState(false)

  const handeImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setChanging(true)
    const form = new FormData()
    form.append('file', file)
    form.append('path', 'users')

    const res = await api.image<string>('auth/update-profile-photo', {
      data: form
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      setUser((prev) => new User({ ...prev, photoURL: res.data } as User))
    }
    setChanging(false)
  }
  return (
    <>
      <Popover>
        <PopoverTrigger disableButtonEnhancement>
          <Tooltip content="David Bendezu" relationship="label">
            <button className="text-right flex items-center gap-2 dark:text-white text-black">
              <Avatar
                image={{
                  src: user.photoURL
                }}
                name={user.displayName}
                size={36}
              />
            </button>
          </Tooltip>
        </PopoverTrigger>
        <PopoverSurface
          tabIndex={-1}
          style={{
            padding: 0,
            borderRadius: '15px',
            overflow: 'hidden'
          }}
        >
          <div className="overflow-hidden min-w-[320px]">
            <header className="flex justify-between items-center">
              <Text
                as="h1"
                weight="semibold"
                size={300}
                className="text-center dark:text-blue-400 text-[#0e37cd] px-3"
              >
                PontiApp
              </Text>
              <button
                onClick={signOut}
                className="hover:bg-stone-500/10 px-5 h-full p-3"
              >
                Salir
              </button>
            </header>
            <div className="flex p-4 gap-3 ">
              <div
                data-changing={changing ? '' : undefined}
                className="relative group data-[changing]:pointer-events-none"
              >
                {changing && (
                  <div className="bg-black/50 grid rounded-full place-content-center z-[2] absolute inset-0">
                    <Spinner size="medium" />
                  </div>
                )}
                <input
                  ref={imageRef}
                  onChange={handeImageChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => imageRef.current?.click()}
                  className="absolute group-hover:opacity-100  opacity-0 rounded-full inset-0 z-[1] bg-stone-500/50 grid place-content-center"
                >
                  <CameraRegular fontSize={30} />
                </button>
                <Avatar
                  image={{
                    src: user.photoURL
                  }}
                  name={user.displayName}
                  size={96}
                />
              </div>
              <div className="">
                <h1 className="font-bold text-lg line-clamp-1">
                  {user.displayName}
                </h1>
                <p className="text-ellipsis dark:text-neutral-300">
                  {user.email}
                </p>
                <Link
                  to={`/${user.username}`}
                  className="dark:text-blue-400 text-[#0e37cd] hover:underline"
                >
                  Ver perfil
                </Link>
              </div>
            </div>
            <div className="border-t p-2 space-y-2 border-stone-500/30">
              <ChangePassword />
              <button
                onClick={signOut}
                className="flex items-center gap-1 dark:text-blue-400 text-[#0e37cd] font-semibold hover:underline w-full"
              >
                <SignOutRegular fontSize={20} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </PopoverSurface>
      </Popover>
    </>
  )
}

export const ChangePassword = () => {
  const [openDialog, setOpenDialog] = React.useState(false)
  const [changing, setChanging] = React.useState(false)

  const { control, handleSubmit, watch, reset } = useForm<{
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }>()

  const onSubmit = handleSubmit(async (values) => {
    setChanging(true)

    const res = await api.post('auth/changePassword', {
      data: JSON.stringify({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      reset()
      toast('Contraseña cambiada correctamente')
      setOpenDialog(false)
    }

    setChanging(false)
  })
  return (
    <>
      <button
        onClick={() => setOpenDialog(true)}
        className="flex items-center gap-1 dark:text-blue-400 text-[#0e37cd] font-semibold hover:underline w-full"
      >
        <PersonPasskeyRegular fontSize={18} />
        Cambiar contraseña
      </button>
      <Dialog
        open={openDialog}
        onOpenChange={(_, e) => setOpenDialog(e.open)}
        modalType="modal"
      >
        <DialogSurface aria-describedby={undefined}>
          <DialogBody>
            <DialogTitle>Cambiar contraseña.</DialogTitle>
            <DialogContent className="space-y-4">
              <div className="grid gap-4">
                <Controller
                  control={control}
                  name="oldPassword"
                  rules={{ required: 'Este campo es requerido' }}
                  render={({ field, fieldState }) => (
                    <Field
                      validationMessage={fieldState.error?.message}
                      label="Ingrese su contraseña actual"
                      required
                    >
                      <Input autoComplete="off" type="password" {...field} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="newPassword"
                  rules={{
                    required: 'Este campo es requerido',
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                      message:
                        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <Field
                      validationMessage={fieldState.error?.message}
                      label="Ingrese su nueva contraseña"
                      required
                    >
                      <Input autoComplete="nope" type="password" {...field} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: 'Este campo es requerido',
                    validate: (value) =>
                      value === watch('newPassword') ||
                      'Las contraseñas no coinciden'
                  }}
                  render={({ field, fieldState }) => (
                    <Field
                      validationMessage={fieldState.error?.message}
                      label="Confirme su nueva contraseña"
                      required
                    >
                      <Input autoComplete="nope" type="password" {...field} />
                    </Field>
                  )}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cerrar</Button>
              </DialogTrigger>
              <Button
                disabled={changing}
                icon={changing ? <Spinner size="tiny" /> : undefined}
                onClick={onSubmit}
                type="submit"
                appearance="primary"
              >
                <span className="text-nowrap">Cambiar contraseña</span>
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
