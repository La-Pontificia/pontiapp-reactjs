import { FilterAddFilled } from '@fluentui/react-icons'
import React from 'react'
import SearchBox from '~/commons/search-box'
import { useDebounced } from '~/hooks/use-debounced'

export type FiltersValues = {
  q: string | null
  job: string | null
  department: string | null
  area: string | null
  role: string | null
  status: string | null
}

const filterButtons = {
  all: 'Todos',
  sent: 'Enviados',
  approved: 'Aprobados',
  closed: 'Cerrados'
}

export default function EdasPage() {
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    job: null,
    department: null,
    area: null,
    role: null,
    status: 'all'
  })

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  return (
    <div className="flex px-5 flex-col flex-grow overflow-auto">
      <nav className="w-full gap-4 py-4 pb-3 border-b border-stone-500/30">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow flex items-center gap-2">
            <h2 className="font-semibold text-xl pr-2">Edas</h2>
            {Object.entries(filterButtons).map(([key, value]) => (
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, edas: key }))
                }}
                data-active={filters.status === key ? '' : undefined}
                key={key}
                className="border text-nowrap outline outline-2 outline-transparent data-[active]:border-transparent data-[active]:dark:outline-blue-600 data-[active]:bg-blue-700/20 border-stone-500 rounded-full py-1 px-3 font-medium"
              >
                {value}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
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
              }}
            />
          </div>
        </div>
      </nav>
      {/* <div className="w-full h-full flex-col pt-2 flex flex-grow overflow-auto">
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
              <footer className="flex px-5 py-2 justify-center">
                <div className="flex justify-between w-full">
                  <p className="flex basis-0 flex-grow">
                    Mostrando {info.from} - {info.to} de {info.total} resultados
                  </p>
                  {info.next_page_url && (
                    <button
                      disabled={loadingMore}
                      onClick={nextPage}
                      className="dark:text-blue-500 font-medium hover:underline"
                    >
                      {loadingMore ? <Spinner size="tiny" /> : 'Cargar 25 más'}
                    </button>
                  )}
                  <p className="flex basis-0 flex-grow justify-end">
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
      </div> */}
    </div>
  )
}
