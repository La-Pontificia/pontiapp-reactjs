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
  Spinner,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerList,
  TagPickerOption
} from '@fluentui/react-components'
import { PeopleSyncRegular } from '@fluentui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'anni'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { AssistTerminal } from '@/types/assist-terminal'
import { handleError } from '@/utils'

export default function ToolsPage() {
  const { control, handleSubmit, reset } = useForm<{
    terminal: AssistTerminal | null
  }>({
    defaultValues: {
      terminal: null
    }
  })

  const [openDelete, setOpenDelete] = React.useState(false)

  const { mutate: handleSync, isPending } = useMutation({
    mutationFn: (terminalId: string) =>
      api.post(`tools/synchronize/${terminalId}`, {
        alreadyHandleError: false
      }),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast('Datos sincronizados correctamente.')
      setOpenDelete(false)
      reset()
    }
  })

  const { data: terminals, isLoading } = useQuery<AssistTerminal[]>({
    queryKey: ['partials/assist-terminals'],
    queryFn: async () => {
      const res = await api.get<AssistTerminal[]>(
        'partials/assist-terminals/all'
      )
      if (!res.ok) return []
      return res.data.map((i) => new AssistTerminal(i))
    }
  })

  const onSumit = handleSubmit(async ({ terminal }) => {
    handleSync(terminal!.id)
  })

  return (
    <div className="flex w-full px-3 flex-col overflow-y-auto h-full">
      <nav className="pb-3 pt-4 flex flex-wrap w-full border-b border-neutral-500/30 items-center gap-4">
        <h2 className="font-semibold text-xl pr-2">
          Herramientas de asistencias
        </h2>
      </nav>
      <div className="py-5">
        <div className="flex  items-center gap-2">
          <p className="grow">
            Sincronizar empleados con los usuarios del sistema.
          </p>
          <Button
            appearance="primary"
            icon={<PeopleSyncRegular />}
            onClick={() => setOpenDelete(true)}
          >
            Sinconizar
          </Button>
        </div>
      </div>

      <Dialog
        open={openDelete}
        onOpenChange={(_, e) => setOpenDelete(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Selecciona un terminal</DialogTitle>
            <DialogContent>
              <p className="text-xs pb-2 opacity-70">
                Esta herramienta sincroniza todos los usuarios del terminal
                seccionado con los datos de los usuarios del sistema registrados
                en la base de datos.
              </p>
              <Controller
                control={control}
                name="terminal"
                rules={{ required: 'Requerido' }}
                render={({ field, fieldState: { error } }) => (
                  <Field
                    label="Terminal biométrico"
                    required
                    validationMessage={
                      error?.message ?? 'Seleciona un terminal'
                    }
                    validationState={error?.message ? 'error' : 'none'}
                  >
                    <TagPicker
                      disabled={isPending || isLoading}
                      onOptionSelect={(_, data) => {
                        field.onChange(
                          terminals?.find((t) => t.id === data.value)
                        )
                      }}
                      selectedOptions={field.value ? [field.value.id] : []}
                    >
                      <TagPickerControl
                        style={{
                          gap: 4,
                          padding: field.value ? 5 : undefined
                        }}
                      >
                        {field.value && (
                          <Tag
                            disabled={isPending || isLoading}
                            shape="circular"
                            media={
                              <Avatar
                                aria-hidden
                                name={field.value.name}
                                color="colorful"
                              />
                            }
                            value={field.value.id}
                          >
                            {field.value.name}
                          </Tag>
                        )}
                      </TagPickerControl>
                      <TagPickerList>
                        {terminals && terminals.length > 0 ? (
                          terminals
                            .filter((t) => t.id !== field.value?.id)
                            .map((terminal) => (
                              <TagPickerOption
                                media={
                                  <Avatar
                                    shape="square"
                                    aria-hidden
                                    name={terminal.name}
                                    color="colorful"
                                  />
                                }
                                value={terminal.id}
                                key={terminal.id}
                              >
                                {terminal.name}
                              </TagPickerOption>
                            ))
                        ) : (
                          <TagPickerOption value="no-options">
                            No hay opciones
                          </TagPickerOption>
                        )}
                      </TagPickerList>
                    </TagPicker>
                  </Field>
                )}
              />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => onSumit()}
                disabled={isPending}
                icon={isPending ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                Sinconizar
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  )
}
