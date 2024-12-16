import { days } from '~/const'
import { countRangeMinutes, format, formatTime } from '~/lib/dayjs'
import { Schedule } from '~/types/schedule'
import { Badge } from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'

export const ScheduleItem = ({ schedule }: { schedule: Schedule }) => {
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
