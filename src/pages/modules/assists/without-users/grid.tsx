import { format } from '~/lib/dayjs'
import {
  Avatar,
  Table,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import { AssistSingle } from './+page'
import React from 'react'
import { AssistTerminal } from '~/types/assist-terminal'
import Pagination from '~/commons/pagination'

export default function AssistsGrid({
  assists,
  assistTerminals
}: {
  assists: AssistSingle[]
  assistTerminals: AssistTerminal[]
}) {
  const [slices, setSlices] = React.useState([0, 40])
  const [page, setPage] = React.useState(1)

  const links = React.useMemo(() => {
    const links = []
    for (let i = 1; i <= Math.ceil(assists.length / 40); i++) {
      links.push({
        label: String(i),
        url: `?page=${i}`,
        active: page === i
      })
    }
    setSlices([(page - 1) * 40, page * 40])
    return links
  }, [assists.length, page])

  return (
    <div className="pt-3 overflow-auto flex flex-col">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Persona</TableHeaderCell>
              <TableHeaderCell>Biometrico</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Hora</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <tbody>
            {assists.slice(slices[0], slices[1]).map((assist, key) => (
              <TableRow key={key}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      color="colorful"
                      size={32}
                      name={`${assist.firstNames} ${assist.lastNames}`}
                      icon={<CalendarRegular />}
                    />
                    <div>
                      <p className="font-semibold">
                        {assist.firstNames} {assist.lastNames}
                      </p>
                      <p className="text-xs opacity-60">{assist.documentId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p>
                    {
                      assistTerminals.find(
                        (terminal) => terminal.id === assist.terminalId
                      )?.name
                    }
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CalendarRegular fontSize={20} />
                    {format(assist.datetime, 'MMMM D, YYYY')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ClockRegular fontSize={20} />
                    {format(assist.datetime, 'h:mm A')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
      <Pagination
        state={{
          current_page: page,
          from: slices[0] + 1,
          links: [
            {
              label: 'Prev',
              url: '/',
              active: true
            },
            ...links,
            {
              label: 'Next',
              url: '/',
              active: true
            }
          ],
          to: slices[1],
          total: assists.length,
          first_page_url: '',
          last_page_url: '/',
          last_page: Math.ceil(assists.length / 50),
          prev_page_url: '/',
          next_page_url: '/',
          path: '',
          per_page: 50
        }}
        onChangePage={(page) => setPage(page)}
      />
    </div>
  )
}
