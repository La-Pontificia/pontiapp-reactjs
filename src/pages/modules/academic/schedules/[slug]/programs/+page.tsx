import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '~/components/table'

import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '~/commons/search-box'
import { useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '~/types/paginate-response'
import { api } from '~/lib/api'
import Pagination from '~/commons/pagination'
import Item from './item'
import { Program } from '~/types/academic/program'
import { useAuth } from '~/store/auth'
import { TableContainer } from '~/components/table-container'
import { useDebounce } from 'hothooks'
import { useSlugSchedules } from '../+layout'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function ScheduleProgramsPage() {
  const { businessUnit } = useAuth()
  const { period, breadcrumbsComp } = useSlugSchedules()
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

  const { data, isLoading } = useQuery<ResponsePaginate<Program[]> | null>({
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
        <title>
          Secciones {'|'} {period.name} | Pontiapp
        </title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!data?.data.length}
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            {breadcrumbsComp}
            <SearchBox onSearch={setValue} placeholder="Filtrar" />
          </nav>
        }
        footer={
          data && (
            <Pagination
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
              state={data}
            />
          )
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" />
              <TableHeaderCell>Programa</TableHeaderCell>
              <TableHeaderCell>Unidad</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
