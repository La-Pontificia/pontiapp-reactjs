import { days } from '@/const'
import { api } from '@/lib/api'
import { format, formatTime, countRangeMinutes } from '@/lib/dayjs'
import { Schedule } from '@/types/schedule'
import { cn } from '@/utils'
import { Badge } from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useSlugUser } from '../+layout'

export default function QuickSchedules({ slug }: { slug?: string }) {
  const { rootURL } = useSlugUser()
  const { data: schedules, isLoading } = useQuery<Schedule[]>({
    queryKey: ['quick-schedules', slug],
    queryFn: async () => {
      const res = await api.get<Schedule[]>(
        'users/' + slug + '/schedules?relationship=terminal&limit=3'
      )
      if (!res.ok) return []
      return res.data.map((d) => new Schedule(d))
    },
    gcTime: 1000 * 60 * 60 * 5
  })

  const countSchedules = schedules?.length || 0

  if (!isLoading && countSchedules === 0) return null
  return (
    <div className="flex flex-col border-b pb-4 border-neutral-500/30">
      <h2 className="text-neutral-400 py-2 text-lg">Horarios</h2>
      <div>
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
              <div className="min-h-[99px] w-full bg-stone-500/10 animate-pulse rounded-lg" />
              <div className="min-h-[99px] w-full bg-stone-500/10 animate-pulse rounded-lg" />
              <div className="min-h-[99px] w-full bg-stone-500/10 animate-pulse rounded-lg" />
            </>
          ) : (
            schedules?.map((schedule) => (
              <ScheduleItem key={schedule.id} schedule={schedule} />
            ))
          )}
        </div>
      </div>
      <div className="flex justify-start mt-2">
        <Link
          to={`${rootURL}/${slug}/schedules`}
          className="text-blue-500 hover:underline"
        >
          Ver todos los horarios
        </Link>
      </div>
    </div>
  )
}

const ScheduleItem = ({ schedule }: { schedule: Schedule }) => {
  return (
    <div className="schedule-item divide-y divide-neutral-500/30 dark:text-neutral-300 bg-stone-500/10 shadow-sm border-neutral-500/40 px-4 rounded-lg">
      <div className="py-2 flex items-center gap-3">
        <CalendarRegular fontSize={22} className="opacity-60" />
        <div className="justify-between flex-grow font-semibold">
          <span>Desde {format(schedule.startDate, 'DD/MM/YYYY')}</span>
          <p className="text-xs line-clamp-1 overflow-hidden text-ellipsis font-normal dark:text-neutral-400">
            Los días{' '}
            {schedule
              .days!.sort((a, b) => parseInt(a) - parseInt(b))
              .map((d) => days[d as keyof typeof days].short)
              .join(', ')}
          </p>
        </div>
        <Badge appearance="tint" color="brand">
          {schedule.terminal.name}
        </Badge>
      </div>
      <div className="py-3 flex items-center gap-3">
        <ClockRegular fontSize={22} className="opacity-60" />
        <div className="flex-grow">
          <p className="text-xs">
            {formatTime(schedule.from, 'h:mm A')} -{' '}
            {formatTime(schedule.to, 'h:mm A')} (
            {countRangeMinutes(schedule.from, schedule.to)})
          </p>
        </div>
      </div>
    </div>
  )
}
