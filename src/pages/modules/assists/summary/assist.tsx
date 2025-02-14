import { Avatar, Badge } from '@fluentui/react-components'
import { SingleAssistSummary } from './+page'
import { CalendarLtrRegular } from '@fluentui/react-icons'
import { format } from '~/lib/dayjs'

export default function Item({ item }: { item: SingleAssistSummary }) {
  return (
    <>
      <tr className="relative bg-white dark:bg-[#2a2826] [&>td]:text-nowrap group [&>td]:p-3 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
        <td>
          <div className="flex items-center gap-2">
            <CalendarLtrRegular fontSize={23} />
            <p className="line-clamp-3 capitalize">
              {format(item.date, 'dddd, D [de] MMMM [del] YYYY')}
            </p>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            <Avatar color="colorful" size={40} name={item.terminal.name} />
            <div>
              <p className="line-clamp-3">{item.terminal.name}</p>
              <p className="line-clamp-3 text-xs opacity-60">
                {item.terminal.database}
              </p>
            </div>
          </div>
        </td>
        <td>
          <Badge
            color={item.count > 0 ? 'success' : 'danger'}
            appearance="tint"
          >
            {item.count} asistencia{item.count > 1 ? 's' : ''}
          </Badge>
        </td>
      </tr>
    </>
  )
}
