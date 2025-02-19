import { Spinner } from '@fluentui/react-components'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { api } from '~/lib/api'
import { AssistTerminal } from '~/types/assist-terminal'

import AssistsGrid from './grid'
import AssistFilters from './filters'
import { format } from '~/lib/dayjs'
import { Area } from '~/types/area'
import { Job } from '~/types/job'
import { AssistWithUser } from '~/types/assist-withuser'

export type Filter = {
  startDate: Date | null
  endDate: Date | null
  q: string | null
  terminalsIds: string[]
  areaId: string | null
  jobId: string | null
}

export default function AssistsWithUsersPage() {
  const [filters, setFilters] = React.useState<Filter>({
    startDate: null,
    endDate: null,
    q: null,
    terminalsIds: [],
    areaId: null,
    jobId: null
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

  const { data: areas, isLoading: isAreasLoading } = useQuery<Area[]>({
    queryKey: ['areas/all'],
    queryFn: async () => {
      const res = await api.get<Area[]>('partials/areas/all')
      if (!res.ok) return []
      return res.data.map((item) => new Area(item))
    }
  })

  const { data: jobs, isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['jobs/all'],
    queryFn: async () => {
      const res = await api.get<Job[]>('partials/jobs/all')
      if (!res.ok) return []
      return res.data.map((item) => new Job(item))
    }
  })

  const { data: assists, isLoading: isAssistsLoading } = useQuery<
    AssistWithUser[]
  >({
    queryKey: ['assists', 'withUsers', 'advanced', filters],
    queryFn: async () => {
      let uri = 'assists/withUsers?advanced=true'
      if (filters.startDate)
        uri += `&startDate=${format(filters.startDate, 'YYYY-MM-DD')}`
      if (filters.endDate)
        uri += `&endDate=${format(filters.endDate, 'YYYY-MM-DD')}`
      if (filters.q) uri += `&q=${filters.q}`
      if (filters.terminalsIds.length > 0)
        uri += `&assistTerminals=${filters.terminalsIds.join(',')}`
      if (filters.areaId) uri += `&areaId=${filters.areaId}`
      if (filters.jobId) uri += `&jobId=${filters.jobId}`

      const res = await api.get<AssistWithUser[]>(uri)
      if (!res.ok) return []
      return res.data.map((assist) => new AssistWithUser(assist))
    }
  })

  const onAplyFilters = (filters: Filter) => {
    setFilters(filters)
  }

  return (
    <div className="w-full flex overflow-auto flex-col flex-grow h-full px-3 pb-2">
      <header>
        <AssistFilters
          jobs={jobs ?? []}
          isJobsLoading={isJobsLoading}
          areas={areas ?? []}
          isAreasLoading={isAreasLoading}
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
              <AssistsGrid assists={assists ?? []} />
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
