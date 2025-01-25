import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled } from '@fluentui/react-icons'
import Form from './form'
import { Spinner } from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import Item from './terminal'
import { ResponsePaginate } from '~/types/paginate-response'
import { toast } from 'anni'
import { handleError } from '~/utils'
import { AssistTerminal } from '~/types/assist-terminal'
import SearchBox from '~/commons/search-box'

export default function AssistTerminalsPage() {
  const [items, setItems] = React.useState<AssistTerminal[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<AssistTerminal[]>>(
    {} as ResponsePaginate<AssistTerminal[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [q, setQ] = React.useState<string>()

  const query = `partials/assist-terminals/all?paginate=true&relationship=schedulesCount${
    q ? `&q=${q}` : ''
  }`
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    AssistTerminal[]
  > | null>({
    queryKey: ['roles/contract-types/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<AssistTerminal[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<AssistTerminal[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((c) => new AssistTerminal(c))
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
    setItems(data.data.map((c) => new AssistTerminal(c)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 400,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex w-full px-3 flex-col overflow-y-auto h-full">
      <nav className="pb-3 pt-4 flex flex-wrap w-full border-b border-neutral-500/30 items-center gap-4">
        <div className="flex-grow flex flex-wrap">
          <h2 className="font-semibold text-xl pr-2">Terminales biométricos</h2>
          <Form
            refetch={refetch}
            triggerProps={{
              disabled: isLoading,
              style: {
                borderRadius: 20
              },
              appearance: 'primary',
              icon: <AddFilled />,
              children: <span>Nuevo</span>
            }}
          />
        </div>
        <SearchBox
          className="min-w-[400px]"
          disabled={isLoading}
          value={searchValue}
          dismiss={() => setQ('')}
          onChange={(e) => {
            if (e.target.value === '') setQ(undefined)
            handleChange(e.target.value)
          }}
          placeholder="Filtrar por nombre"
        />
      </nav>
      <div className="overflow-auto rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          <table className="w-full relative">
            <thead>
              <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
                <td className="max-w-[200px] min-w-[200px]">Nombre</td>
                <td>Base de datos</td>
                <td>Horarios</td>
                <td>Fecha creación</td>
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
