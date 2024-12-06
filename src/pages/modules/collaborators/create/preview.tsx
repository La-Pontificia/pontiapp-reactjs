import {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormValues } from './+page'
import {
  Avatar,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle
} from '@fluentui/react-components'
import {
  Copy20Regular,
  Mail20Regular,
  Phone20Regular
} from '@fluentui/react-icons'
import { toast } from '@/commons/toast'
import { format } from '@/lib/dayjs'

export default function PreviewUser({
  watch,
  errors
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<FormValues, any>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
  errors: FieldErrors<FormValues>
}) {
  const {
    photoURL,
    firstNames,
    lastNames,
    displayName,
    username,
    domain,
    role,
    job,
    userRole,
    password,
    birthdate,
    manage,
    contacts,
    customPrivileges,
    entryDate
  } = watch()
  const hasErrors = Object.keys(errors).length > 0

  const mail = `${username}@${domain}`

  const onCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    toast('Copiado al portapapeles')
  }

  const ShowOrHide = ({
    show,
    children
  }: {
    show: boolean
    children: React.ReactNode
  }) => {
    return show ? children : null
  }

  return (
    <div>
      {hasErrors && (
        <MessageBar intent="error">
          <MessageBarBody className="py-1">
            <MessageBarTitle>Hay errores en el formulario</MessageBarTitle>
            <p className="text-xs">
              Por favor, revisa los campos marcados en rojo en las pestañas
              anteriores.
            </p>
          </MessageBarBody>
        </MessageBar>
      )}
      <div className="space-y-4 py-5">
        <h2 className="font-semibold">Básicos</h2>
        <div className="flex items-center gap-4">
          <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
            Correo
          </p>
          <p>
            {mail}{' '}
            <button onClick={() => onCopy(mail)}>
              <Copy20Regular className="text-blue-500" />
            </button>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
            Display Name
          </p>
          <p>{displayName || '-'}</p>
        </div>
        <ShowOrHide show={!!password}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Contraseña
            </p>
            <Input
              readOnly
              type="password"
              value={password}
              contentAfter={
                <button onClick={() => onCopy(password)}>
                  <Copy20Regular className="text-blue-500" />
                </button>
              }
            />
          </div>
        </ShowOrHide>
        <ShowOrHide show={!!userRole}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Rol
            </p>
            <p>{userRole?.title}</p>
          </div>
        </ShowOrHide>
        <ShowOrHide show={!!manage}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Adminstrador (Jefe inmediato)
            </p>
            <p>{manage?.displayName}</p>
          </div>
        </ShowOrHide>
        <ShowOrHide show={!!username}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Nombre de usuario
            </p>
            <p>{username}</p>
          </div>
        </ShowOrHide>
        <ShowOrHide show={customPrivileges?.length > 0}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Privilegios adicionales
            </p>
            <p>{customPrivileges?.length}</p>
          </div>
        </ShowOrHide>

        <h2 className="font-semibold">Propiedades</h2>
        <div className="flex items-center gap-4">
          <Avatar
            size={56}
            image={{
              src: photoURL,
              alt: 'Foto del colaborador'
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
            Nombres
          </p>
          <p>{firstNames || '-'}</p>
        </div>
        <ShowOrHide show={!!lastNames}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Apellidos
            </p>
            <p>{lastNames}</p>
          </div>
        </ShowOrHide>
        <ShowOrHide show={!!birthdate}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Fecha de nacimiento
            </p>
            <p>{format(birthdate, 'DD/MM/YYYY')}</p>
          </div>
        </ShowOrHide>
        <ShowOrHide show={contacts?.length > 0}>
          <div className="flex items-start gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Contactos
            </p>
            <div className="px-2 space-y-3">
              {contacts?.map((contact) => {
                const Icon =
                  contact.type === 'email' ? Mail20Regular : Phone20Regular
                return (
                  <div key={contact.value} className="flex items-center gap-4">
                    <Icon className="text-blue-500" />
                    <p className="text-sm">{contact.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </ShowOrHide>

        <h2 className="font-semibold">Organización</h2>
        <ShowOrHide show={!!job}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Puesto de trabajo
            </p>
            <p>{job?.name}</p>
          </div>
        </ShowOrHide>
        <ShowOrHide show={!!role}>
          <div className="flex items-center gap-4">
            <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
              Puesto de trabajo
            </p>
            <p>{role?.name}</p>
          </div>
        </ShowOrHide>
        <div className="flex items-center gap-4">
          <p className="min-w-[200px] text-nowrap dark:text-neutral-400">
            Fecha de ingreso
          </p>
          <p>{entryDate ? format(entryDate, 'DD/MM/YYYY') : '-'}</p>
        </div>
      </div>
    </div>
  )
}
