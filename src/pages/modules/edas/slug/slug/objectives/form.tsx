import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Field,
  Input
} from '@fluentui/react-components'
import { Dismiss24Regular } from '@fluentui/react-icons'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import TextEditor from '~/commons/text-editor'
import { useAuth } from '~/store/auth'
import { EdaObjetive } from '~/types/eda-objetive'
import { SlugCollaboratorEdaSlugContext } from '../+layout'
import { User } from '~/types/user'

type FormValues = {
  title: string
  description: string
  indicators: string
  percentage: number
}

export default function ObjetiveForm({
  open,
  setOpen,
  objetives,
  defaultObjetive,
  onCreate,
  onUpdate,
  disabled
}: {
  open: boolean
  setOpen: (open: boolean) => void
  objetives?: EdaObjetive[]
  defaultObjetive?: EdaObjetive
  onCreate?: (objetive: EdaObjetive) => void
  onUpdate?: (objetive: Partial<EdaObjetive>) => void
  disabled?: boolean
}) {
  const { user: authUser } = useAuth()
  const edactx = React.useContext(SlugCollaboratorEdaSlugContext)
  const { control, handleSubmit, reset } = useForm<FormValues>({
    disabled,
    values: defaultObjetive
      ? {
          title: defaultObjetive.title,
          description: defaultObjetive.description,
          indicators: defaultObjetive.indicators,
          percentage: defaultObjetive.percentage
        }
      : {
          title: '',
          description: '',
          indicators: `<ol>
                    <li></li>
                </ol>`,
          percentage: 0
        }
  })

  const onSubmit = handleSubmit((data) => {
    if (defaultObjetive) {
      onUpdate?.({
        ...defaultObjetive,
        ...data
      })
    } else if (objetives) {
      onCreate?.(
        new EdaObjetive({
          id: crypto.randomUUID(),
          created_at: new Date(),
          updated_at: new Date(),
          creator: authUser,
          description: data.description,
          eda: edactx.eda,
          indicators: data.indicators,
          order: objetives.length + 1,
          percentage: data.percentage,
          title: data.title,
          updater: {} as User
        })
      )
    }

    setOpen(false)
    reset()
  })

  return (
    <>
      <Drawer
        position="end"
        separator
        className="md:min-w-[600px] max-w-full min-w-full"
        open={open}
        onOpenChange={(_, { open }) => {
          if (open === false && !disabled) {
            onSubmit()
          }
          setOpen(open)
        }}
      >
        <DrawerHeader className="border-b !pt-2 !pb-3 border-stone-500/40">
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
            {defaultObjetive ? 'Editar' : 'Agregar'} objetivo
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody className="flex flex-col overflow-y-auto">
          <div className="grid py-4 gap-4">
            <Controller
              rules={{ required: 'Requerido' }}
              name="title"
              control={control}
              render={({ field: { disabled, ...field }, fieldState }) => (
                <Field
                  label="Título"
                  required
                  validationMessage={fieldState.error?.message}
                  validationState={fieldState.error ? 'error' : 'none'}
                >
                  <Input
                    readOnly={disabled}
                    autoFocus
                    placeholder="Ingrese el título del objetivo"
                    {...field}
                  />
                </Field>
              )}
            />
            <Controller
              rules={{ required: 'Requerido' }}
              name="description"
              control={control}
              render={({ field: { disabled, ...field }, fieldState }) => (
                <Field
                  label="Descripción"
                  required
                  validationMessage={fieldState.error?.message}
                  validationState={fieldState.error ? 'error' : 'none'}
                >
                  <TextEditor
                    disabled={disabled}
                    className="min-h-[100px]"
                    placeholder="Ingrese la descripción del objetivo"
                    defaultValue={field.value}
                    onChange={(e) => field.onChange(e)}
                  />
                </Field>
              )}
            />
            <Controller
              rules={{ required: 'Requerido' }}
              name="indicators"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  label="Indicadores"
                  required
                  validationMessage={fieldState.error?.message}
                  validationState={fieldState.error ? 'error' : 'none'}
                >
                  <TextEditor
                    disabled={field.disabled}
                    className="min-h-[200px] max-h-[250px] overflow-y-auto"
                    placeholder="Liste los indicadores del objetivo"
                    defaultValue={field.value}
                    onChange={(e) => field.onChange(e)}
                  />
                </Field>
              )}
            />
            <Controller
              rules={{
                required: 'Requerido',
                min: {
                  value: 1,
                  message: 'El porcentaje debe ser mayor a 0'
                },
                max: {
                  value: 100,
                  message: 'El porcentaje debe ser menor a 100'
                },

                // validate only number
                validate: (value) =>
                  !isNaN(value) || 'El porcentaje debe ser un número'
              }}
              name="percentage"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  label="Porcentaje"
                  required
                  validationMessage={fieldState.error?.message}
                  validationState={fieldState.error ? 'error' : 'none'}
                >
                  <Input
                    readOnly={field.disabled}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(e) => field.onChange(e.target.value)}
                    defaultValue={field.value?.toString()}
                    type="number"
                    placeholder="Ingrese el porcentaje del objetivo"
                  />
                </Field>
              )}
            />
          </div>
        </DrawerBody>
      </Drawer>
    </>
  )
}
