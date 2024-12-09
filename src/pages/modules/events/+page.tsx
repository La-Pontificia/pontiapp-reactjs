import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled, Search20Regular } from '@fluentui/react-icons'
// import Form from './form'
import { SearchBox, Spinner } from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '@/hooks/use-debounced'
import { ResponsePaginate } from '@/types/paginate-response'
import { toast } from '@/commons/toast'
import { handleError } from '@/utils'
import { Event } from '@/types/event'
import Item from './event'
import Form from './form'
import { useAuth } from '@/store/auth'

export default function EventsPage() {
  const { user: authUser } = useAuth()
  const [items, setItems] = React.useState<Event[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<Event[]>>(
    {} as ResponsePaginate<Event[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [q, setQ] = React.useState<string>()

  const query = `events/all?paginate=true&relationship=recordsCount,creator${
    q ? `&q=${q}` : ''
  }`
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Event[]
  > | null>({
    queryKey: ['events/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Event[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<Event[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((user) => new Event(user))
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
    setItems(data.data.map((team) => new Event(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex flex-col w-full pb-3 overflow-auto h-full">
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center gap-4">
        <Form
          refetch={refetch}
          triggerProps={{
            disabled: isLoading || !authUser.hasPrivilege('events:create'),
            appearance: 'primary',
            icon: <AddFilled />,
            children: <span>Nuevo</span>
          }}
        />
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
          placeholder="Buscar evento"
        />
        <p className="text-xs dark:text-blue-500">
          {items.length} evento{items.length > 1 ? 's' : ''} encontrado
          {items.length > 1 ? 's' : ''}
        </p>
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
                <td className="min-w-[400px]">Evento</td>
                <td>Fecha</td>
                <td>Registros</td>
                <td>Creador</td>
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
