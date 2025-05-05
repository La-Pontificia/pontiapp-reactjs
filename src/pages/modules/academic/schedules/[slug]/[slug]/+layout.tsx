import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router'
import { api } from '@/lib/api'
import React from 'react'
import { Program } from '@/types/academic/program'
import { useSlugSchedules } from '../+layout'

export default function ScheduleProgramSlugLayout() {
  const params = useParams()

  const { program, setProgram } = useSlugSchedules()
  const { data, isLoading, refetch } = useQuery<Program | null>({
    queryKey: ['academic/programs', params.programId],
    queryFn: async () => {
      const res = await api.get<Program>(
        'academic/programs/' + params.programId
      )
      if (!res.ok) return null
      return new Program(res.data)
    }
  })

  React.useEffect(() => {
    if (data && !isLoading) setProgram?.(data)
    return () => setProgram(null)
  }, [data, setProgram, isLoading])


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



  return <Outlet />
}
