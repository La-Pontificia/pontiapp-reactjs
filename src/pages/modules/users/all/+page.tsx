import { toast } from 'anni'
import { api } from '~/lib/api'
import { ResponsePaginate } from '~/types/paginate-response'
import { User } from '~/types/user'
import * as React from 'react'
import { Spinner, Tooltip } from '@fluentui/react-components'
import { AddFilled, FilterAddFilled } from '@fluentui/react-icons'
import CollaboratorsGrid from './grid'
import { useDebounced } from '~/hooks/use-debounced'
import CollaboratorsFilters from './filters'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { useAuth } from '~/store/auth'
import SearchBox from '~/commons/search-box'
import { Helmet } from 'react-helmet'

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
  const [openFilters, setOpenFilters] = React.useState(false)
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
    let query = '?status=actives&relationship=role,manager'
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
      <Helmet>
        <title>Usuarios | PontiApp</title>
      </Helmet>
      <nav className="flex items-center gap-2 w-full py-4 px-3 max-lg:py-2">
        <h1 className="font-semibold flex-grow text-lg">Usuarios</h1>
        {authUser.hasPrivilege('users:create') && (
          <Link
            to="/m/users/create"
            className="flex font-semibold max-lg:hidden items-center gap-1 rounded-md hover:bg-neutral-500/20 p-1.5"
          >
            <AddFilled fontSize={20} />
            Crear
          </Link>
        )}
        <Tooltip content="Mas filtros" relationship="description">
          <button
            onClick={() => setOpenFilters(true)}
            className="flex items-center gap-1 px-2 font-medium"
          >
            <FilterAddFilled fontSize={25} />
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
        {loading && (
          <div className="flex-grow grid place-content-center">
            <Spinner size="large" />
          </div>
        )}

        {!loading && users?.length < 1 && (
          <div className="grid place-content-center flex-grow">
            <img
              src="/search.webp"
              width={90}
              alt="No se encontraron resultados"
              className="mx-auto"
            />
            <p className="text-xs opacity-60 pt-5">
              No se encontraron resultados para la búsqueda
            </p>
          </div>
        )}

        {!loading && (
          <>
            <div className="flex-grow overflow-auto">
              <CollaboratorsGrid refetch={refetch} users={users} />
            </div>
            {info && (
              <footer className="flex text-sm px-5 py-2 justify-center">
                <div className="flex justify-between w-full">
                  <p className="flex max-sm:hidden opacity-60 basis-0 flex-grow">
                    Mostrando {info.from} - {info.to} de {info.total} resultados
                  </p>
                  {info.next_page_url && (
                    <button
                      disabled={loadingMore}
                      onClick={nextPage}
                      className="dark:text-blue-500 font-semibold mx-auto hover:underline"
                    >
                      {loadingMore ? <Spinner size="tiny" /> : 'Cargar más'}
                    </button>
                  )}
                  <p className="flex max-sm:hidden opacity-60 basis-0 flex-grow justify-end">
                    Página {info.current_page} de {info.last_page}
                  </p>
                </div>
              </footer>
            )}
          </>
        )}
      </div>
    </div>
  )
}
