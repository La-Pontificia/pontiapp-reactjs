import React from 'react'
import { TableContainer } from '@/components/table-container'
import { useSlugSchedules } from '../+layout'
import { Helmet } from 'react-helmet'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { useDebounce } from 'hothooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { SectionCourse } from '@/types/academic/section-course'
import { api } from '@/lib/api'
import SearchBox from '@/commons/search-box'
import Pagination from '@/commons/pagination'
import Item from './item'
import {
  DialogContent,
  Button,
  Dialog,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import { ExcelColored } from '@/icons'
import { Link } from 'react-router'
import { toast } from 'anni'
import { handleError } from '@/utils'

export type FiltersValues = {
  q: string | null
  page: number
}

export default function SchedulesProgramSchedulesPage() {
  const { breadcrumbsComp, program, period } = useSlugSchedules()
  const [openReport, setOpenReport] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const [isPending, setIsPending] = React.useState({
    normal: false,
    pontisis: false,
    pontisisTeachers: false
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&programId=${program?.id}`
    uri += `&periodId=${period.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, program, period])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    SectionCourse[]
  > | null>({
    queryKey: ['academic/sections/courses', filters, program, period],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<SectionCourse[]>>(
        'academic/sections/courses' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((d) => new SectionCourse(d))
      }
    }
  })

  const queryReport = React.useMemo(() => {
    return `?programId=${program?.id}&periodId=${period.id}${
      filters.q ? `&q=${filters.q}` : ''
    }`
  }, [period, filters, program])

  const uri = (type?: string) =>
    type === 'normal'
      ? 'report'
      : type === 'pontisis'
      ? 'report-pontisis'
      : 'report-pontisis-teachers'

  const { mutate: handleReport, isPending: reporting } = useMutation({
    mutationFn: ({ type }: { type?: string }) =>
      api.post(
        `academic/sections/courses/schedules/${uri(type)}${queryReport}`.trim(),
        {
          alreadyHandleError: false
        }
      ),
    onSuccess: (data) => {
      setIsPending({
        normal: false,
        pontisis: false,
        pontisisTeachers: false
      })
      if (data.ok) {
        window.open(String(data.data), '_blank')
        setOpenReport(false)
      }
    },
    onError: (error) => {
      setIsPending({
        normal: false,
        pontisis: false,
        pontisisTeachers: false
      })
      toast.error(handleError(error.message))
    }
  })

  return (
    <>
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
                  to="/m/academic/report-files"
                  target="_blank"
                  className="underline"
                >
                  archivo de reportes
                </Link>{' '}
                del módulo.
              </p>
            </DialogContent>
            <div className="w-full col-span-2">
              <p className="text-nowrap my-2 opacity-60">
                Selecciona el tipo de reporte que deseas generar:
              </p>
              <div className="grid gap-2">
                <Button
                  onClick={() => {
                    handleReport({
                      type: 'normal'
                    })
                    setIsPending((prev) => ({
                      ...prev,
                      normal: true
                    }))
                  }}
                  disabled={reporting}
                  icon={isPending.normal ? <Spinner size="tiny" /> : undefined}
                  appearance="secondary"
                >
                  Normal
                </Button>
                <Button
                  onClick={() => {
                    handleReport({
                      type: 'pontisis'
                    })
                    setIsPending((prev) => ({
                      ...prev,
                      pontisis: true
                    }))
                  }}
                  disabled={reporting}
                  icon={
                    isPending.pontisis ? <Spinner size="tiny" /> : undefined
                  }
                  appearance="secondary"
                >
                  Para pontisis
                </Button>
                <Button
                  onClick={() => {
                    handleReport({
                      type: 'pontisisTeachers'
                    })
                    setIsPending((prev) => ({
                      ...prev,
                      pontisisTeachers: true
                    }))
                  }}
                  disabled={reporting}
                  icon={
                    isPending.pontisisTeachers ? (
                      <Spinner size="tiny" />
                    ) : undefined
                  }
                  appearance="secondary"
                >
                  Para pontisis (Docentes)
                </Button>
                <DialogTrigger disableButtonEnhancement>
                  <Button className="!mt-3" appearance="secondary">
                    Cancelar
                  </Button>
                </DialogTrigger>
              </div>
            </div>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Helmet>
        <title>Horarios | Pontiapp</title>
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
            <div>
              <Button
                disabled={isLoading}
                icon={<ExcelColored />}
                appearance="subtle"
                onClick={() => setOpenReport(true)}
              >
                Excel
              </Button>
            </div>
            <SearchBox onSearch={setValue} placeholder="Filtrar " />
          </nav>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableSelectionCell type="radio" invisible />
              <TableHeaderCell className="max-w-[150px]">
                Codigo
              </TableHeaderCell>
              <TableHeaderCell>Unidad didactica</TableHeaderCell>
              <TableHeaderCell className="max-w-[150px]">Plan</TableHeaderCell>
              <TableHeaderCell className="max-w-[200px]">
                Docente
              </TableHeaderCell>
              <TableHeaderCell className="max-w-[130px]">
                Sección
              </TableHeaderCell>
              <TableHeaderCell className="max-w-[130px]">
                Horarios
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item) => (
              <Item refetchSections={refetch} key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
