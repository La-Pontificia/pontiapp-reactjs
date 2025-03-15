import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled } from '@fluentui/react-icons'
import {
  Spinner,
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import { ResponsePaginate } from '~/types/paginate-response'
import { Event } from '~/types/event'
import Item from './event'
import Form from './form'
import { useAuth } from '~/store/auth'
import SearchBox from '~/commons/search-box'
import Pagination from '~/commons/pagination'

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
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex flex-col w-full pb-3 overflow-auto h-full">
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center">
        {authUser.hasPrivilege('events:create') && (
          <Form
            refetch={refetch}
            triggerProps={{
              disabled: isLoading,
              appearance: 'transparent',
              icon: <AddFilled className="dark:text-blue-500 text-blue-700" />,
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
      <div className="overflow-auto flex flex-col flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : data && data.data?.length < 1 ? (
          <div className="grid place-content-center flex-grow">
            <img
              src="/search.webp"
              width={80}
              alt="No se encontraron resultados"
              className="mx-auto"
            />
            <p className="text-xs opacity-60 pt-5">
              No se encontraron resultados para la búsqueda
            </p>
          </div>
        ) : (
          <Table className="w-full relative">
            <TableHeader>
              <TableRow>
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
        )}
      </div>
      {data && (
        <Pagination state={data} onChangePage={(page) => setPage(page)} />
      )}
    </div>
  )
}
