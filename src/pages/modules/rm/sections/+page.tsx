import {
  Spinner,
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  Tooltip
} from '@fluentui/react-components'
import {
  AddFilled,
  FilterAddFilled,
  FolderPeopleRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '~/commons/search-box'
import { useDebounced } from '~/hooks/use-debounced'
import Form from './form'
import { useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '~/types/paginate-response'
import { AcademicProgram } from '~/types/rm-academic-program'
import { api } from '~/lib/api'
import Pagination from '~/commons/pagination'
import Item from './item'
import { BusinessUnit } from '~/types/business-unit'
import Filters from './filters'

export type FiltersValues = {
  q: string | null
  businessUnit: BusinessUnit | null
  page: number
}
export default function SectionsPage() {
  const [openForm, setOpenForm] = React.useState(false)
  const [openFilters, setOpenFilters] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1,
    businessUnit: null
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    if (filters.businessUnit)
      uri += `&businessUnitId=${filters.businessUnit.id}`
    return uri
  }, [filters])

  const { value: searchValue, handleChange } = useDebounced({
    onCompleted: (value) => {
      setFilters((prev) => ({ ...prev, q: value }))
    }
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    AcademicProgram[]
  > | null>({
    queryKey: ['rm/academiPrograms', filters],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<AcademicProgram[]>>(
        'rm/academic-programs' + query
      )
      if (!res.ok) return null
      return res.data
    }
  })

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <Helmet>
        <title>Programas académicos | PontiApp</title>
      </Helmet>
      <nav className="flex items-center gap-3 flex-wrap w-full py-4 px-3 max-lg:py-2">
        <h1 className="font-semibold flex-grow text-lg">
          Programas académicos
        </h1>
        <Tooltip content="Nuevo" relationship="description">
          <button
            className="flex font-semibold items-center gap-1"
            onClick={() => setOpenForm(true)}
          >
            <AddFilled
              fontSize={20}
              className="dark:text-blue-600 text-blue-700"
            />
            Nuevo
          </button>
        </Tooltip>
        <Form open={openForm} onOpenChange={setOpenForm} refetch={refetch} />
        <Tooltip content="Mas filtros" relationship="description">
          <button
            onClick={() => setOpenFilters(true)}
            className="flex font-semibold items-center gap-1"
          >
            <FilterAddFilled
              fontSize={20}
              className="dark:text-blue-600 text-blue-700"
            />
            Filtros
          </button>
        </Tooltip>

        <Filters
          filters={filters}
          setFilters={setFilters}
          onOpenChange={setOpenFilters}
          open={openFilters}
        />

        <div className="ml-auto max-md:w-full">
          <SearchBox
            value={searchValue}
            dismiss={() => {
              handleChange('')
              setFilters((prev) => ({ ...prev, q: null }))
            }}
            onChange={(e) => {
              if (e.target.value === '')
                setFilters((prev) => ({ ...prev, q: null }))
              handleChange(e.target.value)
            }}
            className="w-[300px] max-md:w-full"
            placeholder="Filtrar"
          />
        </div>
      </nav>
      {isLoading ? (
        <div className="flex-grow grid place-content-center">
          <Spinner />
          <p className="text-xs opacity-60 pt-4">Cargando datos...</p>
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="overflow- flex flex-col flex-grow">
          <div className="overflow-auto flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableSelectionCell type="radio" invisible />
                  <TableHeaderCell>Programa</TableHeaderCell>
                  <TableHeaderCell>Unidad</TableHeaderCell>
                  <TableHeaderCell>Registrado por</TableHeaderCell>
                  <TableHeaderCell></TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((item) => (
                  <Item refetch={refetch} key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
            state={data}
          />
        </div>
      ) : (
        <div className="grid place-content-center flex-grow w-full h-full text-xs opacity-80">
          <FolderPeopleRegular fontSize={50} className="mx-auto opacity-70" />
          <p className="pt-2">No hay nada que mostrar</p>
        </div>
      )}
    </div>
  )
}
