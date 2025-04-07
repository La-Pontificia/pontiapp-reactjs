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
import Pagination from '~/commons/pagination'
import Item from './item'
import { useSlugProgram } from '../../../+layout'
import { PlanCourse } from '~/types/academic/plan'
import { useDebounce } from 'hothooks'
import { TableContainer } from '~/components/table-container'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function CoursesPage() {
  const { plan, breadcrumbsComp } = useSlugProgram()
  const [openForm, setOpenForm] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&planId=${plan?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, plan])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    PlanCourse[]
  > | null>({
    queryKey: ['academic/plans/courses', filters, plan],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<PlanCourse[]>>(
        'academic/plans/courses' + query
      )
      if (!res.ok) return null
      return res.data
    }
  })

  return (
    <>
      <Helmet>
        <title>Cursos académicos | Pontiapp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!data?.data.length}
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
            <SearchBox onSearch={setValue} placeholder="Filtrar " />
          </nav>
        }
        footer={
          data && (
            <Pagination
              onChangePage={(page) => setFilters((prev) => ({ ...prev, page }))}
              state={data}
            />
          )
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" invisible />
              <TableHeaderCell>Código</TableHeaderCell>
              <TableHeaderCell>Nombre</TableHeaderCell>
              <TableHeaderCell>Ciclo</TableHeaderCell>
              <TableHeaderCell className="max-lg:!hidden">HT</TableHeaderCell>
              <TableHeaderCell className="max-lg:!hidden">HP</TableHeaderCell>
              <TableHeaderCell>Cred</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell className="max-lg:!hidden">
                Registrado
              </TableHeaderCell>
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
