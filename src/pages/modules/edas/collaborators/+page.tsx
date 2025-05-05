import { api } from '@/lib/api'
import { ResponsePaginate } from '@/types/paginate-response'
import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import SearchBox from '@/commons/search-box'
import { Collaborator } from '@/types/collaborator'
import Pagination from '@/commons/pagination'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import UserGrid from './user-grid'
import { Helmet } from 'react-helmet'

export type FiltersValues = {
  q: string | null
  job: string | null
  department: string | null
  area: string | null
  role: string | null
  edas: string | null
  page: number
}

const filterButtons = {
  all: 'Todos',
  withEdas: 'Con edas',
  withoutEdas: 'Sin edas'
}

export default function CollaboratorsPage() {
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    job: null,
    department: null,
    area: null,
    role: null,
    edas: 'all',
    page: 1
  })

  const getFiltersQuery = () => {
    let query = '?relationship=userRole'
    if (filters.page) query += `&page=${filters.page}`
    if (filters.q) query += `&q=${filters.q}`
    if (filters.job) query += `&job=${filters.job}`
    if (filters.department) query += `&department=${filters.department}`
    if (filters.area) query += `&area=${filters.area}`
    if (filters.role) query += `&role=${filters.role}`
    if (filters.edas) query += `&edas=${filters.edas}`
    return query
  }

  const { data, refetch, isLoading } = useQuery<ResponsePaginate<
    Collaborator[]
  > | null>({
    queryKey: ['edas/collaborators', getFiltersQuery()],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Collaborator[]>>(
        'edas/collaborators' + getFiltersQuery()
      )
      if (!res.ok) return null
      return res.data
    }
  })

  const { setValue } = useDebounce<string | null>({
    delay: 300,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  return (
    <>
      <Helmet>
        <title>Colaboradores | Pontiapp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={data?.data.length === 0}
        nav={
          <nav className="flex items-center flex-wrap gap-2 w-full">
            <h2 className="font-semibold text-xl pr-2">Bajo tu supervisión</h2>
            {Object.entries(filterButtons).map(([key, value]) => (
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, edas: key }))
                }}
                data-active={filters.edas === key ? '' : undefined}
                key={key}
                className="border text-nowrap outline outline-2 outline-transparent data-[active]:border-transparent data-[active]:dark:border-transparent data-[active]:outline-blue-600 data-[active]:dark:outline-blue-600 data-[active]:bg-blue-700/10 data-[active]:dark:bg-blue-700/20 border-stone-300 dark:border-stone-500 rounded-full py-1 px-3 font-medium"
              >
                {value}
              </button>
            ))}
            <div className="ml-auto">
              <SearchBox
                onSearch={setValue}
                placeholder="Filtrar por nombre o correo"
              />
            </div>
          </nav>
        }
        footer={
          data && (
            <Pagination
              state={data}
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" invisible />
              <TableHeaderCell>Colaborador</TableHeaderCell>
              <TableHeaderCell>Cargo</TableHeaderCell>
              <TableHeaderCell>Área</TableHeaderCell>
              <TableHeaderCell className="max-xl:!hidden">Edas</TableHeaderCell>
              <TableHeaderCell className="max-xl:!hidden">
                Administrador
              </TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((user) => (
              <UserGrid refetch={refetch} user={user} key={user.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
