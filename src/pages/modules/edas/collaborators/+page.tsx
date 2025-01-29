import { toast } from 'anni'
import { api } from '~/lib/api'
import { ResponsePaginate } from '~/types/paginate-response'
import * as React from 'react'
import { Spinner } from '@fluentui/react-components'
import CollaboratorsGrid from './grid'
import { useDebounced } from '~/hooks/use-debounced'
import { useQuery } from '@tanstack/react-query'
import SearchBox from '~/commons/search-box'
import { Collaborator } from '~/types/collaborator'
import { FilterAddFilled } from '@fluentui/react-icons'

export type FiltersValues = {
  q: string | null
  job: string | null
  department: string | null
  area: string | null
  role: string | null
  edas: string | null
}

const filterButtons = {
  all: 'Todos',
  withEdas: 'Con edas',
  withoutEdas: 'Sin edas'
}

export default function CollaboratorsPage() {
  // const { user: authUser } = useAuth()
  const [loadingMore, setLoadingMore] = React.useState(false)

  const [info, setInfo] = React.useState<ResponsePaginate<Collaborator[]>>(
    {} as ResponsePaginate<Collaborator[]>
  )
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    job: null,
    department: null,
    area: null,
    role: null,
    edas: 'all'
  })

  const getFiltersQuery = () => {
    let query = '?relationship=userRole'
    if (filters.q) query += `&q=${filters.q}`
    if (filters.job) query += `&job=${filters.job}`
    if (filters.department) query += `&department=${filters.department}`
    if (filters.area) query += `&area=${filters.area}`
    if (filters.role) query += `&role=${filters.role}`
    if (filters.edas) query += `&edas=${filters.edas}`
    return query
  }

  const [users, setUsers] = React.useState<Collaborator[]>([])

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

  React.useEffect(() => {
    if (!data) return
    setUsers(data.data.map((user) => new Collaborator(user)))
    setInfo(data)
  }, [data])

  const nextPage = async () => {
    setLoadingMore(true)
    const query = getFiltersQuery()
    const res = await api.get<ResponsePaginate<Collaborator[]>>(
      'edas/collaborators' + query + `&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setUsers((prev) => [
        ...prev,
        ...res.data.data.map((user) => new Collaborator(user))
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
    <div className="flex px-5 flex-col flex-grow overflow-auto">
      <nav className="flex items-center flex-wrap gap-2 w-full py-4 px-3 max-lg:py-2">
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
        <div className="ml-auto flex items-center gap-2">
          <button>
            <FilterAddFilled fontSize={25} />
          </button>
          <SearchBox
            value={searchValue}
            onChange={(e) => {
              if (e.target.value === '')
                setFilters((prev) => ({ ...prev, q: null }))
              handleChange(e.target.value)
            }}
            className="w-[270px]"
            placeholder="Filtrar por nombre o persona"
            dismiss={() => {
              setFilters((prev) => ({ ...prev, q: null }))
              handleChange('')
            }}
          />
        </div>
      </nav>
      <div className="w-full h-full flex-col flex flex-grow overflow-auto">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="large" />
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="flex-grow rounded-xl overflow-y-auto">
              <CollaboratorsGrid
                refetch={refetch}
                isLoadingMore={loadingMore}
                users={users}
              />
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
        ) : (
          <div className="grid place-content-center text-sm opacity-60 h-full">
            No hay nada que mostrar
          </div>
        )}
      </div>
    </div>
  )
}
