// import { api } from '@/lib/api'
// import { useQuery } from '@tanstack/react-query'
// import { AddFilled, Search20Regular } from '@fluentui/react-icons'
// import { SearchBox, Spinner } from '@fluentui/react-components'
import { Combobox, Option, Spinner } from '@fluentui/react-components'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import React from 'react'
import { fdb } from '@/lib/firebase'
import { FirebaseAttentionTicket } from '@/types/attention-ticket'
import Item from './ticket'
import { useQuery } from '@tanstack/react-query'
import { BusinessUnit } from '@/types/business-unit'
import { api } from '@/lib/api'
import { DatePicker } from '@fluentui/react-datepicker-compat'
import { format } from '@/lib/dayjs'
import { localizedStrings } from '@/const'
import { Helmet } from 'react-helmet'
// import { useDebounced } from '@/hooks/use-debounced'
// import { ResponsePaginate } from '@/types/paginate-response'
// import { toast } from 'anni'
// import { handleError } from '@/utils'
// import { useAuth } from '@/store/auth'
// import Form from './form'
// import Item from './ticket'
// import { AttentionTicket } from '@/types/attention-ticket'

export default function AttentionsTicketsPage() {
  const [tickets, setTickets] = React.useState<FirebaseAttentionTicket[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [filters, setFilters] = React.useState<{
    attentionPositionBusinessId: string | null
    startDate: string | null
    endDate: string | null
  }>({
    attentionPositionBusinessId: null,
    startDate: format(new Date(), 'MM/DD/YYYY'),
    endDate: format(new Date(), 'MM/DD/YYYY')
  })

  const args = React.useMemo(() => {
    const cnd = []
    if (filters.attentionPositionBusinessId) {
      cnd.push(
        where(
          'attentionPositionBusinessId',
          '==',
          filters.attentionPositionBusinessId
        )
      )
    }

    if (filters.startDate) {
      cnd.push(where('created_at_date', '>=', filters.startDate))
    }

    if (filters.endDate) {
      cnd.push(where('created_at_date', '<=', filters.endDate))
    }

    return cnd
  }, [filters])

  React.useEffect(() => {
    const q = query(
      collection(fdb, 'tickets'),
      orderBy('created_at', 'asc'),
      ...args
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tickets: Array<any> = []
      querySnapshot.forEach((doc) => {
        tickets.push({
          ...doc.data(),
          id: doc.id
        })
      })
      setTickets(tickets.map((ticket) => new FirebaseAttentionTicket(ticket)))
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [args])

  const { data: businessUnits, isLoading: isLoadingBusinessUnits } = useQuery<
    BusinessUnit[] | null
  >({
    queryKey: ['attentions/businessUnits'],
    queryFn: async () => {
      const res = await api.get<[]>(
        'attentions/businessUnits?onlyAttentions=true'
      )
      if (!res.ok) return null
      return res.data.map((a) => new BusinessUnit(a))
    }
  })

  const orderedByState = tickets.sort((a, b) => {
    const states: Record<string, number> = {
      transferred: 1,
      calling: 2,
      pending: 3,
      attending: 4,
      attended: 5,
      cancelled: 6
    }

    return states[a.state] - states[b.state]
  })

  return (
    <div className="flex px-3 flex-col w-full pb-3 overflow-auto h-full">
      <Helmet>
        <title>Tickets generados | PontiApp</title>
      </Helmet>
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center gap-4">
        <Combobox
          input={{
            autoComplete: 'off'
          }}
          disabled={isLoadingBusinessUnits}
          onOptionSelect={(_, data) => {
            const b = businessUnits?.find((b) => b.id === data.optionValue)
            setFilters({
              ...filters,
              attentionPositionBusinessId: b ? b.id : null
            })
          }}
          style={{
            borderRadius: 7
          }}
          selectedOptions={
            filters.attentionPositionBusinessId
              ? [filters.attentionPositionBusinessId]
              : []
          }
          value={
            filters.attentionPositionBusinessId
              ? businessUnits?.find(
                (b) => b.id === filters.attentionPositionBusinessId
              )?.name
              : ''
          }
          placeholder="Unidad de negocio"
        >
          {businessUnits?.map((business) => (
            <Option key={business.id} text={business.name} value={business.id}>
              {business.name}
            </Option>
          ))}
        </Combobox>
        <DatePicker
          disabled={isLoading}
          input={{
            style: {
              width: 100
            }
          }}
          value={filters.startDate ? new Date(filters.startDate) : null}
          onSelectDate={(date) => {
            setFilters((prev) => ({
              ...prev,
              startDate: date ? format(date, 'MM/DD/YYYY') : null
            }))
          }}
          formatDate={(date) => format(date, 'DD-MM-YYYY')}
          strings={localizedStrings}
          placeholder="Desde"
        />
        <DatePicker
          input={{
            style: {
              width: 100
            }
          }}
          disabled={isLoading}
          value={filters.endDate ? new Date(filters.endDate) : null}
          onSelectDate={(date) => {
            setFilters((prev) => ({
              ...prev,
              endDate: date ? date.toISOString() : null
            }))
          }}
          formatDate={(date) => format(date, 'DD-MM-YYYY')}
          strings={localizedStrings}
          placeholder="Hasta"
        />
        <div className="flex items-center gap-2 text-xs font-medium">
          <div className="w-2.5 aspect-square bg-lime-500 rounded-full relative">
            <div className="w-full h-full animate-ping aspect-square bg-lime-500 rounded-full relative"></div>
          </div>
          <p className="text-lime-800 dark:text-lime-100">En tiempo real</p>
        </div>
      </nav>
      <div className="overflow-auto flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : tickets.length < 1 ? (
          <div className="h-full grid place-content-center">
            <p className="text-center text-neutral-400 dark:text-neutral-500 font-semibold">
              No hay tickets que mostrar
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="dark:text-neutral-400 font-semibold [&>td]:py-2 [&>td]:px-2">
                <td className="text-nowrap">Ticket</td>
                <td className="text-nowrap">Persona</td>
                <td className="text-nowrap">Puesto</td>
                <td className="text-nowrap">Negocio</td>
                <td className="text-nowrap">Estado</td>
                <td className="text-nowrap">Esperando</td>
                <td className="text-nowrap"></td>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-500/20">
              {orderedByState.map((ticket) => (
                <Item key={ticket.id} item={ticket} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
