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
import { AttentionService } from '~/types/attention-service'
import Item from './service'
import { Helmet } from 'react-helmet'

export default function AttentionsServicesPage() {
  const { user: authUser } = useAuth()
  const [items, setItems] = React.useState<AttentionService[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<AttentionService[]>>(
    {} as ResponsePaginate<AttentionService[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [q, setQ] = React.useState<string>()

  const query = `attentions/services/all?paginate=true&relationship=position,position.business${
    q ? `&q=${q}` : ''
  }`
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    AttentionService[]
  > | null>({
    queryKey: ['attentions/services/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<AttentionService[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<AttentionService[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((user) => new AttentionService(user))
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
    setItems(data.data.map((team) => new AttentionService(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex px-3 flex-col w-full pb-3 overflow-auto h-full">
      <Helmet>
        <title>Servicios/Opciones de atención | PontiApp</title>
      </Helmet>
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center gap-4">
        <Form
          refetch={refetch}
          triggerProps={{
            disabled:
              isLoading || !authUser.hasPrivilege('attentions:services:create'),
            appearance: 'primary',
            icon: <AddFilled />,
            children: <span>Nuevo</span>
          }}
        />
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
          placeholder="Buscar opcioninset-0 "
        />
      </nav>
      <div className="overflow-auto flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="dark:text-neutral-400 font-semibold [&>td]:py-2 [&>td]:px-2">
                  <td className="text-nowrap">Nombre</td>
                  <td className="text-nowrap">Puesto de atención</td>
                  <td className="text-nowrap">Unidad de negocio</td>
                  <td></td>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-500/20">
                {items.map((service) => (
                  <Item key={service.id} item={service} refetch={refetch} />
                ))}
              </tbody>
            </table>
          </div>
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
