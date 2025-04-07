import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tooltip
} from '@fluentui/react-components'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '~/components/table'

import {
  AddFilled,
  DocumentTableRegular,
  FilterAddFilled
} from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '~/commons/search-box'
import { useAuth } from '~/store/auth'
import TeacherTrackingForm from './form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { ResponsePaginate } from '~/types/paginate-response'
import TTFilters from './filters'
import Item from './item'
import Pagination from '~/commons/pagination'
import { format } from '~/lib/dayjs'
import { Link } from 'react-router'
import { toast } from 'anni'
import { TableContainer } from '~/components/table-container'
import { useDebounce } from 'hothooks'
import { TeacherTraking } from '~/types/academic/teacher-traking'

export type Filter = {
  q: string | null
  section: string | null
  period: string | null
  academicProgram: string | null
  startDate: Date | null
  endDate: Date | null
}

export default function TeacherTrackingsPage() {
  const { user: authUser } = useAuth()
  const [openFilters, setOpenFilters] = React.useState(false)
  const [openReport, setOpenReport] = React.useState(false)
  const [openForm, setOpenForm] = React.useState(false)
  const [filters, setFilters] = React.useState<Filter>({
    q: null,
    section: null,
    period: null,
    academicProgram: null,
    endDate: null,
    startDate: null
  })

  const query = React.useMemo(() => {
    let uri = '?r=13'
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.section) uri += `&section=${filters.section}`
    if (filters.period) uri += `&period=${filters.period}`
    if (filters.academicProgram)
      uri += `&academicProgram=${filters.academicProgram}`
    if (filters.startDate)
      uri += `&startDate=${format(filters.startDate, 'YYYY-MM-DD')}`
    if (filters.endDate)
      uri += `&endDate=${format(filters.endDate, 'YYYY-MM-DD')}`
    return uri
  }, [filters])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const {
    data: evaluations,
    isLoading,
    refetch
  } = useQuery<ResponsePaginate<TeacherTraking[]> | null>({
    queryKey: ['academic/tt', query],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<TeacherTraking[]>>(
        'academic/tt' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((data) => new TeacherTraking(data))
      }
    }
  })

  const { mutate: report, isPending: reporting } = useMutation({
    mutationFn: () =>
      api.post('rm/tt/report' + query, {
        alreadyHandleError: false
      }),
    onSuccess: () => {
      setOpenReport(false)
      toast.success('Reporte en proceso de generación, te notificaremos.')
    },
    onError: () => {
      toast.error('Ocurrió un error al generar el reporte.')
    }
  })

  return (
    <>
      <Helmet>
        <title>Evaluaciones y seguimiento a docentes | PontiApp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!evaluations?.data?.length}
        footer={evaluations && <Pagination state={evaluations} />}
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            <h1 className="font-semibold flex-grow text-xl">
              Evaluación de docentes
            </h1>
            {authUser.hasPrivilege('rm:tt:create') && (
              <>
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
                <TeacherTrackingForm
                  refetch={refetch}
                  open={openForm}
                  setOpen={setOpenForm}
                />
              </>
            )}

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
            {authUser.hasPrivilege('rm:tt:report') && (
              <Tooltip content="Exportar excel" relationship="description">
                <button
                  disabled={
                    isLoading || !evaluations || evaluations?.data?.length === 0
                  }
                  className="flex disabled:opacity-50 disabled:grayscale font-semibold items-center gap-1"
                  onClick={() => setOpenReport(true)}
                >
                  <DocumentTableRegular
                    fontSize={20}
                    className="dark:text-blue-600 text-blue-700"
                  />
                  Excel
                </button>
              </Tooltip>
            )}
            <TTFilters
              filters={filters}
              setFilters={setFilters}
              setSidebarIsOpen={setOpenFilters}
              sidebarIsOpen={openFilters}
            />
            <SearchBox onSearch={setValue} placeholder="Filtrar " />
          </nav>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" invisible />
              <TableHeaderCell className="max-lg:!hidden">
                Curso y seccion{' '}
              </TableHeaderCell>
              <TableHeaderCell>Periodo y Programa</TableHeaderCell>
              <TableHeaderCell className="max-md:!hidden">
                Evaluado por
              </TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations?.data?.map((evaluation) => (
              <Item
                refetch={refetch}
                key={evaluation.id}
                evaluation={evaluation}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openReport}
        onOpenChange={(_, e) => setOpenReport(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              Verifica los filtros seleccionados antes de generar el reporte.
            </DialogTitle>
            <DialogContent>
              <p className="w-full">
                Puedes seguir usando el sistema mientras se genera el reporte.
                enviaremos un correo cuando esté listo o puedes descargarlo
                desde la sección de{' '}
                <Link
                  to="/m/rm/report-files"
                  target="_blank"
                  className="underline"
                >
                  archivo de reportes
                </Link>{' '}
                del módulo.
              </p>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => report()}
                disabled={reporting}
                icon={reporting ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                Generar reporte
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
