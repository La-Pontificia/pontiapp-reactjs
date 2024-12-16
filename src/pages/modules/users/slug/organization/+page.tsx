import React from 'react'
import { Helmet } from 'react-helmet'
import { useSlugUser } from '../+layout'
import { User } from '~/types/user'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { Badge } from '@fluentui/react-components'
import { PersonItem } from './person'

export default function UsersSlugOrganizationPage() {
  const params = useParams<{
    slug: string
  }>()

  const { user } = useSlugUser()
  const [slug, setSlug] = React.useState<string | undefined>(params.slug)

  const { data, isLoading } = useQuery<User | null>({
    queryKey: ['organization', slug],
    queryFn: async () => {
      const URL = `users/${slug}/organization
          ?limitCoworkers=23&limitSubordinates=50
          `
      const res = await api.get<User>(URL.replace(/\s/g, ''))
      if (!res.ok) return null
      return new User(res.data)
    },
    gcTime: 1000 * 60 * 60 * 5
  })

  return (
    <div className="flex flex-col flex-grow">
      <Helmet>
        <title>
          {user ? user.displayName + ' -' : ''} Organizaciones | Ponti App
        </title>
      </Helmet>
      <div className="max-w-5xl px-4 py-3 dark:text-neutral-400 w-full mx-auto">
        <div className="flex items-center gap-1">
          <p>
            Jerarquía visual de la organización de {user?.displayName} {}
          </p>
          {
            // Not show badge if date is greater than 2025
            new Date() < new Date('2025-01-01') && (
              <Badge color="success" appearance="tint">
                Preview
              </Badge>
            )
          }
        </div>
      </div>
      <div className="max-w-5xl flex-grow py-5 px-4 mx-auto w-full flex flex-col items-center">
        {isLoading && (
          <>
            <SkeletonPersonItem />
            <SkeletonPersonItem />
            <SkeletonPersonItem />
          </>
        )}
        {data && (
          <>
            <PersonItem setSlug={setSlug} index={1} person={data} />

            {data.subordinates.length > 0 && (
              <div className="max-w-5xl w-full pt-4">
                <h2 className="text-xs pb-2 max-md:pt-2">
                  Personas reportando a {data?.displayName}
                </h2>
                <div className="grid p-2 rounded-xl bg-stone-500/10 grid-cols-3 gap-3">
                  {data?.subordinates?.map((person, index) => (
                    <PersonItem
                      key={person.id}
                      index={index}
                      single
                      person={person}
                      setSlug={setSlug}
                    />
                  ))}
                </div>
              </div>
            )}

            {data.coworkers.length > 0 && (
              <div className="max-w-5xl w-full py-4">
                <h2 className="text-xs pb-2 max-md:pt-2">
                  {data?.displayName} trabaja con
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {data.coworkers.map((person, index) => (
                    <PersonItem
                      key={person.id}
                      index={index}
                      single
                      setSlug={setSlug}
                      person={person}
                    />
                  ))}
                </div>
                <p className="text-xs dark:text-neutral-400 pt-2">
                  Pueda que no se muestren todos los colaboradores.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="max-w-5xl px-4 py-3 text-xs dark:text-neutral-400 w-full mx-auto">
        <p>Presiona en un colaborador para ver su organización. </p>
      </div>
    </div>
  )
}

const SkeletonPersonItem = () => (
  <div className="h-[72px] mb-[20px] w-[318px] bg-stone-500/10 flex items-center rounded-xl px-3 gap-3 animate-pulse">
    <div className="aspect-square  delay-700 w-[48px] rounded-full bg-stone-500/10"></div>
    <div className="h-[10px] delay-200 w-[50px] rounded-full bg-stone-500/10"></div>
  </div>
)
