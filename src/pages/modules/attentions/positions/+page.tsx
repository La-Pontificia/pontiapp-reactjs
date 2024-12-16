import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled, Search20Regular } from '@fluentui/react-icons'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  SearchBox,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import { ResponsePaginate } from '~/types/paginate-response'
import { toast } from '~/commons/toast'
import { handleError } from '~/utils'
import { useAuth } from '~/store/auth'
import Form from './form'
import Item from './position'
import { AttentionPosition } from '~/types/attention-position'

export default function AttentionsPositionsPage() {
  const { user: authUser } = useAuth()
  const [items, setItems] = React.useState<AttentionPosition[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<AttentionPosition[]>>(
    {} as ResponsePaginate<AttentionPosition[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [q, setQ] = React.useState<string>()

  const query = `attentions/positions/all?paginate=true&relationship=business,current${
    q ? `&q=${q}` : ''
  }`
  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    AttentionPosition[]
  > | null>({
    queryKey: ['attentions/positions/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<AttentionPosition[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<AttentionPosition[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((user) => new AttentionPosition(user))
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
    setItems(data.data.map((team) => new AttentionPosition(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  const grouped = React.useMemo(() => {
    const positionMap = items.reduce((acc, item) => {
      const businessId = item.business.id

      if (!acc[businessId]) {
        acc[businessId] = {
          business: item.business,
          positions: []
        }
      }

      acc[businessId].positions.push(item)
      return acc
    }, {} as Record<string, { business: (typeof items)[0]['business']; positions: AttentionPosition[] }>)

    return Object.values(positionMap)
  }, [items])

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
          placeholder="Buscar puesto de atención"
        />
      </nav>
      <div className="overflow-auto flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          <div className="overflow-auto">
            <Accordion multiple defaultOpenItems={[0]}>
              {grouped.map((item, index) => {
                const positionsOrdered = item.positions.sort((a, b) =>
                  a.shortName.localeCompare(b.shortName)
                )
                return (
                  <AccordionItem value={index} key={index}>
                    <AccordionHeader expandIconPosition="end" className="pr-4">
                      <h1 className="font-semibold capitalize text-base">
                        {item.business.name}{' '}
                        <span className="opacity-60 text-sm">
                          {item.positions.length} puesto
                          {item.positions.length > 1 ? 's' : ''}
                        </span>
                      </h1>
                    </AccordionHeader>
                    <AccordionPanel className="lg:pl-14 pb-10">
                      <table className="w-full">
                        <thead>
                          <tr className="dark:text-neutral-400 font-semibold [&>td]:py-2 [&>td]:px-2">
                            <td className="max-w-[80px] w-[80px]"></td>
                            <td className="text-nowrap">Puesto de atención</td>
                            <td className="text-nowrap">Atendiendo ahora</td>
                            <td className="text-nowrap">Disponible</td>
                            <td></td>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-500/20">
                          {positionsOrdered.map((position) => (
                            <Item
                              key={position.id}
                              item={position}
                              refetch={refetch}
                            />
                          ))}
                        </tbody>
                      </table>
                    </AccordionPanel>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
          // <table className="w-full relative">
          //   <tbody>
          //     {!isLoading &&
          //       items?.map((item) => (
          //         <Item refetch={refetch} key={item.id} item={item} />
          //       ))}
          //   </tbody>
          // </table>
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
