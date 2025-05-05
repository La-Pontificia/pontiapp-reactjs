import { Helmet } from 'react-helmet'
import UserSlugAssistsFilter from './filters'
import { useSlugUser } from '../+layout'
import React from 'react'
import { Assist } from '@/types/assist'
import { useQuery } from '@tanstack/react-query'
import { format } from '@/lib/dayjs'
import { api } from '@/lib/api'
import AssistsGrid from './grid'
import RestAssistsGrid from './rest-grid'
import { Spinner } from '@fluentui/react-components'
import { RestAssist } from '@/types/rest-assist'

export type Filter = {
  startDate: Date | null
  endDate: Date | null
}

export default function UsersSlugAssistsPage() {
  const { user } = useSlugUser()

  const [filters, setFilters] = React.useState<Filter>({
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date()
  })

  const onAplyFilters = (filters: Filter) => {
    setFilters(filters)
  }

  const { data, isLoading: isAssistsLoading } = useQuery<{
    matchedAssists: Assist[]
    restAssists: RestAssist[]
    originalResultsCount: number
  }>({
    queryKey: ['assists', 'centralized', filters],
    queryFn: async () => {
      let uri = `assists?q=${user?.username}`
      if (filters.startDate)
        uri += `&startDate=${format(filters.startDate, 'YYYY-MM-DD')}`
      if (filters.endDate)
        uri += `&endDate=${format(filters.endDate, 'YYYY-MM-DD')}`

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
        matchedAssists: res.data.matchedAssists.map(
          (assist) => new Assist(assist)
        ),
        restAssists: res.data.restAssists,
        originalResultsCount: res.data.originalResultsCount
      }
    }
  })

  return (
    <div className="max-w-7xl  flex flex-col h-full px-6 mx-auto w-full">
      <Helmet>
        <title>
          {user ? user.displayName + ' -' : ''} Assistencias | Ponti App
        </title>
      </Helmet>
      <UserSlugAssistsFilter
        onAplyFilters={onAplyFilters}
        isLoading={isAssistsLoading}
      />
      {isAssistsLoading ? (
        <div className="h-full grid place-content-center">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="flex flex-col pt-2 space-y-2">
          <h1 className=" px-1 text-blue-500">
            {user ? user.displayName + ' -' : ''} Assistencias en base a sus
            horarios
          </h1>
          <AssistsGrid assists={data?.matchedAssists ?? []} />
          <RestAssistsGrid data={data?.restAssists ?? []} />
        </div>
      )}
    </div>
  )
}
