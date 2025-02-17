import { Helmet } from 'react-helmet'
import { useSlugUser } from '../+layout'
import { Link, useParams } from 'react-router'
import { Schedule } from '~/types/schedule'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { cn } from '~/utils'
import { ScheduleItem } from './schedule'
import { PenRegular } from '@fluentui/react-icons'
import { useAuth } from '~/store/auth'

export default function UsersSlugSchedulesPage() {
  const params = useParams<{
    slug: string
  }>()

  const { user } = useSlugUser()
  const slug = params.slug
  const { user: authUser } = useAuth()

  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ['schedules', slug],
    queryFn: async () => {
      const res = await api.get<Schedule[]>(
        `users/schedules/${slug}?archived=false`
      )
      if (!res.ok) return []
      return res.data.map((d) => new Schedule(d))
    }
  })

  const countSchedules = schedules?.length || 0

  return (
    <div className="max-w-7xl px-4 mx-auto w-full">
      <Helmet>
        <title>
          {user ? user.displayName + ' -' : ''} Horarios | Ponti App
        </title>
      </Helmet>
      <div className="flex items-center gap-2 justify-between">
        <p className="py-4 opacity-70">
          Horarios activos de {user ? user.displayName : '...'}
        </p>

        {!isLoading && authUser.hasPrivilege('users:edit') && (
          <Link
            to={`/m/users/${user?.username}/edit`}
            className="flex items-center hover:underline text-xs gap-2"
          >
            <PenRegular fontSize={20} />
            Editar horarios
          </Link>
        )}
      </div>
      <div>
        {!isLoading && countSchedules === 0 && (
          <div className="p-10 bg-neutral-500/10 rounded-lg">
            <p className="text-center">No hay horarios activos</p>
          </div>
        )}
        <div
          className={cn(
            'grid gap-4 mt-2 grid-cols-1',
            countSchedules === 0 && 'xl:grid-cols-3 lg:grid-cols-2',
            countSchedules === 2 && 'lg:grid-cols-2',
            countSchedules > 2 && 'xl:grid-cols-3 lg:grid-cols-2'
          )}
        >
          {isLoading ? (
            <>
              <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
              <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
              <div className="min-h-[99px] w-full bg-neutral-500/10 animate-pulse rounded-lg" />
            </>
          ) : (
            schedules?.map((schedule) => (
              <ScheduleItem key={schedule.id} schedule={schedule} />
            ))
          )}
        </div>
        <div className="py-4 px-1 dark:text-neutral-300 text-xs">
          Solo son visibles los horarios activos.
        </div>
      </div>
    </div>
  )
}
