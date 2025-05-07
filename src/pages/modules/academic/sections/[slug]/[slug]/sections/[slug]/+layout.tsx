import { Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { Outlet, useParams } from 'react-router'
import { api } from '@/lib/api'
import React from 'react'
import { useSlugSection } from '../../../+layout'
import { Section } from '@/types/academic/section'

export default function SectionProgramCoursesSlugLayout() {
  const params = useParams()

  const { program, setSection } = useSlugSection()
  const { data, isLoading, refetch } = useQuery<Section | null>({
    queryKey: ['academic/sections', params.sectionId],
    queryFn: async () => {
      const res = await api.get<Section>(
        'academic/sections/' + params.sectionId
      )
      if (!res.ok) return null
      return new Section(res.data)
    }
  })

  React.useEffect(() => {
    if (data) setSection?.(data)
  }, [data, setSection])

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
