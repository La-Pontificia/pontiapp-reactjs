import { toast } from 'anni'
import PrivilegesDrawer from '~/components/privileges-drawer'
import { api } from '~/lib/api'
import { UserRole } from '~/types/user-role'
import { handleError } from '~/utils'
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  title: string
  level?: string
  privileges: string[]
}
export default function Form({
  defaultValues,
  triggerProps,
  refetch
}: {
  defaultValues?: UserRole
  triggerProps: ButtonProps
  refetch: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    values: {
      title: defaultValues?.title || '',
      level: defaultValues?.level.toString() || '',
      privileges: defaultValues?.privileges || []
    }
  })

  const { privileges } = watch()

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    const URI = defaultValues
      ? `partials/user-roles/${defaultValues?.id}`
      : `partials/user-roles`

    const res = await api.post(URI, {
      data: JSON.stringify({
        title: values.title,
        level: values.level,
        privileges: values.privileges
      })
    })

    if (!res.ok) {
      toast(handleError(res.error))
    } else {
      refetch()
      setOpen(false)
      reset()
      toast(
        defaultValues
          ? 'Rol actualizado correctamente'
          : 'Rol registrado correctamente'
      )
    }

    setSubmitting(false)
  })

  return (
    <>
      <Button onClick={() => setOpen(true)} {...triggerProps} />
      {open && (
        <Dialog
          open={open}
          onOpenChange={(_, e) => setOpen(e.open)}
          modalType="modal"
        >
          <DialogTrigger disableButtonEnhancement></DialogTrigger>
          <DialogSurface aria-describedby={undefined}>
            <DialogBody>
              <DialogTitle>
                {defaultValues ? 'Editar cargo' : 'Registrar cargo'}
              </DialogTitle>
              <DialogContent className="space-y-4">
                <div className="grid gap-4">
                  <Controller
                    control={control}
                    name="title"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Titulo del rol"
                        required
                      >
                        <Input {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="level"
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field, fieldState }) => (
                      <Field
                        validationMessage={fieldState.error?.message}
                        label="Nivel del rol"
                        required
                      >
                        <Input type="number" {...field} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={control}
                    name="privileges"
                    render={({ field, fieldState }) => (
                      <Field
                        label="Privilegios"
                        required
                        validationMessage={fieldState.error?.message}
                      >
                        <PrivilegesDrawer
                          onSubmit={(p) => field.onChange(p)}
                          title="Seleccionar privilegios"
                          asignedPrivileges={field.value}
                          onSubmitTitle="Seleccionar"
                          triggerProps={{
                            appearance: 'outline',
                            children:
                              privileges && privileges?.length > 0 ? (
                                <>{privileges?.length} Privilegios</>
                              ) : (
                                'Añadir'
                              )
                          }}
                        />
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
                  disabled={submitting}
                  icon={submitting ? <Spinner size="tiny" /> : undefined}
                  onClick={onSubmit}
                  type="submit"
                  appearance="primary"
                >
                  {defaultValues ? 'Guardar cambios' : 'Registrar'}
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  )
}
