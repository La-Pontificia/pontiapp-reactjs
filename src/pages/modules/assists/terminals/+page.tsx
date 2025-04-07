import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled } from '@fluentui/react-icons'
import Form from './form'
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
import Item from './terminal'
import { ResponsePaginate } from '~/types/paginate-response'
import { AssistTerminal } from '~/types/assist-terminal'
import SearchBox from '~/commons/search-box'
import Pagination from '~/commons/pagination'
import { TableContainer } from '~/components/table-container'
import { Helmet } from 'react-helmet'

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
    <>
      <Helmet>
        <title>Terminales biométricos | Pontiapp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!data?.data?.length}
        footer={
          data && (
            <Pagination
              state={data}
              onChangePage={(page) => {
                setPage(page)
              }}
            />
          )
        }
        nav={
          <nav className="flex flex-wrap w-full items-center">
            <div className="flex-grow flex flex-wrap">
              <h2 className="font-semibold text-xl pr-2">
                Terminales biométricos
              </h2>
            </div>
            <Form
              refetch={refetch}
              triggerProps={{
                disabled: isLoading,
                appearance: 'transparent',
                icon: <AddFilled />,
                children: <span>Nuevo</span>
              }}
            />
            <SearchBox
              className="w-[300px]"
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
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" />
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
      </TableContainer>
    </>
  )
}
