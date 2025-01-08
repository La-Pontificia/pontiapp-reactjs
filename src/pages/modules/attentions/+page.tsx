import React from 'react'
import AttentionsFilters from './filters'
import { Attention } from '~/types/attention'
import { ResponsePaginate } from '~/types/paginate-response'
import { api } from '~/lib/api'
import { toast } from '~/commons/toast'
import { handleError } from '~/utils'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Badge, Spinner } from '@fluentui/react-components'
import { countRangeMinutes, format, timeAgo } from '~/lib/dayjs'
import { ClockRegular } from '@fluentui/react-icons'
import UserHoverInfo from '~/components/user-hover-info'

export type Filter = {
  startDate: string | null
  endDate: string | null
  q: string | null
  positionId: string | null
  businessId: string | null
}
export default function AttentionsPage() {
  const [items, setItems] = React.useState<Attention[]>([])
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [info, setInfo] = React.useState<ResponsePaginate<Attention[]>>(
    {} as ResponsePaginate<Attention[]>
  )

  const [filters, setFilters] = React.useState<Filter>({
    startDate: format(new Date(), 'YYYY-MM-DD'),
    endDate: format(new Date(), 'YYYY-MM-DD'),
    q: null,
    positionId: null,
    businessId: null
  })

  const getURI = () => {
    let query = 'attentions?relationship=position,position.business,attendant'
    if (filters.q) query += `&q=${filters.q}`
    if (filters.startDate) query += `&startDate=${filters.startDate}`
    if (filters.endDate) query += `&endDate=${filters.endDate}`
    if (filters.positionId) query += `&positionId=${filters.positionId}`
    if (filters.businessId) query += `&businessUnitId=${filters.businessId}`
    return query
  }

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<Attention[]>>(
      `${getURI()}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((i) => new Attention(i))
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

  const { data, isLoading } = useQuery<ResponsePaginate<Attention[]> | null>({
    queryKey: ['attentions', filters],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Attention[]>>(getURI())
      if (!res.ok) return null
      return res.data
    }
  })

  React.useEffect(() => {
    if (!data) return
    setItems(data.data.map((i) => new Attention(i)))
    setInfo(data)
  }, [data])

  const handleAplyFilters = (filters: Filter) => {
    setFilters(filters)
  }

  return (
    <div className="w-full px-3 flex flex-col flex-grow h-full">
      <AttentionsFilters onAplyFilters={handleAplyFilters} isLoading={false} />
      <div className="overflow-auto flex flex-col rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : items && items?.length < 1 ? (
          <div className="grid place-content-center flex-grow">
            <img
              src="/search.webp"
              width={100}
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
                <td>Persona</td>
                <td>Tiempo de atención</td>
                <td>Puesto</td>
                <td>Atendido por</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                items?.map((item) => {
                  // calcule with startAttend and finishAttend

                  return (
                    <tr className="relative bg-neutral-100 dark:bg-neutral-800 odd:bg-neutral-500/20 dark:even:bg-neutral-500/30 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={item.personDisplayName}
                            color="colorful"
                            size={32}
                          />
                          <div>
                            <p>{item.personDisplayName}</p>
                            <p className="text-xs opacity-60">
                              {item.personDocumentId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p>
                          <Badge appearance="outline" icon={<ClockRegular />}>
                            {countRangeMinutes(
                              item.startAttend,
                              item.finishAttend
                            )}
                          </Badge>
                        </p>
                      </td>
                      <td>
                        <div>
                          <p>
                            <span className="opacity-60 inline-block pr-1">
                              {item.position?.shortName}
                            </span>
                            {item.position?.name}
                          </p>
                          <p className="text-xs opacity-60">
                            {item.position?.business.name}
                          </p>
                        </div>
                      </td>
                      <td>
                        <UserHoverInfo slug={item.attendant.username}>
                          <div className="flex items-center gap-2">
                            <Avatar
                              image={{
                                src: item.attendant.photoURL
                              }}
                              name={item.attendant.displayName}
                              color="colorful"
                              size={32}
                            />
                            <p>{item.attendant.displayName}</p>
                          </div>
                        </UserHoverInfo>
                      </td>
                      <td>
                        <p>{timeAgo(item.created_at)}</p>
                      </td>
                    </tr>
                  )
                })}
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
                className="dark:text-blue-500 text-blue-600 hover:underline"
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
