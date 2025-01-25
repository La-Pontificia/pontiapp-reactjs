import { Avatar, Badge, Button } from '@fluentui/react-components'
import {
  CalendarRegular,
  ClockRegular,
  CloudDatabaseRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'
import UserHoverInfo from '~/components/user-hover-info'
import { format } from '~/lib/dayjs'
import { RestAssist } from '~/types/rest-assist'

export default function RestAssistsGrid({ data }: { data: RestAssist[] }) {
  const assists = data.map((item) => new RestAssist(item))

  const [startSlice] = React.useState(0)
  const [endSlice, setEndSlice] = React.useState(15)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <div className="overflow-auto">
      <p className="px-2 pb-1 text-xs text-yellow-500">
        Registros de asistencias que el sistema no pudo procesar.
      </p>
      <table className="w-full relative">
        <thead className="">
          <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
            <td>Persona</td>
            <td>Terminal</td>
            <td>Fecha</td>
            <td>Dia</td>
            <td>Hora</td>
          </tr>
        </thead>

        <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
          {assists.slice(startSlice, endSlice).map((assist, key) => {
            return (
              <tr
                key={key}
                className="relative bg-white dark:bg-[#2a2826] [&>td]:text-nowrap group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
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
                          className="hover:underline font-semibold"
                        >
                          {assist.user.displayName}
                        </Link>
                      </div>
                    </div>
                  </UserHoverInfo>
                </td>
                <td>
                  <div className="flex items-center gap-1 font-semibold opacity-90">
                    <CloudDatabaseRegular fontSize={25} />
                    {assist.terminal.name}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <CalendarRegular fontSize={20} />
                    {format(assist.datetime, 'dddd, DD [de] MMMM')}
                  </div>
                </td>
                <td>
                  <p className="capitalize">
                    {format(assist.datetime, 'dddd')}{' '}
                  </p>
                </td>
                <td>
                  <div className="flex gap-2 items-center">
                    <ClockRegular fontSize={20} />
                    <p>{format(assist.datetime, 'h:mm A')}</p>
                  </div>
                </td>
                <td>
                  <Badge color="important">Sin procesar</Badge>
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
