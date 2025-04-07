import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled } from '@fluentui/react-icons'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '~/components/table'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import { ResponsePaginate } from '~/types/paginate-response'
import { Event } from '~/types/event'
import Item from './event'
import Form from './form'
import { useAuth } from '~/store/auth'
import SearchBox from '~/commons/search-box'
import Pagination from '~/commons/pagination'
import { TableContainer } from '~/components/table-container'

export default function EventsPage() {
  const { user: authUser } = useAuth()
  const [q, setQ] = React.useState<string>()
  const [page, setPage] = React.useState(1)

  const query = `events/all?paginate=true&relationship=recordsCount,creator${
    q ? `&q=${q}` : ''
  } ${page ? `&page=${page}` : ''}`
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Event[]
  > | null>({
    queryKey: ['events/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Event[]>>(query)
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((item) => new Event(item))
      }
    }
  })

  const { handleChange, value: searchValue } = useDebounced({
    delay: 500,
    onCompleted: (value) => setQ(value)
  })

  return (
    <TableContainer
      isLoading={isLoading}
      isEmpty={!data?.data?.length}
      nav={
        <nav className="flex items-center ">
          <h1 className="text-lg font-semibold grow">Eventos</h1>
          {authUser.hasPrivilege('events:create') && (
            <Form
              refetch={refetch}
              triggerProps={{
                disabled: isLoading,
                appearance: 'transparent',
                icon: (
                  <AddFilled className="dark:text-blue-500 text-blue-700" />
                ),
                children: 'Nuevo'
              }}
            />
          )}
          <SearchBox
            disabled={isLoading}
            value={searchValue}
            dismiss={() => {
              setQ(undefined)
              handleChange('')
            }}
            onChange={(e) => {
              if (e.target.value === '') setQ(undefined)
              handleChange(e.target.value)
            }}
            placeholder="Buscar evento"
          />
        </nav>
      }
      footer={
        data && (
          <Pagination state={data} onChangePage={(page) => setPage(page)} />
        )
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableSelectionCell type="radio" />
            <TableHeaderCell>Evento</TableHeaderCell>
            <TableHeaderCell>Fecha</TableHeaderCell>
            <TableHeaderCell>Registros</TableHeaderCell>
            <TableHeaderCell>Registrado por</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading &&
            data?.data?.map((item) => (
              <Item refetch={refetch} key={item.id} item={item} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
