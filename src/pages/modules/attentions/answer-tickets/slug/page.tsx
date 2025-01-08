/* eslint-disable react-refresh/only-export-components */
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import React from 'react'
import { useParams } from 'react-router'
import { format } from '~/lib/dayjs'
import { fdb } from '~/lib/firebase'
import { FirebaseAttentionTicket, TicketState } from '~/types/attention-ticket'
import Tickets from './tickets'
import SlotSlugTicket from './slot'
import { Helmet } from 'react-helmet'

export type TicketExtend = {
  ticket: FirebaseAttentionTicket
  startAt: Date
}

type State = {
  tickets: FirebaseAttentionTicket[]
  ticketsTransferred: FirebaseAttentionTicket[]
  isLoading: boolean

  setAttending: React.Dispatch<React.SetStateAction<TicketExtend | null>>
  attending: TicketExtend | null

  callingTicket: FirebaseAttentionTicket | null
  setCallingTicket: React.Dispatch<
    React.SetStateAction<FirebaseAttentionTicket | null>
  >

  state: TicketState
  setState: React.Dispatch<React.SetStateAction<TicketState>>
}

const ContextSlugAttentionTicket = React.createContext<State>({} as State)

export const useSlugAttentionTicket = () =>
  React.useContext(ContextSlugAttentionTicket)

export default function AttentionsSlugAnswerTicket() {
  const [attending, setAttending] = React.useState<TicketExtend | null>(null)
  const [tickets, setTickets] = React.useState<FirebaseAttentionTicket[]>([])
  const [callingTicket, setCallingTicket] =
    React.useState<FirebaseAttentionTicket | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const params = useParams<{
    slug: string
  }>()

  const [ticketsTransferred, setTicketsTransferred] = React.useState<
    FirebaseAttentionTicket[]
  >([])

  const [state, setState] = React.useState<TicketState>('pending')

  const getConditions = React.useMemo(() => {
    const conditions = [
      orderBy('created_at', 'asc'),
      where('attentionPositionId', '==', params.slug),
      where('created_at_date', '>=', format(new Date(), 'MM/DD/YYYY')),
      where('created_at_date', '<=', format(new Date(), 'MM/DD/YYYY')),
      where('state', 'in', ['transferred', 'attending', state])
    ]

    return conditions
  }, [params.slug, state])

  React.useEffect(() => {
    const q = query(collection(fdb, 'tickets'), ...getConditions)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tickets: Array<any> = []
      querySnapshot.forEach((doc) => {
        tickets.push({
          ...doc.data(),
          id: doc.id
        })
      })
      setTickets(
        tickets
          .filter((t) => t.state !== 'transferred' && t.state !== 'attending')
          .map((ticket) => new FirebaseAttentionTicket(ticket))
      )

      setTicketsTransferred(
        tickets
          .filter((t) => t.state === 'transferred')
          .map((ticket) => new FirebaseAttentionTicket(ticket))
      )

      if (tickets.some((t) => t.state === 'attending')) {
        const ticket = tickets.find((t) => t.state === 'attending')

        if (attending) return

        setAttending({
          ticket: new FirebaseAttentionTicket(ticket!),
          startAt: new Date()
        })
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [params.slug, getConditions, attending])

  return (
    <ContextSlugAttentionTicket.Provider
      value={{
        attending,
        isLoading,
        setAttending,
        tickets,
        callingTicket,
        setCallingTicket,
        state,
        setState,
        ticketsTransferred
      }}
    >
      {/* <Helmet>
        <title>
          {attending?.ticket.attentionPositionName} | Atención de tickets
        </title>
      </Helmet> */}
      <div className="flex flex-col h-full overflow-auto flex-grow">
        <nav className="p-4 flex justify-between px-4">
          <h2 className="dark:text-slate-200 font-semibold">
            <span className="opacity-70">Puesto:</span> Matriculas
          </h2>
          <div className="flex items-center gap-2 text-xs font-medium">
            <div className="w-2.5 aspect-square bg-lime-500 rounded-full relative">
              <div className="w-full h-full animate-ping aspect-square bg-lime-500 rounded-full relative"></div>
            </div>
            <p className="text-lime-800 dark:text-lime-100">Realtime</p>
          </div>
        </nav>
        <div className="flex flex-grow overflow-auto p-4 pt-0 h-full gap-4">
          <SlotSlugTicket />
          <Tickets />
        </div>
      </div>
    </ContextSlugAttentionTicket.Provider>
  )
}
