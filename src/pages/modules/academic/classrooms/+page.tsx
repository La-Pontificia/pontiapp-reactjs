import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'

import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import { useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import Item from './item'
import { Period } from '@/types/academic/period'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import { useAuth } from '@/store/auth'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function ClassroomsPeriodsPage() {
  const { businessUnit } = useAuth()
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = `?paginate=true&businessUnitId=${businessUnit?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, businessUnit])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading } = useQuery<ResponsePaginate<Period[]> | null>({
    queryKey: ['academic/periods', query],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Period[]>>(
        'academic/periods' + query
      )
      if (!res.ok) return null
      return res.data
    }
  })

  return (
    <>
      <Helmet>
        <title>Aulas y pabellones | Pontiapp</title>
      </Helmet>
      <TableContainer
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            <h1 className="font-semibold flex-grow text-xl">
              Aulas y pabellones
            </h1>
            <SearchBox onSearch={setValue} placeholder="Filtrar " />
          </nav>
        }
        isLoading={isLoading}
        isEmpty={!data?.data?.length}
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
              <TableHeaderCell>Periodo</TableHeaderCell>
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
