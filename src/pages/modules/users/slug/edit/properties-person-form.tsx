import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Select,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormUserValues } from './form'
import { toast } from 'anni'
import { getPersonByDocumentId } from '~/utils/fetch'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { format } from '~/lib/dayjs'
import { calendarStrings, CONTACT_TYPES } from '~/const'
import {
  AddRegular,
  ContactCardGroupRegular,
  Dismiss24Regular,
  MailRegular,
  PhoneRegular
} from '@fluentui/react-icons'
import { emailRegex, phoneRegex } from '~/const/regex'
import { ContactType } from '~/types/user'
import { api } from '~/lib/api'
import { FaWhatsapp } from 'react-icons/fa'

export default function PropertiesPersonForm({
  control,
  watch,
  setValue
}: {
  control: Control<FormUserValues>
  watch: UseFormWatch<FormUserValues>
  setValue: UseFormSetValue<FormUserValues>
}) {
  const imageRef = React.useRef<HTMLInputElement>(null)
  const [searching, setSearching] = React.useState(false)
  const { contacts } = watch()
  const [openFormContact, setOpenFormContact] = React.useState(false)

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
      toast.error('No se pudo subir la imagen')
      return
    }

    setValue('photoURL', res.data)
  }

  const getPerson = async (documentId: string) => {
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

  return (
    <>
      <UserContacts
        open={openFormContact}
        onSubmit={(c) => setValue('contacts', c)}
        setOpen={setOpenFormContact}
        contacts={contacts}
      />
      <Controller
        control={control}
        name="photoURL"
        render={({ field, fieldState: { error } }) => (
          <Field
            label="Foto de perfil"
            orientation="horizontal"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
          >
            <div className="flex items-center gap-4">
              <Avatar
                size={56}
                image={{
                  src: field.value,
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
              <Button size="small" onClick={() => imageRef.current?.click()}>
                Subir foto
              </Button>
            </div>
          </Field>
        )}
      />
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 8,
            message: 'El documento de identidad debe tener 8 caracteres'
          },
          maxLength: {
            value: 8,
            message: 'El documento de identidad debe tener 8 caracteres'
          }
        }}
        render={({ field, fieldState: { error } }) => (
          <Field
            validationMessage={error?.message}
            label="Documento de identidad"
            orientation="horizontal"
            validationState={error ? 'error' : 'none'}
          >
            <Input
              contentAfter={searching ? <Spinner size="tiny" /> : <></>}
              {...field}
              onChange={(e) => {
                if (e.target.value.length === 8) {
                  getPerson(e.target.value)
                }
                field.onChange(e)
              }}
            />
          </Field>
        )}
        name="documentId"
      />
      <Controller
        name="lastNames"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            orientation="horizontal"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
            label="Apellidos"
          >
            <Input {...field} />
          </Field>
        )}
      />
      <Controller
        control={control}
        name="firstNames"
        render={({ field, fieldState: { error } }) => (
          <Field
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
            orientation="horizontal"
            label="Nombres"
          >
            <Input {...field} />
          </Field>
        )}
      />
      <Controller
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Field
            validationMessage={error?.message}
            orientation="horizontal"
            validationState={error ? 'error' : 'none'}
            label="Fecha de nacimiento"
          >
            <DatePicker
              value={field.value ? new Date(field.value) : null}
              onSelectDate={(date) => {
                field.onChange(date)
              }}
              formatDate={(date) =>
                format(date, '[el] dddd D [de] MMMM [del] YYYY')
              }
              strings={calendarStrings}
              placeholder="Selecciona una fecha"
            />
          </Field>
        )}
        name="birthdate"
      />
      <Controller
        control={control}
        name="contacts"
        render={({ field, fieldState: { error } }) => (
          <Field
            label="Horarios de trabajo"
            orientation="horizontal"
            validationMessage={error?.message}
            validationState={error ? 'error' : 'none'}
          >
            <div>
              <Button
                onClick={() => {
                  setOpenFormContact(true)
                }}
                icon={
                  <ContactCardGroupRegular className="dark:text-blue-500 text-blue-700" />
                }
                className="w-full"
              >
                Editar contactos
              </Button>
              {field.value?.length > 0 && (
                <div className="space-y-1 pt-2">
                  {field.value?.map((contact, key) => {
                    const Icon =
                      contact.type === 'email'
                        ? MailRegular
                        : contact.type === 'phone'
                        ? PhoneRegular
                        : FaWhatsapp
                    return (
                      <div key={key} className="flex items-center gap-2 py-1">
                        <Icon
                          size={20}
                          fontSize={20}
                          className="text-blue-500"
                        />
                        <div className="flex-grow">
                          <p className="text-xs">{contact.value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Field>
        )}
      />
    </>
  )
}

export function UserContacts(props: {
  open: boolean
  setOpen: (open: boolean) => void
  onSubmit: (contacts: ContactType[]) => void
  contacts: ContactType[]
}) {
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
    props.setOpen(false)
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
      <Dialog
        modalType="modal"
        open={props.open}
        onOpenChange={(_, e) => props.setOpen(e.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <Button
                  appearance="subtle"
                  aria-label="Close"
                  icon={<Dismiss24Regular />}
                  onClick={() => props.setOpen(false)}
                />
              }
            >
              Contactos del colaborador
            </DialogTitle>
            <DialogContent className="flex flex-col overflow-y-auto">
              <div className="h-full w-full flex-grow space-y-2">
                {contacts.map((contact, index) => {
                  const errorMessage =
                    error.index === index ? error.message : ''
                  return (
                    <div key={index} className="flex">
                      <Field
                        validationMessage={errorMessage}
                        className="w-full"
                      >
                        <Input
                          value={contact.value}
                          autoFocus
                          contentAfter={
                            <Select
                              appearance="filled-lighter"
                              value={contact.type}
                              onChange={(_, e) =>
                                handleChange(index, 'type', e.value)
                              }
                            >
                              {Object.entries(CONTACT_TYPES).map(
                                ([key, value]) => (
                                  <option key={key} value={key}>
                                    {value}
                                  </option>
                                )
                              )}
                            </Select>
                          }
                          onChange={(e) =>
                            handleChange(index, 'value', e.target.value)
                          }
                        />
                      </Field>

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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmit} appearance="primary">
                Aceptar
              </Button>
              <Button onClick={() => props.setOpen(false)} appearance="outline">
                Cerrar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
