import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@fluentui/react-components'
import React from 'react'
import { format } from '~/lib/dayjs'
import { AssistTerminal } from '~/types/assist-terminal'
import AssistSummaryFilters from './filters'
import Item from './assist'

export type Filter = {
  startDate: Date | null
  endDate: Date | null
  terminalId: string | null
}

export type SingleAssistSummary = {
  date: string
  count: number
  terminal: AssistTerminal
}

export default function AssistsSummaryPage() {
  const [filters, setFilters] = React.useState<Filter>({
    startDate: null,
    endDate: null,
    terminalId: null
  })

  const { data: terminals, isLoading: isTerminalsLoading } = useQuery<
    AssistTerminal[]
  >({
    queryKey: ['AssistTerminals'],
    queryFn: async () => {
      const res = await api.get<AssistTerminal[]>(
        'partials/assist-terminals/all'
      )
      if (!res.ok) return []
      return res.data.map((terminal) => new AssistTerminal(terminal))
    }
  })

  const { data: items, isLoading } = useQuery<SingleAssistSummary[]>({
    queryKey: ['singleSummary', filters],
    queryFn: async () => {
      let uri = 'assists/singleSummary?advanced=true'
      if (filters.startDate)
        uri += `&startDate=${format(filters.startDate, 'YYYY-MM-DD')}`
      if (filters.endDate)
        uri += `&endDate=${format(filters.endDate, 'YYYY-MM-DD')}`
      if (filters.terminalId) uri += `&assistTerminal=${filters.terminalId}`

      const res = await api.get<SingleAssistSummary[]>(uri)
      if (!res.ok) return []
      return res.data
    }
  })

  return (
    <div className="flex flex-col px-3 w-full pb-3 overflow-y-auto h-full">
      <AssistSummaryFilters
        isLoading={isLoading}
        isTerminalLoading={isTerminalsLoading}
        onAplyFilters={setFilters}
        terminals={terminals || []}
      />
      {(!filters.endDate && !filters.startDate) || !filters.terminalId ? (
        <div className="flex-grow grid place-content-center h-full">
          <p className="text-xs text-center opacity-60">
            Por favor, selecciona un rango de fechas y un terminal para mostrar
            el resúmen.
          </p>
        </div>
      ) : (
        <div className="overflow-auto rounded-xl pt-2 h-full">
          {isLoading ? (
            <div className="h-full grid place-content-center">
              <Spinner size="huge" />
            </div>
          ) : (
            <table className="w-full relative">
              <thead>
                <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
                  <td>Fecha</td>
                  <td>Terminal (Biométrico)</td>
                  <td>Cantidad</td>
                </tr>
              </thead>
              <tbody>
                {items?.map((item) => (
                  <Item key={item.date} item={item} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
