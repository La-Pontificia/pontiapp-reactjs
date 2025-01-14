import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import { useSlugAttentionTicket } from './page'
import React from 'react'
import { attendTicket, cancelTicket } from '~/services/tickets'
import { toast } from 'anni'
import AttendingTicket from './attending'
import { FirebaseAttentionTicket } from '~/types/attention-ticket'
import { format } from '~/lib/dayjs'

export default function SlotSlugTicket() {
  const { callingTicket, setAttending, setCallingTicket, attending } =
    useSlugAttentionTicket()
  const [openCancelTicket, setOpenCancelTicket] = React.useState(false)
  const [canceling, setCanceling] = React.useState(false)
  const [starting, setstarting] = React.useState(false)

  const handleCancelTicket = () => {
    setCanceling(true)
    cancelTicket(callingTicket!.id)
      .then(() => {
        setCallingTicket(null)
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

  const handleAttend = () => {
    setstarting(true)
    attendTicket(callingTicket!.id)
      .then(() => {
        setCallingTicket(null)
        setAttending({
          ticket: new FirebaseAttentionTicket({
            ...callingTicket!,
            waitedUntil: format(new Date(), 'MM-DD-YYYY HH:mm:ss')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any),
          startAt: new Date()
        })
      })
      .catch((err) => {
        toast('Ocurrió un error al inciar la atencion del ticket.')
        console.error(err)
      })
      .finally(() => {
        setstarting(false)
      })
  }

  return (
    <div className="flex-grow bg-neutral-500/10 rounded-xl shadow-md dark:shadow-black">
      {!callingTicket && !attending && (
        <div className="w-full h-full grid place-content-center">
          <p className="text-sm font-medium opacity-50">
            Seleccione un ticket.
          </p>
        </div>
      )}
      {callingTicket && !attending && (
        <div className="grid place-content-center h-full w-full flex-grow text-center">
          <div className="flex justify-center pb-10">
            <div className="flex gap-2 items-center">
              <div className="w-2 animate-pulse aspect-square rounded-full dark:bg-blue-600 bg-black" />
              <div className="w-2 animate-pulse delay-500 aspect-square rounded-full dark:bg-blue-600 bg-black" />
              <div className="w-2 animate-pulse delay-1000 aspect-square rounded-full dark:bg-blue-600 bg-black" />
            </div>
          </div>
          <div className="p-2 border-b border-slate-500/20">
            <p className="text-sm font-semibold opacity-50">Llamando a:</p>
            <p className="text-lg font-semibold">{callingTicket.displayName}</p>
          </div>
          <div className="p-2">
            <p className="text-sm font-semibold opacity-50">Servicio:</p>
            <p className="text-lg font-semibold">
              {callingTicket.attentionServiceName}
            </p>
          </div>
          <div className="pt-5 flex flex-col gap-2 items-center">
            <Button
              disabled={starting}
              icon={starting ? <Spinner size="tiny" /> : undefined}
              appearance="primary"
              onClick={handleAttend}
            >
              Iniciar atención
            </Button>
            <Button
              onClick={() => setOpenCancelTicket(true)}
              appearance="subtle"
            >
              Cancelar ticket
            </Button>
          </div>
        </div>
      )}
      {attending && <AttendingTicket />}

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
                {callingTicket?.displayName}?
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
    </div>
  )
}
