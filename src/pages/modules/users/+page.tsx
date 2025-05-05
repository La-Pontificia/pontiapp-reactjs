import { api } from '@/lib/api'
import { ResponsePaginate } from '@/types/paginate-response'
import { User } from '@/types/user'
import * as React from 'react'
import { Tooltip } from '@fluentui/react-components'
import {
  FilterAddFilled,
  PenRegular,
  PersonAddRegular
} from '@fluentui/react-icons'
import { useDebounce } from 'hothooks'
import CollaboratorsFilters from './filters'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/store/auth'
import SearchBox from '@/commons/search-box'
import { Helmet } from 'react-helmet'
// import Pagination from '@/commons/pagination'
import FormUser from './form'
import { TableContainer } from '@/components/table-container'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import Pagination from '@/commons/pagination'
import UserGrid from './user'

export type FiltersValues = {
  q: string | null
  job: string | null
  department: string | null
  area: string | null
  role: string | null
  hasManager: string | null
  hasSchedules: string | null
  page: number
  status: string
}

const filterButtons = {
  all: 'Todos',
  actives: 'Activos',
  inactives: 'Inactivos',
}


export default function AllUsersPage() {
  const [openFilters, setOpenFilters] = React.useState(false)
  const [createFormOpen, setCreateFormOpen] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    job: null,
    department: null,
    area: null,
    role: null,
    hasManager: null,
    hasSchedules: null,
    page: 1,
    status: 'all'
  })

  const getFiltersQuery = () => {
    let query = '?relationship=role,manager'
    if (filters.page) query += `&page=${filters.page}`
    if (filters.q) query += `&q=${filters.q}`
    if (filters.job) query += `&job=${filters.job}`
    if (filters.department) query += `&department=${filters.department}`
    if (filters.area) query += `&area=${filters.area}`
    if (filters.role) query += `&role=${filters.role}`
    if (filters.hasManager) query += `&hasManager=${filters.hasManager}`
    if (filters.hasSchedules) query += `&hasSchedules=${filters.hasSchedules}`
    if (filters.status) query += `&status=${filters.status}`
    return query
  }

  const { user: authUser } = useAuth()

  const {
    data,
    isLoading: loading,
    refetch
  } = useQuery<ResponsePaginate<User[]> | null>({
    queryKey: ['users/all', filters],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<User[]>>(
        'users/all' + getFiltersQuery()
      )
      if (!res.ok) return null
      return res.data
    }
  })

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  return (
    <>
      <Helmet>
        <title>Usuarios | PontiApp</title>
      </Helmet>
      <TableContainer
        isLoading={loading}
        isEmpty={data?.data?.length === 0}
        footer={
          data && (
            <Pagination
              state={data}
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )
        }
        nav={
          <nav className="flex items-center gap-4 w-full pt-2 px-1">
            <h1 className="font-semibold text-lg">Usuarios</h1>
            <div className='flex items-center grow gap-2'>
              {Object.entries(filterButtons).map(([key, value]) => (
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, status: key }))
                  }}
                  data-active={filters.status === key ? '' : undefined}
                  key={key}
                  className="border text-nowrap outline outline-2 outline-transparent data-[active]:border-transparent data-[active]:dark:border-transparent data-[active]:outline-blue-600 data-[active]:dark:outline-blue-600 data-[active]:bg-blue-700/10 data-[active]:dark:bg-blue-700/20 border-stone-300 dark:border-stone-500 rounded-full py-1 px-3 font-medium"
                >
                  {value}
                </button>
              ))}
            </div>
            {authUser.hasPrivilege('users:create') && (
              <>
                <button
                  onClick={() => setCreateFormOpen(true)}
                  className="flex max-lg:hidden items-center gap-1"
                >
                  <PersonAddRegular
                    fontSize={20}
                    className="dark:text-blue-500 text-blue-700"
                  />
                  Nuevo
                </button>
                <FormUser open={createFormOpen} setOpen={setCreateFormOpen} />
              </>
            )}
            {authUser.hasPrivilege('users:edit') && (
              <>
                <button
                  disabled
                  onClick={() => setCreateFormOpen(true)}
                  className="flex disabled:grayscale disabled:opacity-40 max-lg:hidden items-center gap-1"
                >
                  <PenRegular
                    fontSize={20}
                    className="dark:text-blue-500 text-blue-700"
                  />
                  Editar
                </button>
                <FormUser open={createFormOpen} setOpen={setCreateFormOpen} />
              </>
            )}
            <Tooltip content="Mas filtros" relationship="description">
              <button
                onClick={() => setOpenFilters(true)}
                className="flex items-center gap-1"
              >
                <FilterAddFilled
                  fontSize={25}
                  className="dark:text-blue-500 text-blue-700"
                />
                <p className="max-md:hidden">Filtros</p>
              </button>
            </Tooltip>
            {openFilters && (
              <CollaboratorsFilters
                filters={filters}
                setFilters={setFilters}
                setSidebarIsOpen={setOpenFilters}
                sidebarIsOpen={openFilters}
              />
            )}
            <div className="ml-auto">
              <SearchBox
                onSearch={setValue}
                placeholder="Filtrar por DNI, nombres"
              />
            </div>
          </nav>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" invisible />
              <TableHeaderCell>Usuario</TableHeaderCell>
              <TableHeaderCell className="!max-sm:hidden">
                Cargo
              </TableHeaderCell>
              <TableHeaderCell className="!max-xl:hidden">
                Email
              </TableHeaderCell>
              <TableHeaderCell className="!max-xl:hidden">
                Jefe (Manager)
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
