import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Search20Regular } from '@fluentui/react-icons'
import {
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Option,
  SearchBox,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import { ResponsePaginate } from '~/types/paginate-response'
import { toast } from 'anni'
import { handleError } from '~/utils'
import Item from './record'
import { EventRecord } from '~/types/event-record'
import { BusinessUnit } from '~/types/business-unit'
import { Event } from '~/types/event'
import { useAuth } from '~/store/auth'
import { Link } from 'react-router'
import { ExcelColored } from '~/icons'

export default function EventsRecordsPage() {
  const { user: authUser } = useAuth()
  const [items, setItems] = React.useState<EventRecord[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<EventRecord[]>>(
    {} as ResponsePaginate<EventRecord[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [business, setBusiness] = React.useState<BusinessUnit>()
  const [event, setEvent] = React.useState<Event>()
  const [q, setQ] = React.useState<string>()

  const [openReport, setOpenReport] = React.useState(false)
  const [reporting, setReporting] = React.useState(false)

  const query = `events/records/all?paginate=true&relationship=event,business${
    q ? `&q=${q}` : ''
  }${business ? `&businessUnitId=${business.id}` : ''}${
    event ? `&eventId=${event.id}` : ''
  }`

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    EventRecord[]
  > | null>({
    queryKey: ['eventsRecords/all/relationship', query],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<EventRecord[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<EventRecord[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((user) => new EventRecord(user))
      ])
      setInfo({
        ...res.data,
        data: []
      })
    } else {
      toast(handleError(res.error))
    }
    setLoadingMore(false)
  }

  React.useEffect(() => {
    if (!data) return
    setItems(data.data.map((team) => new EventRecord(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[] | null>(
    {
      queryKey: ['events/all'],
      queryFn: async () => {
        const res = await api.get<Event[]>('events/all')
        if (!res.ok) return null
        return res.data.map((event) => new Event(event))
      }
    }
  )

  const { data: businessUnits, isLoading: isLoadingBusinessUnits } = useQuery<
    BusinessUnit[] | null
  >({
    queryKey: ['partials/businessUnits/all'],
    queryFn: async () => {
      const res = await api.get<[]>('partials/businessUnits/all')
      if (!res.ok) return null
      return res.data.map((event) => new BusinessUnit(event))
    }
  })

  const handleReport = async () => {
    setReporting(true)
    let uri = 'events/records/report?tm=true'
    if (business) uri += `&businessUnitId=${business.id}`
    if (event) uri += `&eventId=${event.id}`
    const res = await api.post(uri)
    if (!res.ok) {
      toast('Error al generar el reporte')
    } else {
      toast('Reporte en proceso de generación, te notificaremos.')
    }

    setOpenReport(false)
    setReporting(false)
  }

  return (
    <div className="flex flex-col w-full overflow-auto h-full">
      <nav className="pb-3 pt-4 flex-wrap flex border-b border-neutral-500/30 items-center gap-2">
        <SearchBox
          disabled={isLoading}
          value={searchValue}
          dismiss={{
            onClick: () => setQ('')
          }}
          onChange={(_, e) => {
            if (e.value === '') setQ(undefined)
            handleChange(e.value)
          }}
          contentBefore={<Search20Regular className="text-blue-500" />}
          placeholder="Buscar registro"
        />
        <Combobox
          input={{
            autoComplete: 'off'
          }}
          style={{
            borderRadius: 7
          }}
          disabled={isLoadingEvents || isLoading}
          onOptionSelect={(_, data) => {
            const ev = events?.find((e) => e.id === data.optionValue)
            setEvent(ev)
          }}
          value={event?.name ?? ''}
          placeholder="Evento"
        >
          {events?.map((event) => (
            <Option key={event.id} text={event.name} value={event.id}>
              {event.name}
            </Option>
          ))}
        </Combobox>
        <Combobox
          input={{
            autoComplete: 'off'
          }}
          disabled={isLoadingBusinessUnits || isLoading}
          onOptionSelect={(_, data) => {
            const b = businessUnits?.find((b) => b.id === data.optionValue)
            setBusiness(b)
          }}
          style={{
            borderRadius: 7
          }}
          value={business?.name}
          placeholder="Unidad de negocio"
        >
          {businessUnits?.map((business) => (
            <Option key={business.id} text={business.name} value={business.id}>
              {business.name}
            </Option>
          ))}
        </Combobox>
        {authUser.hasPrivilege('events:records:report') && (
          <div className="ml-auto">
            <Button
              disabled={isLoading || !event}
              onClick={() => setOpenReport(true)}
              icon={<ExcelColored />}
              appearance="secondary"
            >
              <span className="hidden xl:block">Generar reporte</span>
            </Button>
          </div>
        )}
      </nav>
      <div className="overflow-auto flex flex-col flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : items && items?.length < 1 ? (
          <div className="grid place-content-center flex-grow">
            <img
              src="/search.webp"
              width={80}
              alt="No se encontraron resultados"
              className="mx-auto"
            />
            <p className="text-xs opacity-60 pt-5">
              No se encontraron resultados para la búsqueda
            </p>
          </div>
        ) : (
          <table className="w-full relative">
            <thead>
              <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
                <td className="min-w-[300px]">Persona</td>
                <td>Unidad</td>
                <td>Evento</td>
                <td>Ingresó</td>
                <td></td>
              </tr>
            </thead>
            <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
              {!isLoading &&
                items?.map((item) => (
                  <Item refetch={refetch} key={item.id} item={item} />
                ))}
            </tbody>
          </table>
        )}
      </div>
      {info && (
        <footer className="flex p-3 justify-center">
          <div className="flex justify-between w-full">
            <p className="flex basis-0 flex-grow">
              Mostrando {info.from} - {info.to} de {info.total} resultados
            </p>
            {info.next_page_url && (
              <button
                disabled={loadingMore}
                onClick={nextPage}
                className="dark:text-blue-500 font-medium hover:underline"
              >
                {loadingMore ? <Spinner size="tiny" /> : 'Cargar más'}
              </button>
            )}
            <p className="flex basis-0 flex-grow justify-end">
              Página {info.current_page} de {info.last_page}
            </p>
          </div>
        </footer>
      )}

      {/* dialogs */}
      {openReport && (
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
                  onClick={handleReport}
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
      )}
    </div>
  )
}
