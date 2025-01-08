import { Badge, Button } from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import React from 'react'
import { format } from '~/lib/dayjs'
import { RestAssist } from '~/types/assist'

export default function RestAssistsGrid({
  assists
}: {
  assists: RestAssist[]
}) {
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
            <td>Biométrico</td>
            <td>Fecha</td>
            <td>Día</td>
            <td>Hora</td>
            <td></td>
          </tr>
        </thead>

        <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
          {assists.slice(startSlice, endSlice).map((assist, key) => {
            return (
              <tr
                key={key}
                className="relative bg-neutral-50/40 dark:bg-neutral-900 odd:bg-neutral-500/10 dark:even:bg-neutral-500/20 [&>td]:text-nowrap  group [&>td]:p-4 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
              >
                <td>
                  <p>{assist.terminal.name}</p>
                </td>
                <td>
                  <div className="flex items-center capitalize gap-2">
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
