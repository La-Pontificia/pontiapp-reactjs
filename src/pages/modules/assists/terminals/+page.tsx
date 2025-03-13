import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled } from '@fluentui/react-icons'
import Form from './form'
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
import Item from './terminal'
import { ResponsePaginate } from '~/types/paginate-response'
import { AssistTerminal } from '~/types/assist-terminal'
import SearchBox from '~/commons/search-box'
import Pagination from '~/commons/pagination'

export default function AssistTerminalsPage() {
  const [page, setPage] = React.useState(1)
  const [q, setQ] = React.useState<string>()

  const query = `partials/assist-terminals/all?paginate=true&relationship=schedulesCount${
    q ? `&q=${q}` : ''
  } ${page ? `&page=${page}` : ''}`

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    AssistTerminal[]
  > | null>({
    queryKey: ['partials/assist-terminals', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<AssistTerminal[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const { handleChange, value: searchValue } = useDebounced({
    delay: 400,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex w-full px-3 flex-col overflow-y-auto h-full">
      <nav className="pb-3 pt-4 flex flex-wrap w-full border-b border-neutral-500/30 items-center gap-4">
        <div className="flex-grow flex flex-wrap">
          <h2 className="font-semibold text-xl pr-2">Terminales biométricos</h2>
          <Form
            refetch={refetch}
            triggerProps={{
              disabled: isLoading,
              appearance: 'primary',
              size: 'small',
              icon: <AddFilled />,
              children: <span>Nuevo</span>
            }}
          />
        </div>
        <SearchBox
          className="min-w-[400px]"
          disabled={isLoading}
          value={searchValue}
          dismiss={() => setQ('')}
          onChange={(e) => {
            if (e.target.value === '') setQ(undefined)
            handleChange(e.target.value)
          }}
          placeholder="Filtrar por nombre"
        />
      </nav>
      <div className="overflow-auto rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Nombre</TableHeaderCell>
                <TableHeaderCell>Base de datos</TableHeaderCell>
                <TableHeaderCell>Fecha creación</TableHeaderCell>
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
      {data?.data && (
        <Pagination
          state={data}
          onChangePage={(page) => {
            setPage(page)
          }}
        />
      )}
    </div>
  )
}
