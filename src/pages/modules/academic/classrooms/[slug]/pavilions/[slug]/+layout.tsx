import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router'
import { api } from '@/lib/api'
import React from 'react'
import { useSlugClassroom } from '../../+layout'
import { Pavilion } from '@/types/academic/pavilion'

export default function PavilionSlugLayout() {
  const params = useParams()

  const { setPavilion } = useSlugClassroom()
  const { data, isLoading, refetch } = useQuery<Pavilion | null>({
    queryKey: ['academic/pavilions', params.pavilionId],
    queryFn: async () => {
      const res = await api.get<Pavilion>(
        'academic/pavilions/' + params.pavilionId
      )
      if (!res.ok) return null
      return new Pavilion(res.data)
    }
  })

  React.useEffect(() => {
    if (data) setPavilion(data)
    return () => {
      setPavilion(null)
    }
  }, [data, setPavilion])

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
