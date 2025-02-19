import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import React from 'react'
import { format } from '~/lib/dayjs'
import { Assist } from '~/types/assist'

export default function AssistsGrid({ assists }: { assists: Assist[] }) {
  const [startSlice] = React.useState(0)
  const [endSlice, setEndSlice] = React.useState(15)

  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Table className="w-full relative ">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Horario AM</TableHeaderCell>
            <TableHeaderCell>Marcaciones AM</TableHeaderCell>
            <TableHeaderCell>Horario PM</TableHeaderCell>
            <TableHeaderCell>Marcaciones PM</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
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
              <TableRow key={key}>
                <TableCell>
                  <div className="flex items-center capitalize">
                    <CalendarRegular fontSize={23} className="mr-1" />
                    {format(assist.date, 'dddd DD MMM')}
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {assist.morningFrom && (
                    <div className="flex gap-2">
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
                          : 'No marcó'}
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
                          : 'No marcó'}
                      </Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {assist.afternoonFrom && (
                    <p className="font-medium">
                      <ClockRegular fontSize={23} className="mr-1 " />
                      {assist.afternoonFrom
                        ? format(assist.afternoonFrom, 'h:mm A')
                        : 'No marcó'}
                      {' - '}
                      {assist.afternoonTo
                        ? format(assist.afternoonTo, 'h:mm A')
                        : 'No marcó'}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {assist.afternoonFrom && (
                    <div className="flex gap-2 ">
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
                          : 'No marcó'}
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
                          : 'No marcó'}
                      </Badge>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
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
    </>
  )
}
