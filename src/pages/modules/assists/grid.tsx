import { Avatar, Badge, Button } from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'
import UserHoverInfo from '~/components/user-hover-info'
import { format } from '~/lib/dayjs'
import { Assist } from '~/types/assist'

export default function AssistsGrid({ assists }: { assists: Assist[] }) {
  const [startSlice] = React.useState(0)
  const [endSlice, setEndSlice] = React.useState(15)

  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <div className="overflow-auto">
      <table className="w-full relative">
        <thead className="">
          <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
            <td>Persona</td>
            <td>Terminal</td>
            <td>Fecha</td>
            <td>Dia</td>
            <td>Horario</td>
            <td>Entró</td>
            <td>Salió</td>
          </tr>
        </thead>

        <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
          {assists.slice(startSlice, endSlice).map((assist, key) => {
            const arriveLate =
              assist.markedIn &&
              new Date(assist.markedIn) > new Date(assist.from)

            const outBefore =
              assist.markedOut &&
              new Date(assist.markedOut) < new Date(assist.to)

            return (
              <tr
                key={key}
                className="relative [&>td]:py-2 even:bg-stone-500/20 [&>td]:text-nowrap  [&>td]:px-3 bg-stone-900 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
              >
                <td>
                  <UserHoverInfo slug={assist.user.username}>
                    <div className="flex items-center gap-2">
                      <Avatar
                        color="colorful"
                        size={40}
                        name={assist.user.displayName}
                        icon={<CalendarRegular />}
                      />
                      <div>
                        <Link
                          to={'/' + assist.user.username}
                          className="hover:underline dark:text-blue-500"
                        >
                          {assist.user.displayName}
                        </Link>
                        <p className="text-xs opacity-60">
                          {assist.user.email}
                        </p>
                      </div>
                    </div>
                  </UserHoverInfo>
                </td>
                <td>
                  <p>{assist.terminal?.name}</p>
                </td>
                <td>
                  <div className="flex items-center capitalize gap-2">
                    <CalendarRegular fontSize={20} />
                    {format(assist.date, 'MMMM D, YYYY')}
                  </div>
                </td>
                <td>
                  <p className="capitalize">{format(assist.from, 'dddd')} </p>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <ClockRegular fontSize={20} />
                    <p>
                      {format(assist.from, 'h:mm A')}
                      {' - '}
                      {format(assist.to, 'h:mm A')}
                    </p>
                  </div>
                </td>
                <td>
                  <Badge
                    color={
                      assist.markedIn
                        ? arriveLate
                          ? 'warning'
                          : 'success'
                        : 'danger'
                    }
                    appearance="filled"
                  >
                    {assist.markedIn
                      ? format(assist.markedIn, 'h:mm A')
                      : 'N/A'}
                  </Badge>
                </td>
                <td>
                  <Badge
                    color={
                      assist.markedOut
                        ? outBefore
                          ? 'warning'
                          : 'success'
                        : 'danger'
                    }
                    appearance="filled"
                  >
                    {assist.markedOut
                      ? format(assist.markedOut, 'h:mm A')
                      : 'N/A'}
                  </Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {assists.length > 15 && endSlice < assists.length && (
        <div className="flex p-3 justify-center">
          <Button
            ref={buttonRef}
            onClick={() => {
              setEndSlice(endSlice + 15)
              buttonRef.current?.focus?.()
            }}
          >
            Mostrar 15 registros más.
          </Button>
        </div>
      )}
    </div>
  )
}
