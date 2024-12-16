import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled, Search20Regular } from '@fluentui/react-icons'
import { SearchBox, Spinner } from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import { ResponsePaginate } from '~/types/paginate-response'
import { toast } from '~/commons/toast'
import { handleError } from '~/utils'
import { useAuth } from '~/store/auth'
import Form from './form'
import Item from './position'
import { AttentionTicket } from '~/types/attention-ticket'

export default function AttentionsTicketsPage() {
  const { user: authUser } = useAuth()
  const [items, setItems] = React.useState<AttentionTicket[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<AttentionTicket[]>>(
    {} as ResponsePaginate<AttentionTicket[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [q, setQ] = React.useState<string>()

  const query = `attentions/tickets/all?paginate=true&relationship=service.position.business${
    q ? `&q=${q}` : ''
  }`
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    AttentionTicket[]
  > | null>({
    queryKey: ['attentions/tickets/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<AttentionTicket[]>>(query)
      if (!res.ok) return null
      return res.data
    },
    refetchInterval: 10000
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<AttentionTicket[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((user) => new AttentionTicket(user))
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
    setItems(data.data.map((team) => new AttentionTicket(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex px-3 flex-col w-full pb-3 overflow-auto h-full">
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
          placeholder="Buscar ticket"
        />
      </nav>
      <div className="overflow-auto flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="dark:text-neutral-400 font-semibold [&>td]:py-2 [&>td]:px-2">
                <td className="text-nowrap">Persona</td>
                <td className="text-nowrap">Puesto</td>
                <td className="text-nowrap">Negocio</td>
                <td className="text-nowrap">Estado</td>
                <td className="text-nowrap">Tiempo</td>
                <td className="text-nowrap"></td>
                {/* <td className="text-nowrap">Atendiendo ahora</td>
                <td className="text-nowrap">Disponible</td>
                <td></td> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-500/20">
              {items.map((ticket) => (
                <Item key={ticket.id} item={ticket} refetch={refetch} />
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
