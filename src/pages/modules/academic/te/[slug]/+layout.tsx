/* eslint-disable react-refresh/only-export-components */
import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import Breadcrumbs, { BreadcrumbType } from '@/components/breadcrumbs'
import { api } from '@/lib/api'
import { TeGroup } from '@/types/academic/te-group'

type State = {
  breadcrumbsComp: React.ReactNode
  group: TeGroup | null
}

const Context = React.createContext<State>({} as State)

export const useSlug = () => React.useContext(Context)

export default function TevaluationLayout() {
  const params = useParams()
  const { pathname } = useLocation()
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbType[]>([])
  const {
    data: group,
    isLoading,
    refetch
  } = useQuery<TeGroup | null>({
    queryKey: ['academic/te/gro', params.periodId],
    queryFn: async () => {
      const res = await api.get<TeGroup>('academic/te/gro/' + params.groupId)
      if (!res.ok) return null
      return new TeGroup(res.data)
    }
  })

  const breadcrumbsComp = React.useMemo(() => {
    return <Breadcrumbs breadcrumbs={breadcrumbs} />
  }, [breadcrumbs])

  React.useEffect(() => {
    const [one] = pathname.split('/').slice(4)

    setBreadcrumbs([
      {
        name: 'Evaluaciones',
        to: `/m/academic/te`
      }
    ])
    if (one && group) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: group.name,
          to: `/m/academic/te/${group.id}`
        }
      ])
    }
  }, [pathname, group])

  if (isLoading)
    return (
      <div className="w-full grow place-content-center grid">
        <Spinner size="large" />
      </div>
    )

  if (!group)
    return (
      <div className="w-full text-center grow place-content-center grid">
        <p className="py-2 font-medium">Not found</p>
        <Button onClick={() => refetch()} size="small" className="mx-auto">
          Reload
        </Button>
      </div>
    )

  return (
    <Context.Provider
      value={{
        group,
        breadcrumbsComp
      }}
    >
      <Outlet />
    </Context.Provider>
  )
}
