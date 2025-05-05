import { api } from '@/lib/api'
import { User } from '@/types/user'
import { Avatar, Spinner, Tooltip } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useSlugUser } from '../+layout'
import { useMediaQuery } from '@uidotdev/usehooks'

export default function QuickOrganization({ slug }: { slug?: string }) {
  const { user, rootURL } = useSlugUser()
  const { data, isLoading } = useQuery<{
    manager: User | null
    coworkers: User[]
    subordinates: User[]
  }>({
    queryKey: ['quick-organization', slug],
    queryFn: async () => {
      const URL = `users/${slug}/downOrganization
          
          ?relationshipCoworkers=role
          &relationshipSubordinates=role
          &relationshipManager=role

          &limitCoworkers=4&limitSubordinates=4&dinamic=true
          `
      const res = await api.get<{
        manager: User | null
        coworkers: User[]
        subordinates: User[]
      }>(URL.replace(/\s/g, ''))
      if (!res.ok)
        return {
          coworkers: [],
          subordinates: [],
          manager: null
        }

      return {
        coworkers: res.data.coworkers.map((d) => new User(d)),
        subordinates: res.data.subordinates.map((d) => new User(d)),
        manager: res.data.manager ? new User(res.data.manager) : null
      }
    },
    gcTime: 1000 * 60 * 60 * 5
  })
  if (isLoading)
    return (
      <div>
        <Spinner size="large" />
      </div>
    )
  if (!isLoading && !data) return <div>No data</div>

  const hasOrganization =
    data?.coworkers.length || data?.subordinates.length || data?.manager

  if (!hasOrganization) return null
  return (
    <div className="flex flex-col border-t overflow-auto border-neutral-500/30">
      <h2 className="dark:dark:text-neutral-400 font-semibold py-5 pb-2 text-sm">
        Organización
      </h2>
      <div className="flex w-full divide-x max-lg:divide-y max-lg:flex-col max-lg:gap-y-5 max-lg:divide-x-0 overflow-auto lg:first:[&>div]:pl-0 lg:[&>div]:px-3 lg:last:[&>div]:pr-0 divide-neutral-500/30">
        {data?.manager && (
          <div className="max-lg:w-full">
            <h2 className="text-xs pb-2 max-lg:pt-2">Bajo la supervision de</h2>
            <div className="max-lg:w-full">
              <PersonItem appearance="vertical" person={data?.manager} />
            </div>
          </div>
        )}
        {data.subordinates?.length > 0 && (
          <div className="lg:w-fit max-md:w-full">
            <h2 className="text-xs pb-2 max-lg:pt-2">Personas reportando</h2>
            <div className="flex max-lg:flex-col">
              {data?.subordinates.map((subordinate) => (
                <PersonItem
                  key={subordinate.id}
                  appearance="vertical"
                  person={subordinate}
                />
              ))}
            </div>
          </div>
        )}
        {data.coworkers?.length > 0 && (
          <div className="overflow-auto">
            <h2 className="text-xs pb-2 max-lg:pt-2">Trabaja junto a</h2>
            <div className="flex max-lg:flex-col">
              {data?.coworkers.map((coworker) => (
                <PersonItem
                  key={coworker.id}
                  appearance="vertical"
                  person={coworker}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-start mt-2">
        <Link
          to={`${rootURL}/${slug}/organization`}
          className="text-blue-500 hover:underline"
        >
          Ver toda la organización de {user?.displayName}
        </Link>
      </div>
    </div>
  )
}

const PersonItem = ({
  person
}: {
  person?: User | null
  appearance: 'vertical' | 'horizontal'
}) => {
  const isMediumDevice = useMediaQuery(
    'only screen and (min-width : 0px) and (max-width : 1023px)'
  )

  const { rootURL } = useSlugUser()
  if (!person) return null
  return (
    <Tooltip
      withArrow
      content={
        <div className="p-2">
          <div>
            {person.lastNames}, {person.firstNames}
          </div>
          <a
            href={`mailto:${person.email}`}
            className="dark:text-blue-400 text-blue-700 hover:underline"
          >
            {person.email}
          </a>
        </div>
      }
      relationship="description"
    >
      <Link
        to={`${rootURL}/${person.username}`}
        className="max-lg:gap-2 flex lg:justify-center lg:space-y-2 lg:w-[150px] lg:min-h-[165px] lg:min-w-[150px] lg:text-center dark:text-neutral-300 hover:bg-stone-500/5 dark:hover:bg-stone-500/20 py-3 lg:flex-col items-center px-2"
      >
        <Avatar
          size={isMediumDevice ? 40 : 64}
          color="colorful"
          name={person.displayName}
          image={{
            src: person.photoURL
          }}
        />
        <div className="text-xs flex flex-col justify-center space-y-1 max-lg:flex-grow">
          <h2 className="font-semibold line-clamp-1 text-sm lg:text-base dark:text-white">
            {person.displayName}
          </h2>
          <p className="opacity-80 line-clamp-2">{person.role?.name}</p>
        </div>
      </Link>
    </Tooltip>
  )
}
