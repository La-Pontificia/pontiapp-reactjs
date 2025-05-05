/* eslint-disable react-refresh/only-export-components */
import { Avatar, Button, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link, Outlet, useParams } from 'react-router'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { EdaYear } from '@/types/eda-year'
import { User } from '@/types/user'

type SlugCollaboratorState = {
  collaborator: User
  years: EdaYear[]
}

export const SlugCollaboratorContext =
  React.createContext<SlugCollaboratorState>({} as SlugCollaboratorState)
export default function SlugCollaboratorsLayout() {
  const { user: authUser } = useAuth()
  const params = useParams<{
    slug: string
    slugYear: string
  }>()

  const {
    data: years,
    isLoading: isLoadingYears,
    refetch: refetchYears
  } = useQuery<EdaYear[] | null>({
    queryKey: ['edas/years'],
    queryFn: async () => {
      const res = await api.get<EdaYear[]>('edas/years')
      if (!res.ok) return null
      return res.data.map((i) => new EdaYear(i))
    }
  })

  const {
    data: user,
    isLoading: isUserLoading,
    refetch
  } = useQuery<User | null>({
    queryKey: ['edas/collaborators', params.slug],
    queryFn: async () => {
      const res = await api.get<User>(
        'edas/collaborators/' + params.slug + '?relationship=manager'
      )
      if (!res.ok) return null
      return new User(res.data)
    }
  })

  if (isLoadingYears || isUserLoading)
    return (
      <div className="grid place-content-center font-semibold space-y-3 h-full w-full">
        <Spinner />
        <h2>Cargando, por favor espere</h2>
      </div>
    )

  if (!user)
    return (
      <div className="p-5 text-center h-full grid place-content-center flex-col items-center font-semibold gap-3 w-full">
        User not found
        <Button size="small" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )

  if (!years)
    return (
      <div className="p-5 text-center h-full grid place-content-center flex-col items-center font-semibold gap-3 w-full">
        Years not found
        <Button size="small" onClick={() => refetchYears()}>
          Retry
        </Button>
      </div>
    )

  if (!user.manager && !isUserLoading && !authUser.isDeveloper)
    return (
      <div className="p-5 text-center h-full grid place-content-center flex-col items-center font-semibold gap-3 w-full">
        {user.displayName} no tiene un supervisor asignado.
      </div>
    )

  return (
    <SlugCollaboratorContext.Provider
      value={{
        collaborator: user,
        years: years
      }}
    >
      <div className="flex flex-col h-full flex-grow overflow-auto">
        <nav className="w-full gap-4 px-5 py-3">
          <div className="flex-grow flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Avatar
                name={user.displayName}
                image={{
                  src: user.photoURL
                }}
                size={40}
                color="colorful"
              />
              <h2 className="font-semibold text-xl pr-2">{user.displayName}</h2>
            </div>
            {years?.map((year) => (
              <Link
                to={`/m/edas/${params.slug}/${year.id}`}
                data-active={year.id === params.slugYear ? '' : undefined}
                key={year.id}
                className="border text-nowrap outline outline-2 outline-transparent data-[active]:border-transparent data-[active]:dark:border-transparent data-[active]:outline-blue-600 data-[active]:dark:outline-blue-600 data-[active]:bg-blue-700/10 data-[active]:dark:bg-blue-700/20 border-stone-300 dark:border-stone-500 rounded-full py-1 px-3 font-medium"
              >
                {year.name}
              </Link>
            ))}
          </div>
        </nav>
        <Outlet />
      </div>
    </SlugCollaboratorContext.Provider>
  )
}
