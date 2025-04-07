/* eslint-disable react-refresh/only-export-components */
import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import Breadcrumbs, { BreadcrumbType } from '~/components/breadcrumbs'
import { PATHNAMES } from '~/const'
import { api } from '~/lib/api'
import { Pavilion } from '~/types/academic/pavilion'
import { Period } from '~/types/academic/period'

type ContextSlugClassroom = {
  period: Period
  breadcrumbsComp: React.ReactNode
  pavilion: Pavilion | null
  setPavilion: React.Dispatch<React.SetStateAction<Pavilion | null>>
}

const ContextSlugClassroom = React.createContext<ContextSlugClassroom>(
  {} as ContextSlugClassroom
)

export const useSlugClassroom = () => React.useContext(ContextSlugClassroom)

export default function ClassroomSlugLayout() {
  const params = useParams()
  const { pathname } = useLocation()
  const [pavilion, setPavilion] = React.useState<Pavilion | null>(null)
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
    const [one, two, three, four] = pathname.split('/').slice(4)

    if (one && period) {
      setBreadcrumbs([
        {
          name: period.name,
          to: `/m/academic/classrooms`
        }
      ])
    }

    if (two) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[two as keyof typeof PATHNAMES] ?? two,
          to: `/m/academic/classrooms/${period?.id}/pavilions`
        }
      ])
    }

    if (three && pavilion) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: pavilion.name,
          to: `/m/academic/classrooms/${period?.id}/pavilions/${pavilion.id}/classrooms`
        }
      ])
    }

    if (four) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[four as keyof typeof PATHNAMES] ?? four,
          to: `/m/academic/classrooms/${period?.id}/pavilions`
        }
      ])
    }

    // if (five && section) {
    //   setBreadcrumbs((prev) => [
    //     ...prev,
    //     {
    //       name: section.code,
    //       to: `/m/academic/sections/${period?.id}/programs/${program?.id}/sections`
    //     }
    //   ])
    // }

    // if (six) {
    //   setBreadcrumbs((prev) => [
    //     ...prev,
    //     {
    //       name: PATHNAMES[six as keyof typeof PATHNAMES] ?? six,
    //       to: `/m/academic/sections`
    //     }
    //   ])
    // }
  }, [pathname, pavilion, period])

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
    <ContextSlugClassroom.Provider
      value={{
        breadcrumbsComp,
        period,
        pavilion,
        setPavilion
      }}
    >
      <Outlet />
    </ContextSlugClassroom.Provider>
  )
}
