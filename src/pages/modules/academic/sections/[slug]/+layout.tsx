/* eslint-disable react-refresh/only-export-components */
import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import Breadcrumbs, { BreadcrumbType } from '~/components/breadcrumbs'
import { PATHNAMES } from '~/const'
import { api } from '~/lib/api'
import { Period } from '~/types/academic/period'
import { Program } from '~/types/academic/program'
import { Section } from '~/types/academic/section'

type ContextSlugSectionState = {
  breadcrumbsComp: React.ReactNode
  period: Period
  program: Program | null
  setProgram: React.Dispatch<React.SetStateAction<Program | null>>
  section: Section | null
  setSection: React.Dispatch<React.SetStateAction<Section | null>>
}

const ContextSlugSection = React.createContext<ContextSlugSectionState>(
  {} as ContextSlugSectionState
)

export const useSlugSection = () => React.useContext(ContextSlugSection)

export default function SectionSlugLayout() {
  const params = useParams()
  const { pathname } = useLocation()
  const [program, setProgram] = React.useState<Program | null>(null)
  const [section, setSection] = React.useState<Section | null>(null)

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
    const [one, two, three, four, five, six] = pathname.split('/').slice(4)

    if (one && period) {
      setBreadcrumbs([
        {
          name: period.name,
          to: `/m/academic/sections`
        }
      ])
    }

    if (two) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[two as keyof typeof PATHNAMES] ?? two,
          to: `/m/academic/sections/${period?.id}/programs`
        }
      ])
    }

    if (three && program) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: program.name,
          to: `/m/academic/sections/${period?.id}/programs`
        }
      ])
    }

    if (four) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[four as keyof typeof PATHNAMES] ?? four,
          to: `/m/academic/sections/${period?.id}/programs/${program?.id}/sections`
        }
      ])
    }

    if (five && section) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: section.code,
          to: `/m/academic/sections/${period?.id}/programs/${program?.id}/sections`
        }
      ])
    }

    if (six) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[six as keyof typeof PATHNAMES] ?? six,
          to: `/m/academic/sections`
        }
      ])
    }
  }, [pathname, period, program, section])

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
    <ContextSlugSection.Provider
      value={{
        section,
        setSection,
        period,
        program,
        setProgram,
        breadcrumbsComp
      }}
    >
      <Outlet />
    </ContextSlugSection.Provider>
  )
}
