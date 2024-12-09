import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { DockRegular, Search20Regular } from '@fluentui/react-icons'
// import Form from './form'
import {
  Button,
  Combobox,
  Option,
  SearchBox,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '@/hooks/use-debounced'
import { ResponsePaginate } from '@/types/paginate-response'
import { toast } from '@/commons/toast'
import { handleError } from '@/utils'
import Item from './record'
import { EventRecord } from '@/types/event-record'
import { BusinessUnit } from '@/types/business-unit'
import { Event } from '@/types/event'
// import { useAuth } from '@/store/auth'

export default function EventsRecordsPage() {
  //   const { user: authUser } = useAuth()
  const [items, setItems] = React.useState<EventRecord[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<EventRecord[]>>(
    {} as ResponsePaginate<EventRecord[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [business, setBusiness] = React.useState<BusinessUnit>()
  const [event, setEvent] = React.useState<Event>()
  const [q, setQ] = React.useState<string>()

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

  return (
    <div className="flex flex-col w-full pb-3 overflow-auto h-full">
      <nav className="pb-3 pt-4 flex-wrap flex border-b border-neutral-500/30 items-center gap-2">
        <SearchBox
          appearance="filled-lighter-shadow"
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
          appearance="filled-lighter"
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
          appearance="filled-lighter"
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
        <div className="ml-auto">
          <Button
            icon={<DockRegular />}
            appearance="secondary"
            style={{
              border: 0
            }}
          >
            <span className="hidden xl:block">Generar reporte</span>
          </Button>
        </div>
      </nav>
      <div className="overflow-auto flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
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
            <tbody>
              {!isLoading &&
                items?.map((item) => (
                  <Item refetch={refetch} key={item.id} item={item} />
                ))}
            </tbody>
          </table>
        )}
      </div>
      {info && (
        <footer className="flex p-5 justify-center">
          <div className="flex justify-between w-full">
            <p className="flex basis-0 flex-grow">
              Mostrando {info.from} - {info.to} de {info.total} resultados
            </p>
            {info.next_page_url && (
              <button
                disabled={loadingMore}
                onClick={nextPage}
                className="dark:text-blue-500 hover:underline"
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
    </div>
  )
}
