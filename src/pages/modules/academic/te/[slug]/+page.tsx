import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'

import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import { useAuth } from '@/store/auth'
import { useSlug } from './+layout'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import {
  AddFilled,
  DocumentTableRegular,
  TaskListSquareSettingsRegular
} from '@fluentui/react-icons'
import { Tooltip } from '@fluentui/react-components'
import SettingDialog from './settings'
import Form from './form'
import { Tevaluation } from '@/types/academic/te-evaluation'
import { ResponsePaginate } from '@/types/paginate-response'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import Item from './item'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function TevaluationsPage() {
  const [openForm, setOpenForm] = React.useState(false)
  const [settings, setSettings] = React.useState(false)
  const { group, breadcrumbsComp } = useSlug()
  const { user } = useAuth()
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&groupId=${group?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`

    return uri
  }, [filters, group])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Tevaluation[]
  > | null>({
    queryKey: ['academic/te', query, group],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Tevaluation[]>>(
        'academic/te' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((item) => new Tevaluation(item))
      }
    }
  })

  if (!group) return <div className="p-4">No se encontró el grupo</div>

  return (
    <>
      <Form open={openForm} refetch={refetch} setOpen={setOpenForm} />
      <Helmet>
        <title>{group?.name} | Pontiapp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!data?.data.length}
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            {breadcrumbsComp}
            <button
              className="flex disabled:opacity-50 disabled:grayscale font-semibold items-center gap-1"
              onClick={() => setOpenForm(true)}
            >
              <AddFilled
                fontSize={20}
                className="dark:text-blue-600 text-blue-700"
              />
              Registrar
            </button>
            <Tooltip
              content="Ajustes de Bloques, preguntas etc."
              relationship="description"
            >
              <button
                disabled={
                  !user.hasPrivilege('academic:teacherEvaluation:groups:write')
                }
                className="flex disabled:opacity-50 disabled:grayscale font-semibold items-center gap-1"
                onClick={() => setSettings(true)}
              >
                <TaskListSquareSettingsRegular
                  fontSize={20}
                  className="dark:text-blue-600 text-blue-700"
                />
                Ajustes
              </button>
            </Tooltip>
            <Tooltip
              // content="Exportar excel"
              content="Aún se esta implementando la exportación a excel"
              relationship="inaccessible"
            >
              <button
                disabled={
                  true
                  // isLoading || !data?.data || data?.data?.length === 0
                }
                className="flex disabled:opacity-50 disabled:grayscale font-semibold items-center gap-1"
                // onClick={() => setOpenReport(true)}
              >
                <DocumentTableRegular
                  fontSize={20}
                  className="dark:text-blue-600 text-blue-700"
                />
                Excel
              </button>
            </Tooltip>
            <SearchBox onSearch={setValue} placeholder="Filtrar" />
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
              <TableSelectionCell type="radio" />
              <TableHeaderCell>Docente</TableHeaderCell>
              <TableHeaderCell>Curso</TableHeaderCell>
              <TableHeaderCell>Evaluado por</TableHeaderCell>
              <TableHeaderCell className="!max-w-[150px]">
                Fecha
              </TableHeaderCell>
              <TableHeaderCell className="!max-w-[100px]">Hora</TableHeaderCell>
              <TableHeaderCell className="!max-w-[130px]"></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item) => (
              <Item key={item.id} item={item} refetch={refetch} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dialogs */}
      <SettingDialog open={settings} onOpenChange={setSettings} group={group} />
    </>
  )
}
