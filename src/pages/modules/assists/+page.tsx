import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { format } from '~/lib/dayjs'
import AssistFilters from './filters'
import { Area } from '~/types/area'
import { Job } from '~/types/job'
import React from 'react'
import { Spinner, Tab, TabList } from '@fluentui/react-components'
import { Assist } from '~/types/assist'
import AssistsGrid from './grid'
import RestAssistsGrid from './rest-grid'
import { RestAssist } from '~/types/rest-assist'

export type Filter = {
  startDate: Date | null
  endDate: Date | null
  q: string | null
  areaId: string | null
  jobId: string | null
}

export default function AssistsPage() {
  const [filters, setFilters] = React.useState<Filter>({
    startDate: null,
    endDate: null,
    q: null,
    areaId: null,
    jobId: null
  })

  const [tab, setTab] = React.useState<'matched' | 'rest'>('matched')

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

  const { data, isLoading: isAssistsLoading } = useQuery<{
    matchedAssists: Assist[]
    restAssists: RestAssist[]
    originalResultsCount: number
  }>({
    queryKey: ['assists', 'centralized', filters],
    queryFn: async () => {
      let uri = 'assists?withUser=true'
      if (filters.startDate)
        uri += `&startDate=${format(filters.startDate, 'YYYY-MM-DD')}`
      if (filters.endDate)
        uri += `&endDate=${format(filters.endDate, 'YYYY-MM-DD')}`
      if (filters.q) uri += `&q=${filters.q}`
      if (filters.areaId) uri += `&areaId=${filters.areaId}`
      if (filters.jobId) uri += `&jobId=${filters.jobId}`

      const res = await api.get<{
        matchedAssists: Assist[]
        restAssists: RestAssist[]
        originalResultsCount: number
      }>(uri)

      if (!res.ok)
        return {
          matchedAssists: [],
          restAssists: [],
          originalResultsCount: 0
        }
      return {
        matchedAssists: res.data.matchedAssists,
        restAssists: res.data.restAssists,
        originalResultsCount: res.data.originalResultsCount
      }
    }
  })

  const onAplyFilters = (filters: Filter) => {
    setFilters(filters)
  }

  const tabs = {
    matched: `(${data?.matchedAssists.length ?? 0}) horarios`,
    rest: `Sin procesadas (${data?.restAssists.length ?? 0})`
  }

  return (
    <div className="w-full flex overflow-auto flex-col flex-grow h-full p-3 pt-0">
      <header>
        <AssistFilters
          jobs={jobs ?? []}
          isJobsLoading={isJobsLoading}
          areas={areas ?? []}
          isAreasLoading={isAreasLoading}
          onAplyFilters={onAplyFilters}
          isLoading={isAssistsLoading}
        />
      </header>
      <div className="overflow-auto flex flex-col flex-grow pt-1">
        {!filters.endDate && !filters.startDate ? (
          <div className="flex-grow grid place-content-center h-full">
            <p className="text-xs text-center opacity-60">
              Por favor, selecciona un rango de fechas y terminales para filtrar
              los registros de asistencias.
            </p>
          </div>
        ) : (
          <>
            {isAssistsLoading ? (
              <div className="h-full grid flex-grow place-content-center">
                <Spinner size="huge" />
                <p className="text-xs pt-4 opacity-60">
                  Cargando asistencias, por favor espere. Este proceso puede
                  tardar varios segundos o minutos.
                </p>
              </div>
            ) : (
              <div className="overflow-auto flex flex-col">
                <div className="pb-2">
                  <TabList
                    selectedValue={tab}
                    onTabSelect={(_, d) =>
                      setTab(d.value as 'matched' | 'rest')
                    }
                    appearance="subtle"
                  >
                    {Object.entries(tabs).map(([key, value]) => (
                      <Tab key={key} value={key}>
                        {value}
                      </Tab>
                    ))}
                  </TabList>
                </div>
                <div className="overflow-auto flex flex-col">
                  {tab === 'matched' && (
                    <AssistsGrid data={data?.matchedAssists ?? []} />
                  )}
                  {tab === 'rest' && (
                    <RestAssistsGrid data={data?.restAssists ?? []} />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
