import { Tooltip } from '@fluentui/react-components'
import { AddFilled } from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import Form from './form'
import { useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import Item from './item'
import { Program } from '@/types/academic/program'
import { useAuth } from '@/store/auth'
import { TableContainer } from '@/components/table-container'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { useDebounce } from 'hothooks'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function AcademicPage() {
  const { businessUnit } = useAuth()
  const [openForm, setOpenForm] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&businessUnitId=${businessUnit?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`

    return uri
  }, [filters, businessUnit])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Program[]
  > | null>({
    queryKey: ['academic/programs', filters, businessUnit],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Program[]>>(
        'academic/programs' + query
      )
      if (!res.ok) return null
      return res.data
    }
  })

  return (
    <>
      <Helmet>
        <title>Programas académicos | Pontiapp</title>
      </Helmet>
      {data && (
        <TableContainer
          isEmpty={data.data.length === 0}
          nav={
            <nav className="flex items-center gap-3 flex-wrap w-full">
              <h1 className="font-semibold flex-grow text-xl">
                Programas académicos
              </h1>
              <Tooltip content="Nuevo" relationship="description">
                <button
                  className="flex font-semibold items-center gap-1"
                  onClick={() => setOpenForm(true)}
                >
                  <AddFilled
                    fontSize={20}
                    className="dark:text-blue-600 text-blue-700"
                  />
                  Nuevo
                </button>
              </Tooltip>
              <Form
                open={openForm}
                onOpenChange={setOpenForm}
                refetch={refetch}
              />
              <SearchBox onSearch={setValue} placeholder="Filtrar " />
            </nav>
          }
          isLoading={isLoading}
          footer={
            <Pagination
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
              state={data}
            />
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableSelectionCell type="radio" invisible />
                <TableHeaderCell>Programa</TableHeaderCell>
                <TableHeaderCell>Registrado por</TableHeaderCell>
                <TableHeaderCell className='max-w-[200px]'></TableHeaderCell>
                <TableHeaderCell className='max-w-[100px]'></TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((item) => (
                <Item refetch={refetch} key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
