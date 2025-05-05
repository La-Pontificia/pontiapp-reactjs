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
import { useMutation, useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import Item from './item'
import { Program } from '@/types/academic/program'
import { useAuth } from '@/store/auth'
import { TableContainer } from '@/components/table-container'
import { useDebounce } from 'hothooks'
import { useSlugSchedules } from './+layout'
import { handleError } from '@/utils'
import { toast } from 'anni'
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger, Spinner } from '@fluentui/react-components'
import { Link } from 'react-router'
import { AddFilled } from '@fluentui/react-icons'
import { ExcelColored } from '@/icons'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function ScheduleProgramsPage() {
  const { businessUnit } = useAuth()
  const { period, breadcrumbsComp } = useSlugSchedules()
  const [selected, setSelected] = React.useState<Program[]>([])
  const [openReport, setOpenReport] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&businessUnitId=${businessUnit?.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`

    return uri
  }, [filters, businessUnit])

  const { setValue } = useDebounce<string | null>({
    delay: 500,
    onFinish: (value) => setFilters((prev) => ({ ...prev, q: value }))
  })

  const { data, isLoading } = useQuery<ResponsePaginate<Program[]> | null>({
    queryKey: ['academic/programs', filters, businessUnit],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Program[]>>(
        'academic/programs' + query
      )
      if (!res.ok) return null
      return res.data
    }
  })


  const allSelected = React.useMemo(() => {
    return selected.length === data?.data.length
  }, [data, selected])

  const someSelected = React.useMemo(() => {
    return selected.length > 0 && !allSelected
  }, [allSelected, selected])

  const { mutate: handleReport, isPending: reporting } = useMutation({
    mutationFn: () =>
      api.post(
        `academic/sections/courses/schedules/report?programIds=${selected.map((item) => item.id).join(',')}&periodId=${period.id}`,
        {
          alreadyHandleError: false
        }
      ),
    onSuccess: () => {
      toast.success(
        'Reporte en proceso, Le enviaremos un correo cuando esté listo.'
      )
      setOpenReport(false)
    },
    onError: (error) => {
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
              <div className='mt-4'>
                <p>
                  Periodo: {period.name}
                </p>
                <p>Programas seleccionados</p>
                {
                  selected.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {selected.map((item) => (
                        <li key={item.id}>{item.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No hay programas seleccionados</p>
                  )
                }
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={() => handleReport()}
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

      <Helmet>
        <title>
          Horarios {'|'} {period.name} | Pontiapp
        </title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={!data?.data.length}
        nav={
          <nav className="flex items-center gap-3 flex-wrap w-full">
            {breadcrumbsComp}
            {
              selected.length > 0 && (
                <div className='absolute right-0 top-0 z-[1] px-2'>
                  <div className='bg-blue-200 dark:bg-[#082338] flex items-center gap-1 rounded-lg p-1 py-3'>
                    <div className='grow'> </div>
                    <div>
                      <Button
                        onClick={() => {
                          setSelected([])
                        }}
                        size='small'
                        icon={<AddFilled className='rotate-45' />}
                        appearance='transparent'>
                        {selected.length > 0
                          ? `Seleccionados ${selected.length}`
                          : 'Seleccionar todos'}
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenReport(true)
                        }}
                        size='small'
                        icon={<ExcelColored />}
                        appearance='transparent'>
                        Exportar Excel
                      </Button>
                    </div>

                  </div>
                </div>
              )
            }
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
              <TableSelectionCell
                checked={allSelected ? true : someSelected ? 'mixed' : false}
                onClick={() => {
                  setSelected((prev) => {
                    if (prev.length > 0) return []
                    return data?.data || []
                  })
                }}
                type="radio" />
              <TableHeaderCell>Programa</TableHeaderCell>
              <TableHeaderCell>Unidad</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((item) => (
              <Item selected={selected} setSelected={setSelected} key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
