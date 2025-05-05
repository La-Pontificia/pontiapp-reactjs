import { format } from '@/lib/dayjs'
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import React from 'react'
import { AssistWithUser } from '@/types/assist-withuser'
import { Link } from 'react-router'
import UserHoverInfo from '@/components/user-hover-info'
import Pagination from '@/commons/pagination'

export default function AssistsGrid({
  assists
}: {
  assists: AssistWithUser[]
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

          <TableBody>
            {assists.slice(slices[0], slices[1]).map((assist, key) => (
              <TableRow key={key}>
                <TableCell>
                  <UserHoverInfo slug={assist.user.username}>
                    <div className="flex items-center gap-2">
                      <Avatar
                        color="colorful"
                        size={32}
                        name={assist.user.displayName}
                        icon={<CalendarRegular />}
                      />
                      <div>
                        <Link
                          to={'/' + assist.user.username}
                          className="hover:underline font-semibold dark:text-white"
                        >
                          {assist.user.displayName}
                        </Link>
                      </div>
                    </div>
                  </UserHoverInfo>
                </TableCell>
                <TableCell>
                  <p>{assist.terminal.name}</p>
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
          </TableBody>
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
