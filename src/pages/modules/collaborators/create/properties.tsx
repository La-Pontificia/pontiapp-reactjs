/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Button,
  Field,
  Input,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Select
} from '@fluentui/react-components'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import {
  Control,
  Controller,
  useForm,
  UseFormSetValue,
  UseFormWatch
} from 'react-hook-form'
import { FormValues } from './+page'
import * as React from 'react'
import { format } from '@/lib/dayjs'
import { calendarStrings, CONTACT_TYPES } from '@/const'
import {
  Add20Filled,
  Mail20Regular,
  Phone20Regular
} from '@fluentui/react-icons'
import { ContactType } from '@/types/user'
import { toast } from '@/commons/toast'
import { api } from '@/lib/api'

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
        <div className="pt-2">
          <FormContact setValue={setValue} contacts={contacts} />
          {contacts?.length > 0 && (
            <div className="pt-4 px-2 space-y-3">
              {contacts?.map((contact) => {
                const Icon =
                  contact.type === 'email' ? Mail20Regular : Phone20Regular
                return (
                  <div key={contact.value} className="flex items-center gap-4">
                    <Icon className="text-blue-500" />
                    <div className="flex-grow">
                      <p className="text-sm">{contact.value}</p>
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          setValue(
                            'contacts',
                            contacts.filter((c) => c.value !== contact.value)
                          )
                        }}
                        appearance="transparent"
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FormContact({
  setValue,
  contacts = []
}: {
  setValue: UseFormSetValue<FormValues>
  contacts: ContactType[]
}) {
  const [open, setOpen] = React.useState(false)
  const { control, handleSubmit, reset } = useForm<ContactType>({
    defaultValues: {
      type: 'email',
      value: ''
    }
  })

  const onSubmit = handleSubmit((data) => {
    setValue('contacts', contacts.concat(data))
    reset()
    setOpen(false)
  })

  return (
    <Popover open={open} onOpenChange={(_, e) => setOpen(e.open)}>
      <PopoverTrigger disableButtonEnhancement>
        <Button appearance="subtle" className="gap-2">
          <Add20Filled className="text-blue-500" />
          Agregar nuevo
        </Button>
      </PopoverTrigger>
      <PopoverSurface className="w-[450px] max-w-[450px]">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <Controller
              control={control}
              rules={{
                required: 'Ingresa un correo electrónico o número de teléfono'
              }}
              render={({ field, fieldState: { error } }) => (
                <Field
                  className="w-full"
                  validationMessage={error?.message}
                  label="Correo o número de teléfono"
                  required
                >
                  <Input {...field} />
                </Field>
              )}
              name="value"
            />
            <Controller
              rules={{
                required: 'Selecciona un tipo de contacto'
              }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Field validationMessage={error?.message} label="Tipo">
                  <Select
                    {...field}
                    key={field.value}
                    value={field.value}
                    onChange={(_, e) => field.onChange(e.value)}
                  >
                    {Object.entries(CONTACT_TYPES).map(([key, value]) => (
                      <option value={key}>{value}</option>
                    ))}
                  </Select>
                </Field>
              )}
              name="type"
            />
          </div>
          <Button onClick={onSubmit} appearance="primary">
            Agregar
          </Button>
        </div>
      </PopoverSurface>
    </Popover>
  )
}
