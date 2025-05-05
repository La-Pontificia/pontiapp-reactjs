/* eslint-disable react-refresh/only-export-components */
import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import Breadcrumbs, { BreadcrumbType } from '@/components/breadcrumbs'
import { PATHNAMES } from '@/const'
import { api } from '@/lib/api'
import { Period } from '@/types/academic/period'
import { Program } from '@/types/academic/program'

type ContextSlugScheduleState = {
  breadcrumbsComp: React.ReactNode
  period: Period
  program: Program | null
  setProgram: React.Dispatch<React.SetStateAction<Program | null>>
}

const ContextSlugSchedule = React.createContext<ContextSlugScheduleState>(
  {} as ContextSlugScheduleState
)

export const useSlugSchedules = () => React.useContext(ContextSlugSchedule)

export default function SchedulesSlugLayout() {
  const params = useParams()
  const { pathname } = useLocation()
  const [program, setProgram] = React.useState<Program | null>(null)

  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbType[]>([])

  const {
    data: period,
    isLoading,
    refetch
  } = useQuery<Period | null>({
    queryKey: ['academic/periods', params.periodId],
    queryFn: async () => {
      const res = await api.get<Period>('academic/periods/' + params.periodId)
      if (!res.ok) return null
      return new Period(res.data)
    }
  })

  const breadcrumbsComp = React.useMemo(() => {
    return <Breadcrumbs breadcrumbs={breadcrumbs} />
  }, [breadcrumbs])

  React.useEffect(() => {
    const [one, two, three] = pathname.split('/').slice(4)

    setBreadcrumbs([
      {
        name: 'Horarios',
        to: `/m/academic/schedules`
      }
    ])

    if (one && period) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: period.name,
          to: `/m/academic/schedules/${period.id}`
        }
      ])
    }

    if (two && program) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: program.name,
          to: `/m/academic/schedules/${period?.id}`
        }
      ])
    }

    if (three) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[three as keyof typeof PATHNAMES] ?? three,
          to: `/m/academic/schedules/${period?.id}/${program?.id}/sections`
        }
      ])
    }
  }, [pathname, period, program])

  if (isLoading)
    return (
      <div className="w-full grow place-content-center grid">
        <Spinner size="large" />
      </div>
    )

  if (!period)
    return (
      <div className="w-full text-center grow place-content-center grid">
        <p className="py-2 font-medium">Not found</p>
        <Button onClick={() => refetch()} size="small" className="mx-auto">
          Reload
        </Button>
      </div>
    )

  return (
    <ContextSlugSchedule.Provider
      value={{
        period,
        program,
        setProgram,
        breadcrumbsComp
      }}
    >
      <Outlet />
    </ContextSlugSchedule.Provider>
  )
}
