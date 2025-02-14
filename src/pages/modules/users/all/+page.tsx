import { api } from '~/lib/api'
import { ResponsePaginate } from '~/types/paginate-response'
import { User } from '~/types/user'
import * as React from 'react'
import { Spinner, Tooltip } from '@fluentui/react-components'
import {
  FilterAddFilled,
  FolderPeopleRegular,
  PenRegular,
  PersonAddRegular
} from '@fluentui/react-icons'
import { useDebounced } from '~/hooks/use-debounced'
import CollaboratorsFilters from './filters'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '~/store/auth'
import SearchBox from '~/commons/search-box'
import { Helmet } from 'react-helmet'
import Pagination from '~/commons/pagination'
import FormUser from './form'
import UsersGrid from './grid'

export type FiltersValues = {
  q: string | null
  job: string | null
  department: string | null
  area: string | null
  role: string | null
  hasManager: string | null
  hasSchedules: string | null
  page: number
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
    page: 1
  })

  const getFiltersQuery = () => {
    let query = '?status=actives&relationship=role,manager'
    if (filters.page) query += `&page=${filters.page}`
    if (filters.q) query += `&q=${filters.q}`
    if (filters.job) query += `&job=${filters.job}`
    if (filters.department) query += `&department=${filters.department}`
    if (filters.area) query += `&area=${filters.area}`
    if (filters.role) query += `&role=${filters.role}`
    if (filters.hasManager) query += `&hasManager=${filters.hasManager}`
    if (filters.hasSchedules) query += `&hasSchedules=${filters.hasSchedules}`
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

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <Helmet>
        <title>Usuarios | PontiApp</title>
      </Helmet>
      <nav className="flex items-center gap-4 w-full py-2 px-1">
        <h1 className="font-semibold flex-grow text-lg">Usuarios</h1>
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
              Nuevo usuario
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
            value={searchValue}
            dismiss={() => {
              setFilters((prev) => ({ ...prev, q: null }))
            }}
            onChange={(e) => {
              if (e.target.value === '')
                setFilters((prev) => ({ ...prev, q: null }))
              handleChange(e.target.value)
            }}
            placeholder="Filtrar por DNI, nombres"
          />
        </div>
      </nav>
      <div className="w-full h-full flex-col flex flex-grow overflow-auto">
        {loading ? (
          <div className="flex-grow grid place-content-center">
            <Spinner size="large" />
          </div>
        ) : data?.data && data.data?.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto">
              <UsersGrid refetch={refetch} users={data.data} />
            </div>
            <Pagination
              state={data}
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </>
        ) : (
          <div className="grid place-content-center flex-grow w-full h-full text-xs opacity-80">
            <FolderPeopleRegular fontSize={50} className="mx-auto opacity-70" />
            <p className="pt-2">No hay nada que mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}
