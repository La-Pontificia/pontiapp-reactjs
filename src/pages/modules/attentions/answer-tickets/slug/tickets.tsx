import React from 'react'
import { useSlugAttentionTicket } from './page'
import { timeAgoShort } from '~/lib/dayjs'
import { FirebaseAttentionTicket } from '~/types/attention-ticket'
import { Avatar, Badge } from '@fluentui/react-components'
import { TicketDiagonalRegular } from '@fluentui/react-icons'
import { callTicket } from '~/services/tickets'
import { toast } from '~/commons/toast'

const states = {
  pending: 'Pendientes',
  attended: 'Atendido'
}

export default function Tickets() {
  const { tickets, setState, state, ticketsTransferred } =
    useSlugAttentionTicket()
  return (
    <div className="bg-neutral-500/10 shadow-md overflow-y-auto flex flex-col dark:shadow-black w-[380px] rounded-xl">
      <nav className="p-2 flex border-b border-slate-500/20 items-center flex-wrap gap-2">
        {Object.entries(states).map(([key, value]) => (
          <button
            onClick={() => setState(key as keyof typeof states)}
            data-selected={state === key ? '' : undefined}
            key={key}
            className="rounded-full p-1 px-3 data-[selected]:dark:border-blue-600 data-[selected]:border-blue-600 border-neutral-300 data-[selected]:bg-blue-500/20 data-[selected]:dark:bg-blue-600/20 font-semibold text-xs border-2 dark:border-neutral-700 hover:bg-slate-500/20"
          >
            {value}
          </button>
        ))}
      </nav>
      <div className="flex flex-col h-full shadow-md overflow-y-auto">
        {ticketsTransferred.length > 0 && (
          <div className="p-2">
            {ticketsTransferred.map((ticket) => (
              <TicketTranseferred key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
        <div className="h-full flex flex-grow overflow-y-auto flex-col relative">
          {ticketsTransferred.length > 0 && (
            <div className="absolute inset-0 dark:bg-neutral-900/95 grid place-content-center z-[1]">
              <h1 className="max-w-[20ch] font-semibold text-center">
                Hay tickets transferidos, por favor atenderlos.
              </h1>
            </div>
          )}
          <div className="flex flex-col h-full divide-y divide-slate-500/10 overflow-y-auto">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Ticket key={ticket.id} ticket={ticket} />
              ))
            ) : (
              <div className="w-full h-full grid place-content-center">
                <p className="text-sm font-medium opacity-50">
                  No hay tickets disponibles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const Ticket = ({ ticket }: { ticket: FirebaseAttentionTicket }) => {
  const { setCallingTicket, tickets } = useSlugAttentionTicket()
  const [timeAgo, setTimeAgo] = React.useState(timeAgoShort(ticket.created_at))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(timeAgoShort(ticket.created_at))
    }, 5000)
    return () => clearInterval(interval)
  }, [ticket.created_at])

  const importance: 'important' | 'normal' | 'very-important' =
    React.useMemo(() => {
      const totalTickets = tickets.length
      const averageTime =
        tickets.reduce(
          (acc, curr) =>
            acc + (new Date().getTime() - new Date(curr.created_at).getTime()),
          0
        ) / totalTickets
      const ticketTime =
        new Date().getTime() - new Date(ticket.created_at).getTime()
      if (ticketTime > averageTime * 1.5) return 'very-important'
      if (ticketTime > averageTime) return 'important'
      return 'normal'
    }, [ticket, tickets])

  const handleCalled = () => {
    setCallingTicket(new FirebaseAttentionTicket(ticket))
    callTicket(ticket.id).catch((error) => {
      setCallingTicket(null)
      toast('oops, no se pudo llamar al ticket', {
        description: error.message
      })
    })
  }

  return (
    <div className="w-full">
      <button
        onClick={handleCalled}
        className="text-left p-3 rounded-md w-full border-2 border-transparent flex items-center gap-3 hover:bg-slate-500/5"
        key={ticket.id}
      >
        <div>
          <Avatar
            size={36}
            icon={<TicketDiagonalRegular fontSize={26} />}
            color={
              importance === 'very-important'
                ? 'dark-red'
                : importance === 'important'
                ? 'gold'
                : 'royal-blue'
            }
          />
        </div>
        <div className="flex-grow">
          <p className="font-semibold pb-0.5">{ticket.attentionServiceName}</p>
          <p className="text-xs dark:text-neutral-400 text-neutral-700">
            {ticket.displayName}
          </p>
        </div>
        <div>
          <Badge
            size="medium"
            color={
              importance === 'very-important'
                ? 'danger'
                : importance === 'important'
                ? 'warning'
                : 'success'
            }
            appearance="tint"
          >
            {timeAgo}
          </Badge>
        </div>
      </button>
    </div>
  )
}

export const TicketTranseferred = ({
  ticket
}: {
  ticket: FirebaseAttentionTicket
}) => {
  const { setCallingTicket } = useSlugAttentionTicket()
  const [timeAgo, setTimeAgo] = React.useState(timeAgoShort(ticket.created_at))

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(timeAgoShort(ticket.created_at))
    }, 5000)
    return () => clearInterval(interval)
  }, [ticket.created_at])

  const handleCalled = () => {
    setCallingTicket(new FirebaseAttentionTicket(ticket))
    callTicket(ticket.id).catch((error) => {
      setCallingTicket(null)
      toast('oops, no se pudo llamar al ticket', {
        description: error.message
      })
    })
  }

  return (
    <div className="w-full">
      <button
        onClick={handleCalled}
        className="text-left p-2 rounded-xl dark:bg-yellow-600 w-full border-2 border-transparent flex items-center gap-3 hover:bg-slate-500/5"
        key={ticket.id}
      >
        <div>
          <Avatar
            size={36}
            icon={<TicketDiagonalRegular fontSize={26} />}
            color="brown"
          />
        </div>
        <div className="flex-grow">
          <p className="font-semibold pb-0.5">{ticket.attentionServiceName}</p>
          <p className="text-xs dark:text-neutral-200 text-neutral-700">
            {ticket.displayName}
          </p>
        </div>
        <div>
          <Badge size="medium" color="informative" appearance="tint">
            {timeAgo}
          </Badge>
        </div>
      </button>
    </div>
  )
}
