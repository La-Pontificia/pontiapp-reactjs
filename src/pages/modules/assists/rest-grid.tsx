import {
  Avatar,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import {
  CalendarRegular,
  ClockRegular,
  CloudDatabaseRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'
import Pagination from '@/commons/pagination'
import UserHoverInfo from '@/components/user-hover-info'
import { format } from '@/lib/dayjs'
import { RestAssist } from '@/types/rest-assist'

export default function RestAssistsGrid({ data }: { data: RestAssist[] }) {
  const assists = data.map((item) => new RestAssist(item))

  const [slices, setSlices] = React.useState([0, 30])
  const [page, setPage] = React.useState(1)

  const links = React.useMemo(() => {
    const links = []
    for (let i = 1; i <= Math.ceil(assists.length / 30); i++) {
      links.push({
        label: String(i),
        url: `?page=${i}`,
        active: page === i
      })
    }
    setSlices([(page - 1) * 30, page * 30])
    return links
  }, [assists.length, page])

  return (
    <div className="overflow-auto">
      <p className="px-2 pb-1 text-xs text-yellow-300">
        Registros de asistencias que el sistema no pudo procesar.
      </p>
      <Table>
        <TableHeader className="">
          <TableRow>
            <TableHeaderCell>Persona</TableHeaderCell>
            <TableHeaderCell>Terminal</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Dia</TableHeaderCell>
            <TableHeaderCell>Hora</TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {assists.slice(slices[0], slices[1]).map((assist, key) => {
            return (
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
                          className="hover:underline font-semibold"
                        >
                          {assist.user.displayName}
                        </Link>
                      </div>
                    </div>
                  </UserHoverInfo>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-semibold opacity-90">
                    <CloudDatabaseRegular fontSize={25} />
                    {assist.terminal.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
          last_page: Math.ceil(assists.length / 30),
          prev_page_url: '/',
          next_page_url: '/',
          path: '',
          per_page: 30
        }}
        onChangePage={(page) => setPage(page)}
      />
    </div>
  )
}
