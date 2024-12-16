import { format } from '~/lib/dayjs'
import { Avatar, Button } from '@fluentui/react-components'
import { CalendarRegular } from '@fluentui/react-icons'
import { AssistSingle } from './+page'
import React from 'react'
import { AssistTerminal } from '~/types/assist-terminal'

export default function AssistsGrid({
  assists,
  assistTerminals
}: {
  assists: AssistSingle[]
  assistTerminals: AssistTerminal[]
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
              className="relative [&>td]:py-2 even:bg-stone-500/20 [&>td]:text-nowrap transition-colors group [&>td]:px-3 bg-stone-900 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
            >
              <td>
                <div className="flex items-center gap-2">
                  <Avatar
                    color="colorful"
                    size={40}
                    name={`${assist.firstNames} ${assist.lastNames}`}
                    icon={<CalendarRegular />}
                  />
                  <div>
                    <p>
                      {assist.firstNames} {assist.lastNames}
                    </p>
                    <p className="text-xs opacity-60">{assist.documentId}</p>
                  </div>
                </div>
              </td>
              <td>
                <p>
                  {
                    assistTerminals.find(
                      (terminal) => terminal.id === assist.terminalId
                    )?.name
                  }
                </p>
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
