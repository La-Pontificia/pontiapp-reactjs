import { Tooltip } from '@fluentui/react-components'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '~/components/table'

import { AddFilled } from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '~/commons/search-box'
import Form from './form'
import { useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '~/types/paginate-response'
import { api } from '~/lib/api'
// import Pagination from '~/commons/pagination'
import { useSlugSection } from '../../../+layout'
import { Section } from '~/types/academic/section'
import Item from './item'
import { TableContainer } from '~/components/table-container'
import Pagination from '~/commons/pagination'
import { useDebounce } from 'hothooks'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function SectionsPage() {
  const { period, program, breadcrumbsComp } = useSlugSection()
  const [openForm, setOpenForm] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&periodId=${period.id}`
    uri += `&programId=${program?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, period, program])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Section[]
  > | null>({
    queryKey: ['academic/sections', filters, period, program],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Section[]>>(
        'academic/sections' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((d) => new Section(d))
      }
    }
  })

  return (
    <>
      <Helmet>
        <title>
          Secciones {'|'} {period?.name} {'|'} {program?.name} | Pontiapp
        </title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!data?.data.length}
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
            {breadcrumbsComp}
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
            <Form
              open={openForm}
              onOpenChange={setOpenForm}
              refetch={refetch}
            />
            <SearchBox onSearch={setValue} placeholder="Filtrar" />
          </nav>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" invisible />
              <TableHeaderCell>Sección</TableHeaderCell>
              <TableHeaderCell>Plan de estudio</TableHeaderCell>
              <TableHeaderCell>Ciclo</TableHeaderCell>
              <TableHeaderCell>Cursos</TableHeaderCell>
              <TableHeaderCell>Registrado por</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item) => (
              <Item refetch={refetch} key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
