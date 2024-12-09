import { toast } from '@/commons/toast'
import { api } from '@/lib/api'
import { ResponsePaginate } from '@/types/paginate-response'
import { User } from '@/types/user'
import * as React from 'react'
import { Button, SearchBox, Spinner } from '@fluentui/react-components'
import {
  AddFilled,
  Search20Regular,
  TableSearch20Regular
} from '@fluentui/react-icons'
import CollaboratorsGrid from './grid'
import { useDebounced } from '@/hooks/use-debounced'
import CollaboratorsFilters from './filters'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useAuth } from '@/store/auth'

export type FiltersValues = {
  q: string | null
  job: string | null
  department: string | null
  area: string | null
  role: string | null
  hasManager: string | null
  hasSchedules: string | null
}

export default function AllUsersPage() {
  const { user: authUser } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [info, setInfo] = React.useState<ResponsePaginate<User[]>>(
    {} as ResponsePaginate<User[]>
  )
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    job: null,
    department: null,
    area: null,
    role: null,
    hasManager: null,
    hasSchedules: null
  })

  const getFiltersQuery = () => {
    let query = '?relationship=userRole,role,manager'
    if (filters.q) query += `&q=${filters.q}`
    if (filters.job) query += `&job=${filters.job}`
    if (filters.department) query += `&department=${filters.department}`
    if (filters.area) query += `&area=${filters.area}`
    if (filters.role) query += `&role=${filters.role}`
    if (filters.hasManager) query += `&hasManager=${filters.hasManager}`
    if (filters.hasSchedules) query += `&hasSchedules=${filters.hasSchedules}`
    return query
  }

  const [users, setUsers] = React.useState<User[]>([])

  const {
    data,
    isLoading: loading,
    refetch
  } = useQuery<ResponsePaginate<User[]> | null>({
    queryKey: ['users/all', getFiltersQuery()],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<User[]>>(
        'users/all' + getFiltersQuery()
      )
      if (!res.ok) return null
      return res.data
    }
  })

  React.useEffect(() => {
    if (!data) return
    setUsers(data.data.map((user) => new User(user)))
    setInfo(data)
  }, [data])

  const nextPage = async () => {
    setLoadingMore(true)
    const query = getFiltersQuery()
    const res = await api.get<ResponsePaginate<User[]>>(
      'users/all' + query + `&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setUsers((prev) => [
        ...prev,
        ...res.data.data.map((user) => new User(user))
      ])
      setInfo({
        ...res.data,
        data: []
      })
    } else {
      toast('No se pudo cargar la lista de colaboradores')
    }
    setLoadingMore(false)
  }

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <nav className="flex items-center w-full gap-4 py-4">
        <Link
          data-disabled={
            !authUser.hasPrivilege('users:create') ? '' : undefined
          }
          to="/m/users/create"
          className="flex data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:grayscale data-[disabled]:select-none items-center gap-2 rounded-md hover:bg-stone-500/20 p-1.5"
        >
          <AddFilled fontSize={20} className="dark:text-blue-500" />
          Crear usuario
        </Link>
        <SearchBox
          value={searchValue}
          dismiss={{
            onClick: () => {
              setFilters((prev) => ({ ...prev, q: null }))
            }
          }}
          appearance="filled-lighter-shadow"
          onChange={(_, e) => {
            if (e.value === '') setFilters((prev) => ({ ...prev, q: null }))
            handleChange(e.value)
          }}
          contentBefore={<Search20Regular className="text-blue-500" />}
          placeholder="Buscar usuario"
        />
        <Button
          appearance="transparent"
          className="text-nowrap"
          onClick={() => setIsSidebarOpen(true)}
          icon={<TableSearch20Regular />}
        >
          Filtros
        </Button>
        {isSidebarOpen && (
          <CollaboratorsFilters
            filters={filters}
            setFilters={setFilters}
            setSidebarIsOpen={setIsSidebarOpen}
            sidebarIsOpen={isSidebarOpen}
          />
        )}
      </nav>
      <div className="w-full h-full flex-col flex flex-grow overflow-auto">
        <div className="flex-grow rounded-xl overflow-y-auto">
          <CollaboratorsGrid
            refetch={refetch}
            isLoadingMore={loadingMore}
            users={users}
            isLoading={loading}
          />
        </div>
        {info && (
          <footer className="flex p-5 justify-center">
            <div className="flex justify-between w-full">
              <p className="flex basis-0 flex-grow">
                Mostrando {info.from} - {info.to} de {info.total} resultados
              </p>
              {info.next_page_url && (
                <button
                  disabled={loadingMore}
                  onClick={nextPage}
                  className="dark:text-blue-500 hover:underline"
                >
                  {loadingMore ? <Spinner size="tiny" /> : 'Cargar más'}
                </button>
              )}
              <p className="flex basis-0 flex-grow justify-end">
                Página {info.current_page} de {info.last_page}
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}
