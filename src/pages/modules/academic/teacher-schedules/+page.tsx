import Pagination from '@/commons/pagination'
import SearchBox from '@/commons/search-box'
import {
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  Table
} from '@/components/table'
import { TableContainer } from '@/components/table-container'
import { api } from '@/lib/api'
import { ResponsePaginate } from '@/types/paginate-response'
import { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'hothooks'
import React from 'react'
import { Helmet } from 'react-helmet'
import Item from './item'

export type FiltersValues = {
  q: string | null
  page: number
}

export default function AcademicTeacherSchedulesPage() {
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })

  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const {
    data,
    isLoading: isLoading,
    refetch
  } = useQuery<ResponsePaginate<User[]> | null>({
    queryKey: ['academic/teachers', filters],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<User[]>>(
        'academic/teachers' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((u) => new User(u))
      }
    }
  })

  return (
    <>
      <Helmet>
        <title>Horarios de docentes | Pontiapp</title>
      </Helmet>
      <TableContainer
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
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            <h1 className="font-semibold flex-grow text-xl">
              Horarios de docentes
            </h1>
            <SearchBox onSearch={setValue} placeholder="Filtrar " />
          </nav>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" />
              <TableHeaderCell>Docente</TableHeaderCell>
              <TableHeaderCell className="!max-xl:hidden">
                Email
              </TableHeaderCell>
              <TableHeaderCell>H. no disponibles</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((user) => (
              <Item refetch={refetch} user={user} key={user.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
