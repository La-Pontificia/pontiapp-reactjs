import { format } from '@/lib/dayjs'
import { Avatar } from '@fluentui/react-components'
import { CalendarRegular } from '@fluentui/react-icons'

const mockup = [
  {
    id: 1,
    schedule: {
      start: '2024-01-01 05:00:00',
      end: '2024-01-01 13:00:00'
    },
    user: {
      name: 'Juan Perez'
    },
    entry: '2024-01-01 05:12:00',
    exit: '2024-01-01 13:05:00'
  },
  {
    id: 2,
    schedule: {
      start: '2024-01-01 13:00:00',
      end: '2024-01-01 21:00:00'
    },
    user: {
      name: 'Maria Garcia'
    },
    entry: '2024-01-01 13:00:00',
    exit: '2024-01-01 21:00:00'
  },
  {
    id: 3,
    schedule: {
      start: '2024-01-02 06:00:00',
      end: '2024-01-02 14:00:00'
    },
    user: {
      name: 'Pedro Sanchez'
    },
    entry: '2024-01-02 06:30:00',
    exit: null
  },
  {
    id: 4,
    schedule: {
      start: '2024-01-03 07:00:00',
      end: '2024-01-03 15:00:00'
    },
    user: {
      name: 'Laura Martinez'
    },
    entry: null,
    exit: '2024-01-03 15:10:00'
  },
  {
    id: 5,
    schedule: {
      start: '2024-01-04 08:00:00',
      end: '2024-01-04 16:00:00'
    },
    user: {
      name: 'Carlos Lopez'
    },
    entry: '2024-01-04 08:15:00',
    exit: '2024-01-04 15:55:00'
  },
  {
    id: 6,
    schedule: {
      start: '2024-01-05 09:00:00',
      end: '2024-01-05 17:00:00'
    },
    user: {
      name: 'Ana Gonzalez'
    },
    entry: '2024-01-05 09:05:00',
    exit: '2024-01-05 17:20:00'
  },
  {
    id: 7,
    schedule: {
      start: '2024-01-06 10:00:00',
      end: '2024-01-06 18:00:00'
    },
    user: {
      name: 'Luis Ramirez'
    },
    entry: null,
    exit: null
  },
  {
    id: 8,
    schedule: {
      start: '2024-01-07 11:00:00',
      end: '2024-01-07 19:00:00'
    },
    user: {
      name: 'Sofia Torres'
    },
    entry: '2024-01-07 11:10:00',
    exit: '2024-01-07 18:50:00'
  },
  {
    id: 9,
    schedule: {
      start: '2024-01-08 05:30:00',
      end: '2024-01-08 13:30:00'
    },
    user: {
      name: 'Diego Fernandez'
    },
    entry: '2024-01-08 05:45:00',
    exit: '2024-01-08 13:20:00'
  },
  {
    id: 10,
    schedule: {
      start: '2024-01-09 06:30:00',
      end: '2024-01-09 14:30:00'
    },
    user: {
      name: 'Isabel Cruz'
    },
    entry: '2024-01-09 06:40:00',
    exit: '2024-01-09 14:35:00'
  }
]

export default function AssistsGrid() {
  return (
    <table className="w-full relative">
      <thead className="">
        <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
          <td>Horario</td>
          <td>Biometrico</td>
          <td>Usuario</td>
          <td>Entrada</td>
          <td>Salida</td>
          <td>Observaciones</td>
          <td></td>
        </tr>
      </thead>
      <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
        {mockup.map((assist) => (
          <tr
            key={assist.id}
            className="relative even:bg-stone-500/20 [&>td]:text-nowrap transition-colors group [&>td]:p-2.5 [&>td]:px-3 bg-stone-900 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
          >
            <td>
              <div className="flex items-center gap-2">
                <Avatar size={40} icon={<CalendarRegular />} />
                <div>
                  <h2 className="capitalize">
                    {format(assist.schedule.start, 'MMMM D, YYYY')}
                  </h2>
                  <p className="text-xs dark:text-blue-600">
                    {format(assist.schedule.start, 'h:mm A')} -{' '}
                    {format(assist.schedule.end, 'h:mm A')}
                  </p>
                </div>
              </div>
            </td>
            <td>
              <p>PL Alameda</p>
            </td>
            <td>
              <p className="">
                <span className="text-xs">Horario de </span>
                <a href="" className="hover:underline dark:text-blue-600">
                  {assist.user.name}
                </a>
              </p>
            </td>
            <td>
              <p className="text-xs">
                {assist.entry ? (
                  format(assist.entry, 'h:mm A')
                ) : (
                  <span className="text-red-500">Falta</span>
                )}
              </p>
            </td>
            <td>
              <p className="text-xs">
                {assist.exit ? (
                  format(assist.exit, 'h:mm A')
                ) : (
                  <span className="text-red-500">Falta</span>
                )}
              </p>
            </td>
            <td>-</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
