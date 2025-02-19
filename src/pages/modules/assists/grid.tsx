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
import { CalendarRegular, ClockRegular } from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'
import Pagination from '~/commons/pagination'
import UserHoverInfo from '~/components/user-hover-info'
import { format } from '~/lib/dayjs'
import { Assist } from '~/types/assist'

export default function AssistsGrid({ data }: { data: Assist[] }) {
  const assists = data.map((item) => new Assist(item))
  const [slices, setSlices] = React.useState([0, 50])
  const [page, setPage] = React.useState(1)

  const links = React.useMemo(() => {
    const links = []
    for (let i = 1; i <= Math.ceil(assists.length / 50); i++) {
      links.push({
        label: String(i),
        url: `?page=${i}`,
        active: page === i
      })
    }
    setSlices([(page - 1) * 50, page * 50])
    return links
  }, [assists.length, page])

  return (
    <div className="overflow-auto flex flex-col">
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Colaborador</TableHeaderCell>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Horario AM</TableHeaderCell>
              <TableHeaderCell>Marcaciones AM</TableHeaderCell>
              <TableHeaderCell>Horario PM</TableHeaderCell>
              <TableHeaderCell>Marcaciones PM</TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {assists.slice(slices[0], slices[1]).map((assist, key) => {
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
                new Date(assist.afternoonMarkedOut) <
                  new Date(assist.afternoonTo)

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
                    <div className="flex items-center">
                      <CalendarRegular
                        fontSize={23}
                        className="mr-1 opacity-60"
                      />
                      {format(assist.date, 'dddd, DD [de] MMMM')}
                    </div>
                  </TableCell>
                  <TableCell>
                    {assist.morningFrom && (
                      <p className="font-medium">
                        <ClockRegular
                          fontSize={23}
                          className="mr-1 opacity-60"
                        />
                        {assist.morningFrom
                          ? format(assist.morningFrom, 'h:mm A')
                          : 'No marcó'}
                        {' - '}
                        {assist.morningTo
                          ? format(assist.morningTo, 'h:mm A')
                          : 'No marcó'}
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
                        <ClockRegular
                          fontSize={23}
                          className="mr-1 opacity-60"
                        />
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
