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
import { format } from '@/lib/dayjs'
import { RestAssist } from '@/types/rest-assist'

export default function RestAssistsGrid({ data }: { data: RestAssist[] }) {
  const assists = data.map((item) => new RestAssist(item))
  const [startSlice] = React.useState(0)
  const [endSlice, setEndSlice] = React.useState(15)

  const buttonRef = React.useRef<HTMLButtonElement>(null)

  if (assists.length === 0) {
    return null
  }

  return (
    <div>
      <p className="px-2 pb-1 text-xs text-yellow-500">
        Registros de asistencias que el sistema no pudo procesar.
      </p>
      <Table className="w-full relative">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Biométrico</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Día</TableHeaderCell>
            <TableHeaderCell>Hora</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {assists.slice(startSlice, endSlice).map((assist, key) => {
            return (
              <TableRow key={key}>
                <TableCell>
                  <p>{assist.terminal.name}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center capitalize gap-2">
                    <CalendarRegular fontSize={20} />
                    {format(assist.datetime, 'dddd, DD [de] MMMM')}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="capitalize">
                    {format(assist.datetime, 'dddd')}{' '}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <ClockRegular fontSize={20} />
                    <p>{format(assist.datetime, 'h:mm A')}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color="important">Sin procesar</Badge>
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
            Mostrar 15 registros más.
          </Button>
        </div>
      )}
    </div>
  )
}
