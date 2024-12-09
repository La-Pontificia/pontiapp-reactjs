/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input,
  Select
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormValues } from './+page'
import * as React from 'react'
import { format } from '@/lib/dayjs'
import { calendarStrings, CONTACT_TYPES } from '@/const'
import {
  AddRegular,
  Dismiss24Regular,
  Mail20Regular,
  Phone20Regular
} from '@fluentui/react-icons'
import { ContactType } from '@/types/user'
import { toast } from '@/commons/toast'
import { api } from '@/lib/api'
import { FaWhatsapp } from 'react-icons/fa'
import { emailRegex, phoneRegex } from '@/const/regex'

export default function PropertiesUser({
  control,
  watch,
  setValue
}: {
  control: Control<FormValues, any>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
}) {
  const { photoURL, contacts } = watch()
  const imageRef = React.useRef<HTMLInputElement>(null)

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

  return (
    <div className="grid grid-cols-2 gap-5">
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
            ref={imageRef}
            onChange={handeImageChange}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <Button onClick={() => imageRef.current?.click()}>Subir foto</Button>
        </div>
      </div>
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            validationMessage={error?.message}
            label="Documento de identidad"
            required
          >
            <Input {...field} />
          </Field>
        )}
        name="documentId"
      />
      <div className="grid grid-cols-2 gap-4 col-span-2">
        <Controller
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Field
              validationMessage={error?.message}
              label="Apellidos"
              required
            >
              <Input {...field} />
            </Field>
          )}
          name="lastNames"
        />
        <Controller
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Field validationMessage={error?.message} label="Nombres" required>
              <Input {...field} />
            </Field>
          )}
          name="firstNames"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 col-span-2">
        <Controller
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Field
              validationMessage={error?.message}
              label="Fecha de nacimiento"
            >
              <DatePicker
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
      <div className="col-span-2">
        <h2 className="text-sm border-b pb-3 border-stone-500/40">Contacto</h2>
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
                    <Icon size={20} fontSize={20} className="text-blue-500" />
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
              children: (
                <span className="dark:text-blue-500">
                  Agregar o editar contactos
                </span>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function UserContacts(props: {
  contacts: ContactType[]
  onSubmit: (contacts: ContactType[]) => void
  triggerProps: ButtonProps
}) {
  const [open, setOpen] = React.useState(false)
  const [contacts, setContacts] = React.useState<ContactType[]>(props.contacts)

  const [error, setError] = React.useState<{
    index: number | null
    message: string
  }>({
    index: null,
    message: ''
  })

  const handleSubmit = () => {
    let isValid = true

    contacts.forEach((contact) => {
      if (contact.type === 'email' && !emailRegex.test(contact.value)) {
        setError({
          index: contacts.findIndex((c) => c.value === contact.value),
          message: 'El correo no es válido'
        })
        isValid = false
        return
      }
      if (contact.type === 'phone' && !phoneRegex.test(contact.value)) {
        setError({
          index: contacts.findIndex((c) => c.value === contact.value),
          message: 'El teléfono no es válido'
        })
        isValid = false
        return
      }
      if (contact.type === 'whatsapp' && !phoneRegex.test(contact.value)) {
        setError({
          index: contacts.findIndex((c) => c.value === contact.value),
          message: 'El teléfono no es válido'
        })
        isValid = false
        return
      }
    })

    if (!isValid) return

    props.onSubmit(contacts)
    setOpen(false)
  }

  const handleChange = (index: number, key: string, value: string) => {
    setError({ index: null, message: '' })
    setContacts((contacts) =>
      contacts.map((contact, i) =>
        i === index ? { ...contact, [key]: value } : contact
      )
    )
  }

  const handleRemove = (index: number) => {
    setError({ index: null, message: '' })
    setContacts((contacts) => contacts.filter((_, i) => i !== index))
  }

  return (
    <>
      <Button {...props.triggerProps} onClick={() => setOpen(true)} />
      {open && (
        <Drawer
          position="end"
          separator
          className="xl:min-w-[35svw] lg:min-w-[80svw] max-w-full min-w-full"
          open={open}
          onOpenChange={(_, { open }) => setOpen(open)}
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => setOpen(false)}
                />
              }
            >
              Contactos del colaborador
            </DrawerHeaderTitle>
          </DrawerHeader>

          <DrawerBody className="flex flex-col overflow-y-auto">
            <div className="h-full flex-grow space-y-3">
              {contacts.map((contact, index) => {
                const errorMessage = error.index === index ? error.message : ''
                return (
                  <div key={index} className="flex gap-4">
                    <Field validationMessage={errorMessage} className="w-full">
                      <Input
                        value={contact.value}
                        autoFocus
                        onChange={(e) =>
                          handleChange(index, 'value', e.target.value)
                        }
                      />
                    </Field>
                    <Select
                      value={contact.type}
                      onChange={(_, e) => handleChange(index, 'type', e.value)}
                    >
                      {Object.entries(CONTACT_TYPES).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </Select>
                    <button onClick={() => handleRemove(index)}>
                      <AddRegular className="rotate-45" />
                    </button>
                  </div>
                )
              })}
              <div className="pt-5">
                <Button
                  onClick={() =>
                    setContacts((contacts) => [
                      ...contacts,
                      { type: 'email', value: '' }
                    ])
                  }
                  appearance="primary"
                >
                  <AddRegular />
                  Agregar contacto
                </Button>
              </div>
            </div>
            <footer className="border-t py-4 flex gap-3 border-stone-500">
              <Button onClick={handleSubmit} appearance="primary">
                Aceptar
              </Button>
              <Button onClick={() => setOpen(false)} appearance="outline">
                Cerrar
              </Button>
            </footer>
          </DrawerBody>
        </Drawer>
      )}
    </>
  )
}
