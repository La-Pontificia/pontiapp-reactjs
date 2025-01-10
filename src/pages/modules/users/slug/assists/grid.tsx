import { Badge, Button } from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import React from 'react'
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
            <td>Fecha</td>
            <td className="border-l border-neutral-500/30 text-center">
              Horario AM
            </td>
            <td className="border-r border-neutral-500/30 text-center">
              Marcaciones AM
            </td>
            <td className="text-center">Horario PM</td>
            <td className="text-center">Marcaciones PM</td>
          </tr>
        </thead>

        <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
          {assists.slice(startSlice, endSlice).map((assist, key) => {
            const arriveMorningLate =
              assist.morningMarkedIn &&
              new Date(assist.morningMarkedIn) > new Date(assist.morningFrom)

            const outMorningBefore =
              assist.morningMarkedOut &&
              new Date(assist.morningMarkedOut) < new Date(assist.morningTo)

            const arriveAfternoonLate =
              assist.afternoonMarkedIn &&
              new Date(assist.afternoonMarkedIn) >
                new Date(assist.afternoonFrom)

            const outAfternoonBefore =
              assist.afternoonMarkedOut &&
              new Date(assist.afternoonMarkedOut) < new Date(assist.afternoonTo)

            return (
              <tr
                key={key}
                className="relative bg-neutral-50/40 dark:bg-neutral-900 odd:bg-neutral-500/10 dark:even:bg-neutral-500/20 [&>td]:text-nowrap  group [&>td]:p-4 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
              >
                <td>
                  <div className="flex items-center capitalize">
                    <CalendarRegular
                      fontSize={23}
                      className="mr-1 opacity-60"
                    />
                    {format(assist.date, 'dddd, DD [de] MMMM')}
                  </div>
                </td>
                <td className="border-l border-neutral-500/30 text-center">
                  {assist.morningFrom && (
                    <p className="font-medium">
                      <ClockRegular fontSize={23} className="mr-1 opacity-60" />
                      {assist.morningFrom
                        ? format(assist.morningFrom, 'h:mm A')
                        : 'N/A'}
                      {' - '}
                      {assist.morningTo
                        ? format(assist.morningTo, 'h:mm A')
                        : 'N/A'}
                    </p>
                  )}
                </td>
                <td className="border-r border-neutral-500/30 text-center">
                  {assist.morningFrom && (
                    <div className="flex gap-2 justify-center">
                      <Badge
                        color={
                          !assist.morningMarkedIn
                            ? 'informative'
                            : arriveMorningLate
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {assist.morningMarkedIn
                          ? format(assist.morningMarkedIn, 'h:mm A')
                          : 'N/A'}
                      </Badge>

                      <Badge
                        color={
                          !assist.morningMarkedOut
                            ? 'informative'
                            : outMorningBefore
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {assist.morningMarkedOut
                          ? format(assist.morningMarkedOut, 'h:mm A')
                          : 'N/A'}
                      </Badge>
                    </div>
                  )}
                </td>
                <td>
                  {assist.afternoonFrom && (
                    <p className="font-medium text-center">
                      <ClockRegular fontSize={23} className="mr-1 opacity-60" />
                      {assist.afternoonFrom
                        ? format(assist.afternoonFrom, 'h:mm A')
                        : 'N/A'}
                      {' - '}
                      {assist.afternoonTo
                        ? format(assist.afternoonTo, 'h:mm A')
                        : 'N/A'}
                    </p>
                  )}
                </td>
                <td>
                  {assist.afternoonFrom && (
                    <div className="flex gap-2 justify-center">
                      <Badge
                        color={
                          !assist.afternoonMarkedIn
                            ? 'informative'
                            : arriveAfternoonLate
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {assist.afternoonMarkedIn
                          ? format(assist.afternoonMarkedIn, 'h:mm A')
                          : 'N/A'}
                      </Badge>

                      <Badge
                        color={
                          !assist.afternoonMarkedOut
                            ? 'informative'
                            : outAfternoonBefore
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {assist.afternoonMarkedOut
                          ? format(assist.afternoonMarkedOut, 'h:mm A')
                          : 'N/A'}
                      </Badge>
                    </div>
                  )}
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
            Mostrar 15 horarios más.
          </Button>
        </div>
      )}
    </div>
  )
}
