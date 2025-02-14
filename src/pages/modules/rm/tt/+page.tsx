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
import { RmTT } from '~/types/RmData'
import { useDebounced } from '~/hooks/use-debounced'
import TTFilters from './filters'
import Item from './item'
import Pagination from '~/commons/pagination'
import { format } from '~/lib/dayjs'
import { Link } from 'react-router'
import { toast } from 'anni'

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

  const [evaluations, setEvaluations] = React.useState<RmTT[]>([])
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    RmTT[]
  > | null>({
    queryKey: ['teacher-trackings', filters],
    queryFn: async () => {
      const URL = 'rm/tt' + query
      const res = await api.get<ResponsePaginate<RmTT[]>>(URL)
      if (res.ok)
        return {
          ...res.data,
          data: res.data.data.map((d) => new RmTT(d))
        }
      return null
    }
  })

  React.useEffect(() => {
    if (data) setEvaluations(data.data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    onCompleted: (value) => {
      setFilters((prev) => ({ ...prev, q: value }))
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
    <div className="flex flex-col flex-grow overflow-y-auto">
      <Helmet>
        <title>Evaluaciones y seguimiento a docentes | PontiApp</title>
      </Helmet>
      <nav className="flex items-center gap-3 flex-wrap w-full py-4 px-3 max-lg:py-2">
        <h1 className="font-semibold flex-grow text-lg">
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
              disabled={isLoading || !data || data.data.length === 0}
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
        <div className="ml-auto max-md:w-full">
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
            className="w-[300px] max-md:w-full"
            placeholder="Docente, sección, programa..."
          />
        </div>
      </nav>
      {isLoading ? (
        <div className="flex-grow grid place-content-center">
          <Spinner />
          <p className="text-xs opacity-60 pt-4">
            Cargando evaluaciones y seguimientos a docentes...
          </p>
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="overflow- flex flex-col flex-grow">
          <div className="overflow-auto flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableSelectionCell type="radio" invisible />
                  <TableHeaderCell>Docente</TableHeaderCell>
                  <TableHeaderCell>Programa y periodo</TableHeaderCell>
                  <TableHeaderCell className="max-lg:!hidden">
                    Curso y seccion{' '}
                  </TableHeaderCell>
                  <TableHeaderCell className="max-md:!hidden">
                    Evaluado por
                  </TableHeaderCell>
                  <TableHeaderCell></TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <Item
                    refetch={refetch}
                    key={evaluation.id}
                    evaluation={evaluation}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination state={data} />
        </div>
      ) : (
        <div className="flex-grow grid place-content-center text-xs">
          No hay nada que mostrar
        </div>
      )}

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
    </div>
  )
}
