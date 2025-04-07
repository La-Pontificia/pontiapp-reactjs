import { toast } from 'anni'
import UserDrawer from '~/components/user-drawer'
import { api } from '~/lib/api'
import { User } from '~/types/user'
import { UserTeam } from '~/types/user-team'
import { handleError } from '~/utils'
import {
  Avatar,
  Button,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Spinner,
  Textarea
} from '@fluentui/react-components'
import { AddFilled } from '@fluentui/react-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  photoURL: string
  name: string
  description: string
  owners: User[]
  members: User[]
}
export default function TeamForm({
  defaultValue,
  onOpenChange,
  refetch
}: {
  defaultValue?: UserTeam
  onOpenChange: (open: boolean) => void
  refetch: () => void
}) {
  const [submitting, setSubmitting] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const { watch, setValue, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photoURL: defaultValue?.photoURL || '',
      name: defaultValue?.name || '',
      description: defaultValue?.description || '',
      owners: defaultValue?.owners || [],
      members: defaultValue?.members || []
    }
  })
  const { photoURL } = watch()
  const imageRef = React.useRef<HTMLInputElement>(null)

  const handeImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true)
    const file = e.target.files?.[0]
    if (!file) return

    const form = new FormData()
    form.append('file', file)
    form.append('path', 'groups')

    const res = await api.image<string>('uploads/image', {
      data: form
    })

    if (!res.ok) {
      console.error(res.error)
      setValue('photoURL', '')
      toast.error(handleError(res.error))
      setUploading(false)
      return
    }

    setValue('photoURL', res.data)
    setUploading(false)
  }

  const onSubmit = handleSubmit(async (data) => {
    const URI = defaultValue
      ? `partials/teams/${defaultValue.id}`
      : 'partials/teams'
    setSubmitting(true)
    const res = await api.post<UserTeam>(URI, {
      data: JSON.stringify({
        name: data.name,
        description: data.description,
        owners: data.owners.map((u) => ({
          id: u.id
        })),
        members: data.members.map((u) => ({
          id: u.id
        })),
        photoURL: data.photoURL
      })
    })
    if (!res.ok) {
      toast.error(handleError(res.error))
      setSubmitting(false)
      return
    }

    toast(defaultValue ? 'Equipo actualizado' : 'Equipo creado')
    refetch()
    onOpenChange(false)
    setSubmitting(false)
  })

  return (
    <form>
      <DialogBody>
        <DialogTitle>
          {defaultValue ? 'Editar equipo' : 'Crear equipo'}
        </DialogTitle>
        <DialogContent className="space-y-4">
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
              <Button
                disabled={uploading}
                icon={uploading ? <Spinner size="tiny" /> : undefined}
                onClick={() => imageRef.current?.click()}
              >
                {uploading
                  ? 'Subiendo foto'
                  : defaultValue
                  ? 'Cambiar foto'
                  : 'Subir foto'}
              </Button>
            </div>
          </div>
          <Controller
            rules={{
              required: 'Agrega un nombre al equipo'
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                required
                validationMessage={error?.message}
                label="Nombre del equipo"
              >
                <Input {...field} />
              </Field>
            )}
            name="name"
          />
          <Controller
            rules={{
              required: 'Agrega una descripción'
            }}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Field
                required
                validationMessage={error?.message}
                label="Descripción"
              >
                <Textarea rows={6} {...field} />
              </Field>
            )}
            name="description"
          />

          {!defaultValue && (
            <>
              <Controller
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationMessage={error?.message}
                    label="Seleccionar propietarios del equipo"
                  >
                    <UserDrawer
                      onSubmit={(users) => field.onChange(users)}
                      max={10}
                      includeCurrentUser
                      users={field.value}
                      onSubmitTitle="Seleccionar"
                      triggerProps={{
                        appearance: 'transparent',
                        style: {
                          padding: 0,
                          justifyContent: 'start'
                        },
                        icon: (
                          <AddFilled
                            fontSize={18}
                            className="dark:text-blue-500"
                          />
                        ),
                        children: (
                          <span className="dark:text-blue-500">
                            {field.value.length > 0
                              ? `${field.value.length} propietarios seleccionados`
                              : '0 propietarios seleccionados'}
                          </span>
                        ),
                        className: 'w-[250px]'
                      }}
                      title="Agregar propietarios del equipo"
                    />
                  </Field>
                )}
                name="owners"
              />
              <Controller
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    validationMessage={error?.message}
                    label="Seleccionar miembros del equipo"
                  >
                    <UserDrawer
                      onSubmit={(users) => field.onChange(users)}
                      max={400}
                      includeCurrentUser
                      users={field.value}
                      onSubmitTitle="Seleccionar"
                      triggerProps={{
                        appearance: 'transparent',
                        style: {
                          padding: 0,
                          justifyContent: 'start'
                        },
                        icon: (
                          <AddFilled
                            fontSize={18}
                            className="dark:text-blue-500"
                          />
                        ),
                        children: (
                          <span className="dark:text-blue-500">
                            {field.value.length > 0
                              ? `${field.value.length} miembros seleccionados`
                              : '0 miembros seleccionados'}
                          </span>
                        ),
                        className: 'w-[250px]'
                      }}
                      title="Seleccionar miembros al equipo"
                    />
                  </Field>
                )}
                name="members"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="secondary">Cerrar</Button>
          </DialogTrigger>
          <Button
            disabled={submitting}
            icon={submitting ? <Spinner size="tiny" /> : undefined}
            onClick={onSubmit}
            type="submit"
            appearance="primary"
          >
            {defaultValue ? 'Guardar cambios' : 'Crear equipo'}
          </Button>
        </DialogActions>
      </DialogBody>
    </form>
  )
}
