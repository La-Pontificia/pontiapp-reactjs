/* eslint-disable react-refresh/only-export-components */
import { Button, Spinner } from '@fluentui/react-components'
import { ChevronRightFilled } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link, Outlet, useParams } from 'react-router'
import { api } from '@/lib/api'
import { Event } from '@/types/event'

type breadcrumb = {
  name: string
  to: string | null
}

type ContextSlugEventState = {
  event: Event
}

const ContextSlugEvent = React.createContext<ContextSlugEventState>(
  {} as ContextSlugEventState
)

export const useSlugEvent = () => React.useContext(ContextSlugEvent)

export default function EventSlugLayout() {
  const params = useParams()

  const {
    data: event,
    isLoading,
    refetch
  } = useQuery<Event | null>({
    queryKey: ['events', params.eventId],
    queryFn: async () => {
      const res = await api.get<Event>('events/' + params.eventId)
      if (!res.ok) return null
      return new Event(res.data)
    }
  })

  const breadcrumbs: breadcrumb[] = React.useMemo(() => {
    let breadcrumbs: breadcrumb[] = []
    if (!event) return []
    breadcrumbs = [
      { name: 'Eventos', to: '/m/events' },
      { name: event.name, to: `/m/events/${event.id}/records` }
    ]

    return breadcrumbs
  }, [event])

  if (isLoading)
    return (
      <div className="w-full grow place-content-center grid">
        <Spinner size="large" />
      </div>
    )

  if (!event)
    return (
      <div className="w-full text-center grow place-content-center grid">
        <p className="py-2 font-medium">Not found</p>
        <Button onClick={() => refetch()} size="small" className="mx-auto">
          Reload
        </Button>
      </div>
    )

  return (
    <ContextSlugEvent.Provider
      value={{
        event
      }}
    >
      <div className="flex flex-col overflow-auto grow p-1">
        <nav className="flex items-center gap-1 p-2">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <p className="text-lg">
                {index !== breadcrumbs.length - 1 ? (
                  <Link
                    className="hover:underline font-medium hover:text-blue-700 dark:hover:text-blue-400"
                    to={item.to ?? ''}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="opacity-50">{item.name}</span>
                )}
              </p>
              {index < breadcrumbs.length - 1 && (
                <span className="opacity-70">
                  <ChevronRightFilled fontSize={20} />
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <Outlet />
      </div>
    </ContextSlugEvent.Provider>
  )
}
