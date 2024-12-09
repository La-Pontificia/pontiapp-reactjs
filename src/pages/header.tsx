import { toast } from '@/commons/toast'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { useUi } from '@/store/ui'
import { User } from '@/types/user'
import { handleError } from '@/utils'
import {
  Avatar,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SearchBox,
  Tooltip,
  Text,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogTrigger,
  Button,
  Spinner,
  Field,
  Input
} from '@fluentui/react-components'
import {
  ArrowMaximizeRegular,
  ArrowMinimizeRegular,
  CameraRegular,
  PanelLeftContractRegular,
  PanelLeftExpandFilled,
  Person20Regular,
  Person48Regular,
  PersonFeedback20Regular,
  PersonPasskeyRegular,
  Search20Regular,
  Settings20Regular,
  SignOutRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router'

const Toggles = () => {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const isSidebarOpen = useUi((s) => s.isSidebarOpen)

  const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  const locaction = useLocation()

  const isHome = locaction.pathname === '/'

  return (
    <div className="flex items-center">
      {!isHome && (
        <Tooltip
          content={
            isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'
          }
          relationship="label"
        >
          <button
            onClick={toggleSidebar}
            className="p-2 px-2.5 dark:text-stone-400 hover:bg-stone-500/20 transition-all rounded-lg"
          >
            {isSidebarOpen ? (
              <PanelLeftContractRegular fontSize={25} />
            ) : (
              <PanelLeftExpandFilled
                className="dark:text-blue-500"
                fontSize={25}
              />
            )}
          </button>
        </Tooltip>
      )}
      <Tooltip
        content={
          isModuleMaximized ? 'Restaurar tamaño' : 'Maximizar módulo actual'
        }
        relationship="label"
      >
        <button
          onClick={toggleModuleMaximized}
          className="p-2 px-2.5 dark:text-stone-400 hover:bg-stone-500/20 transition-all rounded-lg"
        >
          {isModuleMaximized ? (
            <ArrowMinimizeRegular
              className="dark:text-blue-500"
              fontSize={20}
            />
          ) : (
            <ArrowMaximizeRegular fontSize={20} />
          )}
        </button>
      </Tooltip>
    </div>
  )
}

export default function RootHeader() {
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

    const res = await api.image<string>('auth/changeProfile', {
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
    <header className="h-14 min-h-[56px] border-b border-stone-500/20 dark:text-blue-500 shadow-md shadow-black/20 justify-between gap-4 dark:bg-[#131210]/30 text-blue-600 w-full z-20 flex items-center px-2">
      <nav className="flex flex-grow gap-2 items-center basis-0">
        <Toggles />
        <Link to="/" className="flex items-center gap-1">
          <img src="/_lp-only-logo.webp" className="" width={25} alt="" />
          <img
            src="/_lp_only-letters.webp"
            className="dark:invert grayscale"
            width={70}
            alt='Logo Lettras "La Pontificia"'
          />
        </Link>
        <h1 className="font-semibold text-base hidden md:block">Ponti App</h1>
      </nav>
      <nav className="relative">
        <div className="hidden lg:block">
          <SearchBox
            appearance="filled-lighter-shadow"
            type="search"
            autoComplete="off"
            placeholder="Buscar"
            className="w-[500px]"
            style={{
              borderRadius: '7px',
              height: '35px'
            }}
            contentBefore={<Search20Regular className="text-blue-500" />}
            size="medium"
          />
        </div>
      </nav>
      <nav className="flex flex-grow basis-0 gap-5 justify-end">
        <Tooltip content="Buscar" relationship="label">
          <button className="block lg:hidden">
            <Search20Regular
              style={{
                width: '22px',
                height: '22px'
              }}
            />
          </button>
        </Tooltip>
        <Tooltip content="Ajustes" relationship="label">
          <button>
            <Settings20Regular
              style={{
                width: '22px',
                height: '22px'
              }}
            />
          </button>
        </Tooltip>
        <Tooltip content="Envia un error o sugerencia" relationship="label">
          <button>
            <PersonFeedback20Regular
              style={{
                width: '23px',
                height: '23px'
              }}
            />
          </button>
        </Tooltip>
        <Popover>
          <PopoverTrigger disableButtonEnhancement>
            <Tooltip content="David Bendezu" relationship="label">
              <button>
                <Avatar
                  icon={<Person20Regular />}
                  image={{
                    src: user.photoURL
                  }}
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
            <div className="overflow-hidden min-w-[360px]">
              <header className="flex justify-between items-center">
                <Text
                  as="h1"
                  weight="semibold"
                  size={300}
                  className="text-center dark:text-blue-600 px-3"
                >
                  Ponti App
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
                    className="absolute group-hover:opacity-100 transition-all opacity-0 rounded-full inset-0 z-[1] bg-stone-500/50 grid place-content-center"
                  >
                    <CameraRegular fontSize={30} />
                  </button>
                  <Avatar
                    icon={<Person48Regular />}
                    image={{
                      src: user.photoURL
                    }}
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
                    className="text-blue-500 hover:underline"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>
              <div className="border-t divide-y divide-stone-500/30 border-stone-500/30">
                <ChangePassword />
                <button
                  onClick={signOut}
                  className="flex items-center gap-3 p-2 hover:bg-stone-500/20 w-full"
                >
                  <div className="rounded-full p-2 border border-stone-500/40 bg-stone-500/20">
                    <SignOutRegular fontSize={20} />
                  </div>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </PopoverSurface>
        </Popover>
      </nav>
    </header>
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
        className="flex items-center gap-3 p-2 hover:bg-stone-500/20 w-full"
      >
        <div className="rounded-full p-2 border border-stone-500/40 bg-stone-500/20">
          <PersonPasskeyRegular fontSize={20} />
        </div>
        Cambiar contraseña
      </button>
      {openDialog && (
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
      )}
    </>
  )
}
