import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router'
import { api } from '@/lib/api'
import { Plan } from '@/types/academic/plan'
import { useSlugProgram } from '../../+layout'
import React from 'react'

export default function LayoutSlugPlan() {
  const params = useParams()

  const { setPlan } = useSlugProgram()
  const { data, isLoading, refetch } = useQuery<Plan | null>({
    queryKey: ['academic/plans', params.planId],
    queryFn: async () => {
      const res = await api.get<Plan>('academic/plans/' + params.planId)
      if (!res.ok) return null
      return new Plan(res.data)
    }
  })

  React.useEffect(() => {
    if (data) setPlan?.(data)
  }, [data, setPlan])

  if (isLoading)
    return (
      <div className="w-full grow place-content-center grid">
        <Spinner size="large" />
      </div>
    )

  if (!data)
    return (
      <div className="w-full text-center grow place-content-center grid">
        <p className="py-2 font-medium">Not found</p>
        <Button onClick={() => refetch()} size="small" className="mx-auto">
          Reload
        </Button>
      </div>
    )

  return <Outlet />
}
