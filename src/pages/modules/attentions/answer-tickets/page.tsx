import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Spinner
} from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'
import { AttentionPosition } from '~/types/attention-position'

export default function AttentionsAnswerTickets() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery<AttentionPosition[]>({
    queryKey: ['attentions/positions/all/relationship'],
    queryFn: async () => {
      const res = await api.get<AttentionPosition[]>(
        'attentions/positions/all?relationship=business,current'
      )
      if (!res.ok) return []
      return res.data
    }
  })

  const grouped = React.useMemo(() => {
    const positionMap = data?.reduce((acc, item) => {
      const businessId = item.business.id

      if (!acc[businessId]) {
        acc[businessId] = {
          business: item.business,
          positions: []
        }
      }

      acc[businessId].positions.push(item)
      return acc
    }, {} as Record<string, { business: (typeof data)[0]['business']; positions: AttentionPosition[] }>)

    return Object.values(positionMap ?? {})
  }, [data])

  return (
    <div className="overflow-y-auto w-full flex flex-col">
      <Helmet>
        <title>Iniciar atención | PontiApp</title>
      </Helmet>
      <h1 className="py-3 px-3 text-xs dark:text-blue-600 text-blue-600">
        {user.displayName}, Elija el puesto al que desea atender
      </h1>
      <div className="overflow-auto flex-grow rounded-xl h-full">
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
                      <h1 className="font-semibold capitalize text-sm">
                        {item.business.name}{' '}
                        <span className="opacity-60 text-sm">
                          {item.positions.length} puesto
                          {item.positions.length > 1 ? 's' : ''}
                        </span>
                      </h1>
                    </AccordionHeader>
                    <AccordionPanel className="lg:pl-5 pb-5 pt-2">
                      <div className="flex gap-3 flex-wrap">
                        {positionsOrdered?.map((position) => (
                          <Link
                            key={position.id}
                            to={`/m/attentions/answer-tickets/${position.id}`}
                            className="aspect-[10/7] relative flex overflow-hidden text-left w-[120px] rounded-xl bg-neutral-500/10 hover:bg-neutral-500/20 dark:bg-neutral-500/20 hover:dark:bg-neutral-500/30"
                          >
                            <div className="p-2 pl-4 text-xs">
                              <h1 className="opacity-60 font-bold">
                                {position.shortName}
                              </h1>
                              <p className="pt-0.5">{position.name}</p>
                            </div>
                            <div
                              className="absolute left-0 inset-y-0 w-[5px]"
                              style={{ backgroundColor: position.background }}
                            />
                          </Link>
                        ))}
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  )
}
