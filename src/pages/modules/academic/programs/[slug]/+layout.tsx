/* eslint-disable react-refresh/only-export-components */
import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import Breadcrumbs, { BreadcrumbType } from '~/components/breadcrumbs'
import { PATHNAMES } from '~/const'
import { api } from '~/lib/api'
import { Plan } from '~/types/academic/plan'
import { Program } from '~/types/academic/program'

type ContextSlugProgram = {
  breadcrumbsComp: React.ReactNode
  program: Program
  plan: Plan | null
  setPlan: React.Dispatch<React.SetStateAction<Plan | null>>
}

const ContextSlugPrograms = React.createContext<ContextSlugProgram>(
  {} as ContextSlugProgram
)

export const useSlugProgram = () => React.useContext(ContextSlugPrograms)

export default function LayoutSlugProgram() {
  const params = useParams()
  const { pathname } = useLocation()
  const [plan, setPlan] = React.useState<Plan | null>(null)
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbType[]>([])

  const {
    data: program,
    isLoading,
    refetch
  } = useQuery<Program | null>({
    queryKey: ['academic/programs', params.programId],
    queryFn: async () => {
      const res = await api.get<Program>(
        'academic/programs/' + params.programId
      )
      if (!res.ok) return null
      return new Program(res.data)
    }
  })

  const breadcrumbsComp = React.useMemo(() => {
    return <Breadcrumbs breadcrumbs={breadcrumbs} />
  }, [breadcrumbs])

  React.useEffect(() => {
    const [one, two, three, four] = pathname.split('/').slice(4)

    if (one && program) {
      setBreadcrumbs([
        {
          name: program.name,
          to: `/m/academic/programs`
        }
      ])
    }

    if (two) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[two as keyof typeof PATHNAMES] ?? two,
          to: `/m/academic/programs/${program?.id}/plans`
        }
      ])
    }

    if (three && plan) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: plan.name,
          to: `/m/academic/programs/${program?.id}/plans`
        }
      ])
    }

    if (four) {
      setBreadcrumbs((prev) => [
        ...prev,
        {
          name: PATHNAMES[four as keyof typeof PATHNAMES] ?? four,
          to: `/m/academic/programs/${program?.id}/plans/${plan?.id}/courses`
        }
      ])
    }
  }, [pathname, program, plan])

  if (isLoading)
    return (
      <div className="w-full grow place-content-center grid">
        <Spinner size="large" />
      </div>
    )

  if (!program)
    return (
      <div className="w-full text-center grow place-content-center grid">
        <p className="py-2 font-medium">Not found</p>
        <Button onClick={() => refetch()} size="small" className="mx-auto">
          Reload
        </Button>
      </div>
    )

  return (
    <ContextSlugPrograms.Provider
      value={{ breadcrumbsComp, program, setPlan, plan }}
    >
      <Outlet />
    </ContextSlugPrograms.Provider>
  )
}
