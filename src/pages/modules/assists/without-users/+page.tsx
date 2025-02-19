import { Spinner } from '@fluentui/react-components'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { api } from '~/lib/api'
import { AssistTerminal } from '~/types/assist-terminal'

import AssistsGrid from './grid'
import AssistFilters from './filters'
import { format } from '~/lib/dayjs'

export type AssistSingle = {
  datetime: string
  firstNames: string
  lastNames: string
  documentId: string
  terminalId: string
}

export type Filter = {
  startDate: Date | null
  endDate: Date | null
  q: string | null
  terminalsIds: string[]
}

export default function AssistsWithoutUsersPage() {
  const [filters, setFilters] = React.useState<Filter>({
    startDate: null,
    endDate: null,
    q: null,
    terminalsIds: []
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

  const { data: assists, isLoading: isAssistsLoading } = useQuery<
    AssistSingle[]
  >({
    queryKey: ['assists', 'withoutUsers', 'single', filters],
    queryFn: async () => {
      let uri = 'assists/withoutUsers?tm=true'
      if (filters.startDate)
        uri += `&startDate=${format(filters.startDate, 'YYYY-MM-DD')}`
      if (filters.endDate)
        uri += `&endDate=${format(filters.endDate, 'YYYY-MM-DD')}`
      if (filters.q) uri += `&q=${filters.q}`
      if (filters.terminalsIds.length > 0)
        uri += `&assistTerminals=${filters.terminalsIds.join(',')}`
      const res = await api.get<AssistSingle[]>(uri)
      if (!res.ok) return []
      return res.data
    }
  })

  const onAplyFilters = (filters: Filter) => {
    setFilters(filters)
  }

  return (
    <div className="w-full flex overflow-auto flex-col flex-grow h-full px-3 pb-2">
      <header>
        <AssistFilters
          isTerminalsLoading={isTerminalsLoading}
          terminals={terminals ?? []}
          onAplyFilters={onAplyFilters}
          isLoading={isAssistsLoading}
        />
      </header>
      <div className="overflow-auto flex flex-col flex-grow rounded-xl">
        {(!filters.endDate && !filters.startDate) ||
        !filters.terminalsIds.length ? (
          <div className="flex-grow grid place-content-center h-full">
            <p className="text-xs text-center opacity-60">
              Por favor, selecciona un rango de fechas y terminales para filtrar
              los registros de asistencias.
            </p>
          </div>
        ) : (
          <>
            {isAssistsLoading ? (
              <div className="h-full grid place-content-center">
                <Spinner size="huge" />
                <p className="text-xs pt-4 opacity-60">
                  Cargando asistencias, por favor espere. Este proceso puede
                  tardar varios segundos o minutos.
                </p>
              </div>
            ) : assists && assists?.length > 0 ? (
              <AssistsGrid
                assists={assists ?? []}
                assistTerminals={terminals ?? []}
              />
            ) : (
              <div className="grid place-content-center h-full text-xs">
                No se encontraron registros de asistencias con los filtros
                seleccionados.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
