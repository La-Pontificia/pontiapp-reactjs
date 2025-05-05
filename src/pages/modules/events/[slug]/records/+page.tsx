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
  TableSelectionCell
} from '@fluentui/react-components'
import { FolderPeopleRegular } from '@fluentui/react-icons'
import React from 'react'
import { Helmet } from 'react-helmet'
import SearchBox from '@/commons/search-box'
import { useDebounced } from '@/hooks/use-debounced'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ResponsePaginate } from '@/types/paginate-response'
import { api } from '@/lib/api'
import Pagination from '@/commons/pagination'
import { useSlugEvent } from '../+layout'
import { EventRecord } from '@/types/event-record'
import Item from './item'
import { toast } from 'anni'
import { handleError } from '@/utils'
import { Link } from 'react-router'
import { useAuth } from '@/store/auth'
import { ExcelColored } from '@/icons'

export type FiltersValues = {
  q: string | null
  page: number
}
export default function RecordsPage() {
  const { user: authUser } = useAuth()
  const { event } = useSlugEvent()
  const [openReport, setOpenReport] = React.useState(false)
  const [filters, setFilters] = React.useState<FiltersValues>({
    q: null,
    page: 1
  })
  const query = React.useMemo(() => {
    let uri = '?paginate=true'
    uri += `&eventId=${event.id}`
    if (filters.q) uri += `&q=${filters.q}`
    if (filters.page) uri += `&page=${filters.page}`
    return uri
  }, [filters, event])

  const { value: searchValue, handleChange } = useDebounced({
    onCompleted: (value) => {
      setFilters((prev) => ({ ...prev, q: value }))
    }
  })

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    EventRecord[]
  > | null>({
    queryKey: ['events/records', filters, event.id],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<EventRecord[]>>(
        'events/records' + query
      )
      if (!res.ok) return null
      return {
        ...res.data,
        data: res.data.data.map((item) => new EventRecord(item))
      }
    }
  })

  const { mutate: handleReport, isPending } = useMutation({
    mutationFn: () =>
      api.post('events/records/report' + query, {
        alreadyHandleError: false
      }),
    onError: (error) => {
      toast.error(handleError(error.message))
    },
    onSuccess: () => {
      toast.success('Reporte en proceso de generación, te notificaremos.')
      setOpenReport(false)
    }
  })

  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <Helmet>
        <title>
          Eventos {'>'} {event.name} | Pontiapp
        </title>
      </Helmet>
      <nav className="flex items-center gap-3 flex-wrap w-full px-3 max-lg:py-2">
        <h1 className="font-semibold flex-grow text-lg">
          Asistentes del evento
        </h1>
        <div className="ml-auto flex max-md:w-full">
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
          {authUser.hasPrivilege('events:records:report') && (
            <div className="ml-auto">
              <Button
                disabled={isLoading || !event}
                onClick={() => setOpenReport(true)}
                icon={<ExcelColored />}
                appearance="transparent"
              >
                Excel
              </Button>
            </div>
          )}
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
                  <TableHeaderCell className="w-[280px]">
                    Asistente
                  </TableHeaderCell>
                  <TableHeaderCell>Unidad</TableHeaderCell>
                  <TableHeaderCell>Hora de ingreso</TableHeaderCell>
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
                  to="/m/events/report-files"
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
                onClick={() => handleReport()}
                disabled={isPending}
                icon={isPending ? <Spinner size="tiny" /> : undefined}
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
