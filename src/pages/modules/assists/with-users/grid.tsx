import { format } from '~/lib/dayjs'
import { Avatar, Button } from '@fluentui/react-components'
import { CalendarRegular } from '@fluentui/react-icons'
import React from 'react'
import { AssistWithUser } from '~/types/assist-withuser'
import { Link } from 'react-router'
import UserHoverInfo from '~/components/user-hover-info'

export default function AssistsGrid({
  assists
}: {
  assists: AssistWithUser[]
}) {
  const [startSlice] = React.useState(0)
  const [endSlice, setEndSlice] = React.useState(15)

  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <div className="pt-3 overflow-auto">
      <table className="w-full relative">
        <thead className="">
          <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
            <td>Persona</td>
            <td>Biometrico</td>
            <td>Fecha</td>
            <td>Hora</td>
          </tr>
        </thead>

        <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
          {assists.slice(startSlice, endSlice).map((assist, key) => (
            <tr
              key={key}
              className="relative [&>td]:py-2 even:bg-stone-500/20 [&>td]:text-nowrap transition-colors [&>td]:px-3 bg-stone-900 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
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
                      <p className="text-xs opacity-60">{assist.user.email}</p>
                    </div>
                  </div>
                </UserHoverInfo>
              </td>
              <td>
                <p>{assist.terminal.name}</p>
              </td>
              <td>
                <p className="capitalize">
                  {format(assist.datetime, 'MMMM D, YYYY')}
                </p>
              </td>
              <td>{format(assist.datetime, 'h:mm A')}</td>
            </tr>
          ))}
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
