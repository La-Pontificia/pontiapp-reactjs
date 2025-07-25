import { Tooltip } from '@fluentui/react-components'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'

import { AddFilled } from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import Form from './form'
import { useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import { useSlugClassroom } from '../../../+layout'
import { Classroom } from '@/types/academic/classroom'
import Item from './item'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import { useAuth } from '@/store/auth'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function ClassroomsPage() {
  const { period, pavilion, breadcrumbsComp } = useSlugClassroom()
  const { businessUnit } = useAuth()
  const [openForm, setOpenForm] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true&businessUnitId=' + businessUnit?.id
    uri += `&pavilionId=${pavilion?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, pavilion, businessUnit])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Classroom[]
  > | null>({
    queryKey: ['academic/classrooms', query],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Classroom[]>>(
        'academic/classrooms' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((item) => new Classroom(item))
      }
    }
  })

  return (
    <>
      {period && pavilion && (
        <Helmet>
          <title>
            Aulas y pabellones {'>'} {period?.name} {'>'} {pavilion?.name} |
            Pontiapp
          </title>
        </Helmet>
      )}
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
              <TableHeaderCell>Aula</TableHeaderCell>
              <TableHeaderCell className="max-w-[70px]"># Piso</TableHeaderCell>
              <TableHeaderCell className="max-w-[140px]">Tipo</TableHeaderCell>
              <TableHeaderCell className="max-w-[80px]">
                Capacidad
              </TableHeaderCell>
              <TableHeaderCell className="max-lg:!hidden max-w-[130px]">
                Registrado por
              </TableHeaderCell>
              <TableHeaderCell className="max-w-[100px]">
                Horarios
              </TableHeaderCell>
              <TableHeaderCell className="max-w-[100px]"></TableHeaderCell>
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
