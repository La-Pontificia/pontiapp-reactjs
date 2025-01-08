import {
  Avatar,
  Button,
  Field,
  Input,
  Spinner
} from '@fluentui/react-components'
import { Mail20Regular, Phone20Regular } from '@fluentui/react-icons'
import { toast } from '~/commons/toast'
import { format } from '~/lib/dayjs'
import { useEditUser } from '../+layout'
import { ContactType, User } from '~/types/user'
import { api } from '~/lib/api'
import { Helmet } from 'react-helmet'
import { useAuth } from '~/store/auth'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { calendarStrings } from '~/const'
import { FaWhatsapp } from 'react-icons/fa'
import { handleError } from '~/utils'
import { UserContacts } from '../../create/properties'
import { getPersonByDocumentId } from '~/utils/fetch'
import { useQuery } from '@tanstack/react-query'

type FormValues = {
  documentId: string
  lastNames: string
  firstNames: string
  birthdate?: Date
  contacts: ContactType[]
  photoURL: string
}

export default function UsersEditPropertiesPage() {
  const { user, refetch } = useEditUser()
  const imageRef = React.useRef<HTMLInputElement>(null)
  const [updating, setUpdating] = React.useState(false)
  const { user: authUser } = useAuth()
  const [searching, setSearching] = React.useState(false)

  const { data: properties, isLoading: aditionalIsLoading } =
    useQuery<User | null>({
      queryKey: ['slugAditionUserInfo', 'propertiesEdit', user!.username],
      queryFn: async () => {
        const res = await api.get<User>(
          'users/' + user!.username + '/getPropertiesEdit'
        )
        if (!res.ok) return null
        return new User(res.data)
      }
    })

  const { setValue, control, watch, handleSubmit } = useForm<FormValues>({
    values: {
      birthdate: properties?.birthdate,
      contacts: user?.contacts || [],
      documentId: properties?.documentId || '',
      firstNames: user?.firstNames || '',
      lastNames: user?.lastNames || '',
      photoURL: user?.photoURL || ''
    }
  })

  const handeImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setValue('photoURL', URL.createObjectURL(file))

    const form = new FormData()
    form.append('file', file)
    form.append('path', 'users')

    const res = await api.image<string>('uploads/image', {
      data: form
    })

    if (!res.ok) {
      console.error(res.error)
      setValue('photoURL', '')
      toast('No se pudo subir la imagen', {
        description: res.error
      })
      return
    }

    setValue('photoURL', res.data)
  }

  const { photoURL, contacts, documentId } = watch()

  const onSubmit = handleSubmit(async (values) => {
    setUpdating(true)
    const res = await api.post(`users/${user!.username}/updateProperties`, {
      data: JSON.stringify({
        documentId: values.documentId,
        lastNames: values.lastNames,
        firstNames: values.firstNames,
        birthdate: values.birthdate,
        contacts: values.contacts,
        photoURL: values.photoURL
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      toast('Propiedades actualizadas')
    }
    setUpdating(false)
  })

  React.useEffect(() => {
    const getPerson = async () => {
      setSearching(true)
      try {
        const person = await getPersonByDocumentId(documentId)
        if (!person) return
        setValue('firstNames', person.firstNames)
        setValue('lastNames', person.lastNames)
        setSearching(false)
      } catch (error) {
        console.log(error)
        toast('No se pudo obtener la información del colaborador')
      } finally {
        setSearching(false)
      }
    }
    if (documentId && documentId.length === 8) {
      void getPerson()
    }
  }, [documentId, setValue])

  return (
    <div className="flex flex-col flex-grow h-full px-4 w-full">
      <Helmet>
        <title>
          {user ? user.displayName + ' -' : ''} Editar propiedades | Ponti App
        </title>
      </Helmet>
      <div className="flex flex-grow overflow-y-auto w-full">
        <div className="grid h-fit w-full max-w-xl grid-cols-2 py-4 gap-5">
          <div className="col-span-2">
            <div className="flex items-center gap-4">
              <Avatar
                size={96}
                image={{
                  src: photoURL,
                  alt: 'Foto del colaborador'
                }}
              />
              <input
                disabled={updating || !authUser.hasPrivilege('users:edit')}
                ref={imageRef}
                onChange={handeImageChange}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button
                disabled={updating || !authUser.hasPrivilege('users:edit')}
                onClick={() => imageRef.current?.click()}
              >
                Cargar foto
              </Button>
            </div>
          </div>
          <Controller
            rules={{
              required: 'Este campo es requerido',
              pattern: {
                value: /^[0-9]{8,}$/,
                message:
                  'El documento de identidad debe tener al menos 8 dígitos'
              }
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                validationMessage={error?.message}
                label="Documento de identidad"
                required
              >
                <Input
                  contentAfter={searching ? <Spinner size="tiny" /> : <></>}
                  disabled={
                    updating ||
                    aditionalIsLoading ||
                    !authUser.hasPrivilege('users:edit')
                  }
                  {...field}
                />
              </Field>
            )}
            name="documentId"
          />
          <div className="grid grid-cols-2 gap-4 col-span-2">
            <Controller
              rules={{ required: 'Este campo es requerido' }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  validationMessage={error?.message}
                  label="Apellidos"
                  required
                >
                  <Input
                    disabled={updating || !authUser.hasPrivilege('users:edit')}
                    {...field}
                  />
                </Field>
              )}
              name="lastNames"
            />
            <Controller
              rules={{ required: 'Este campo es requerido' }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  validationMessage={error?.message}
                  label="Nombres"
                  required
                >
                  <Input
                    disabled={updating || !authUser.hasPrivilege('users:edit')}
                    {...field}
                  />
                </Field>
              )}
              name="firstNames"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 col-span-2">
            <Controller
              rules={{ required: 'Este campo es requerido' }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field
                  validationMessage={error?.message}
                  label="Fecha de nacimiento"
                >
                  <DatePicker
                    disabled={
                      updating ||
                      aditionalIsLoading ||
                      !authUser.hasPrivilege('users:edit')
                    }
                    value={field.value ? new Date(field.value) : null}
                    onSelectDate={(date) => {
                      field.onChange(date)
                    }}
                    formatDate={(date) => format(date, 'MMMM D, YYYY')}
                    strings={calendarStrings}
                    placeholder="Selecciona una fecha"
                  />
                </Field>
              )}
              name="birthdate"
            />
          </div>
          <div className="col-span-2 pb-5">
            <h2 className="text-sm border-b pb-3 border-neutral-500/40">
              Contactos
            </h2>
            <div className="space-y-3">
              {contacts?.length > 0 && (
                <div className="pt-4 px-2 space-y-3">
                  {contacts?.map((contact, key) => {
                    const Icon =
                      contact.type === 'email'
                        ? Mail20Regular
                        : contact.type === 'phone'
                        ? Phone20Regular
                        : FaWhatsapp
                    return (
                      <div key={key} className="flex items-center gap-4 py-1">
                        <Icon
                          size={20}
                          fontSize={20}
                          className="text-blue-500"
                        />
                        <div className="flex-grow">
                          <p className="text-sm">{contact.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              <UserContacts
                contacts={contacts}
                onSubmit={(c) => {
                  setValue('contacts', c)
                }}
                triggerProps={{
                  appearance: 'transparent',
                  disabled: updating || !authUser.hasPrivilege('users:edit'),
                  children: (
                    <span className="dark:text-blue-500 text-blue-700">
                      Agregar o editar contactos
                    </span>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t w-full gap-24 flex border-neutral-500/30 p-4">
        <Button
          appearance="primary"
          disabled={updating || !authUser.hasPrivilege('users:edit')}
          icon={updating ? <Spinner size="extra-tiny" /> : null}
          onClick={onSubmit}
        >
          {updating ? 'Actualizando...' : ' Actualizar propiedades'}
        </Button>
      </footer>
    </div>
  )
}
