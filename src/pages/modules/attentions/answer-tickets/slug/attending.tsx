import { useElapsedTime } from '~/hooks/use-elapsed-time'
import { useSlugAttentionTicket } from './page'
import {
  Badge,
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Option,
  OptionGroup,
  Spinner,
  Textarea
} from '@fluentui/react-components'
import { cancelTicket, finishTicket, transferTicket } from '~/services/tickets'
import React from 'react'
import { toast } from '~/commons/toast'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { AttentionPosition } from '~/types/attention-position'
import { Controller, useForm } from 'react-hook-form'

export default function AttendingTicket() {
  const { attending, setAttending } = useSlugAttentionTicket()

  // use states
  const [openCancelTicket, setOpenCancelTicket] = React.useState(false)
  const [canceling, setCanceling] = React.useState(false)
  const [openTransferTicket, setOpenTransferTicket] = React.useState(false)
  const [openFinishTicket, setOpenFinishTicket] = React.useState(false)

  const elapsedTime = useElapsedTime(attending!.startAt)
  if (!attending) return null

  const handleCancelTicket = () => {
    setCanceling(true)
    cancelTicket(attending.ticket.id)
      .then(() => {
        setAttending(null)
      })
      .catch((err) => {
        toast('Ocurrió un error al cancelar el ticket.')
        console.error(err)
      })
      .finally(() => {
        setCanceling(false)
        setOpenCancelTicket(false)
      })
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto flex-grow">
      <div className="flex-grow overflow-y-auto rounded-xl">
        <div className="flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">Servicio:</span>
          <span className="block text-base font-semibold">
            {attending.ticket.attentionServiceName}
          </span>
        </div>
        <div className="bg-neutral-500/20 flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">Nombres y apellidos:</span>
          <span className="block text-base font-semibold">
            {attending.ticket.displayName}
          </span>
        </div>
        <div className="flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">
            Documento de Indentidad:
          </span>
          <span className="block text-base font-semibold">
            {attending.ticket.personDocumentId}
          </span>
        </div>
        <div className="bg-neutral-500/20 flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">Carrera:</span>
          <span className="block text-base font-semibold">
            {attending.ticket.personCareer ?? '-'}
          </span>
        </div>
        <div className="flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">Periodo:</span>
          <span className="block text-base font-semibold">
            {attending.ticket.personPeriodName ?? '-'}
          </span>
        </div>
        <div className="bg-neutral-500/20 flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">Sexo:</span>
          <span className="block text-base font-semibold">
            {attending.ticket.personGender ?? '-'}
          </span>
        </div>
        <div className="flex items-center gap-4 p-2 px-4 border-b border-black">
          <span className="text-sm block opacity-50">Email:</span>
          <span className="block text-base font-semibold">
            {attending.ticket.personEmail ?? '-'}
          </span>
        </div>
        {attending.ticket.transferReason && (
          <div className="flex items-center gap-4 p-2 px-4 border-b border-black">
            <Badge>
              <span className="text-sm block">
                Razon de transferencia (Detalles):
              </span>
            </Badge>
            <span className="block text-base font-semibold">
              {attending.ticket.transferReason ?? '-'}
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <div className="pb-10 pr-10 text-5xl font-semibold dark:text-stone-400">
          {elapsedTime}
        </div>
      </div>
      <footer className="border-t flex gap-3 justify-end border-neutral-500/20 p-4">
        <Button
          onClick={() => setOpenCancelTicket(true)}
          appearance="subtle"
          size="large"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => setOpenTransferTicket(true)}
          appearance="secondary"
          size="large"
        >
          Transferir
        </Button>
        <Button
          onClick={() => setOpenFinishTicket(true)}
          appearance="primary"
          size="large"
        >
          Finalizar
        </Button>
      </footer>

      {/* Dialogs */}
      {openCancelTicket && (
        <Dialog
          open={openCancelTicket}
          onOpenChange={(_, e) => setOpenCancelTicket(e.open)}
          modalType="alert"
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>
                ¿Está seguro de cancelar el ticket de{' '}
                {attending.ticket.displayName}?
              </DialogTitle>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="secondary">Cancelar</Button>
                </DialogTrigger>
                <Button
                  onClick={handleCancelTicket}
                  disabled={canceling}
                  icon={canceling ? <Spinner size="tiny" /> : undefined}
                  appearance="primary"
                >
                  Cancelar ticket
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}

      {openTransferTicket && (
        <DialogTransferredTicket
          openTransferTicket={openTransferTicket}
          setOpenTransferTicket={setOpenTransferTicket}
        />
      )}

      {openFinishTicket && (
        <DialogFinishTicket
          openFinishTicket={openFinishTicket}
          setOpenFinishTicket={setOpenFinishTicket}
        />
      )}
    </div>
  )
}

export const DialogTransferredTicket = ({
  openTransferTicket,
  setOpenTransferTicket
}: {
  openTransferTicket: boolean
  setOpenTransferTicket: (open: boolean) => void
}) => {
  const [transferring, setTransferring] = React.useState(false)
  const { setAttending, attending } = useSlugAttentionTicket()

  const { control, handleSubmit } = useForm<{
    attentionPosition: AttentionPosition
    reason: string
  }>()

  const { data: attentionPositions, isLoading: isAttentionPositionsLoading } =
    useQuery<AttentionPosition[]>({
      queryKey: ['attentions/positions/all/relationship'],
      queryFn: async () => {
        const res = await api.get<AttentionPosition[]>(
          'attentions/positions/all?relationship=business,current'
        )
        if (!res.ok) return []
        return res.data
      }
    })

  const attentionPositionsGrouped = React.useMemo(() => {
    const positionMap = attentionPositions?.reduce((acc, item) => {
      const businessId = item.business.id

      if (!acc[businessId]) {
        acc[businessId] = {
          business: item.business,
          positions: []
        }
      }

      acc[businessId].positions.push(item)
      return acc
    }, {} as Record<string, { business: AttentionPosition['business']; positions: AttentionPosition[] }>)

    return Object.values(positionMap ?? {})
  }, [attentionPositions])

  const handleTransfer = handleSubmit(async (values) => {
    setTransferring(true)
    transferTicket(
      attending!.ticket.id,
      values.attentionPosition,
      values.reason
    )
      .then(() => {
        setAttending(null)
      })
      .catch((err) => {
        toast('Ocurrió un error al transferir el ticket.')
        console.error(err)
      })
      .finally(() => {
        setTransferring(false)
      })
  })

  return (
    <Dialog
      open={openTransferTicket}
      onOpenChange={(_, e) => setOpenTransferTicket(e.open)}
      modalType="modal"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            Transferir ticket de {attending!.ticket.displayName}
          </DialogTitle>
          <DialogContent>
            <div className="pb-2">
              Seleccione el cargo al que desea transferir.
            </div>
            <div className="pt-3 grid gap-5">
              <Controller
                rules={{
                  required: 'Este campo es requerido'
                }}
                control={control}
                name="attentionPosition"
                render={({ field, fieldState: { error } }) => (
                  <Field
                    required
                    label="Puesto de atención a transferir"
                    validationMessage={error?.message}
                  >
                    <Combobox
                      input={{
                        autoComplete: 'off',
                        style: {
                          width: 500
                        }
                      }}
                      multiple={true}
                      disabled={isAttentionPositionsLoading || transferring}
                      onOptionSelect={(_, data) => {
                        const b = attentionPositions?.find(
                          (b) => b.id === data.optionValue
                        )

                        if (!b) return

                        field.onChange(b)
                      }}
                      style={{
                        borderRadius: 7
                      }}
                      selectedOptions={field.value ? [field.value.id] : []}
                      value={field.value ? field.value.name : ''}
                      placeholder="Selecciona una o más unidades de negocio"
                    >
                      {attentionPositionsGrouped.map((group) => (
                        <OptionGroup label={group.business.name}>
                          {group.positions.map((position) => (
                            <Option
                              disabled={
                                position.id ===
                                  attending!.ticket.attentionPositionId ||
                                !position.available
                              }
                              text={position.name}
                              key={position.id}
                              value={position.id}
                            >
                              <div className="flex gap-2 items-center">
                                <p className="opacity-50 font-semibold">
                                  {position.shortName}
                                </p>
                                <p>{position.name}</p>
                              </div>
                            </Option>
                          ))}
                        </OptionGroup>
                      ))}
                    </Combobox>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="reason"
                render={({ field }) => (
                  <Field label="Motivo de la transferencia">
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder="Escriba el motivo de la transferencia u observaciones."
                    />
                  </Field>
                )}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancelar</Button>
            </DialogTrigger>
            <Button
              onClick={handleTransfer}
              disabled={transferring}
              icon={transferring ? <Spinner size="tiny" /> : undefined}
              appearance="primary"
            >
              Transferir
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export const DialogFinishTicket = ({
  openFinishTicket,
  setOpenFinishTicket
}: {
  openFinishTicket: boolean
  setOpenFinishTicket: (open: boolean) => void
}) => {
  const [finishing, setFinishing] = React.useState(false)
  const { setAttending, attending } = useSlugAttentionTicket()

  const { control, handleSubmit } = useForm<{
    description: string
  }>()

  const handleFinish = handleSubmit(async (values) => {
    setFinishing(true)
    finishTicket(attending!, values.description)
      .then(() => {
        setAttending(null)
        toast('Ticket finalizado correctamente.')
      })
      .catch((err) => {
        toast('Ocurrió un error al finalizar el ticket.')
        console.error(err)
      })
      .finally(() => {
        setFinishing(false)
      })
  })

  return (
    <Dialog
      open={openFinishTicket}
      onOpenChange={(_, e) => setOpenFinishTicket(e.open)}
      modalType="modal"
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            Finalizar ticket de {attending!.ticket.displayName}
          </DialogTitle>
          <DialogContent>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Field label="Descripción/observaciones">
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Escriba una descripción/observaciones de la atención. (Opcional)"
                  />
                </Field>
              )}
            />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Cancelar</Button>
            </DialogTrigger>
            <Button
              onClick={handleFinish}
              disabled={finishing}
              icon={finishing ? <Spinner size="tiny" /> : undefined}
              appearance="primary"
            >
              Finalizar atención.
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
