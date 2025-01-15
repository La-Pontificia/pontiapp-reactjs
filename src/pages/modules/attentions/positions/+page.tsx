import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled } from '@fluentui/react-icons'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Spinner
} from '@fluentui/react-components'
import React from 'react'
import { useAuth } from '~/store/auth'
import Form from './form'
import Item from './position'
import { AttentionPosition } from '~/types/attention-position'
import { Helmet } from 'react-helmet'

export default function AttentionsPositionsPage() {
  const { user: authUser } = useAuth()
  const { data, isLoading, refetch } = useQuery<AttentionPosition[]>({
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
    <div className="flex px-2 relative flex-col w-full py-3 overflow-hidden h-full">
      <Helmet>
        <title>Puestos de atenciones | PontiApp</title>
      </Helmet>
      <nav className="flex items-center py-2 border-b border-neutral-500/20">
        <Form
          refetch={refetch}
          triggerProps={{
            disabled:
              isLoading || !authUser.hasPrivilege('events:positions:create'),
            appearance: 'primary',
            icon: <AddFilled />,
            children: <span>Registrar puesto de atención</span>
          }}
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
                      <h1 className="font-semibold capitalize text-sm">
                        {item.business.name}{' '}
                        <span className="opacity-60 text-sm">
                          {item.positions.length} puesto
                          {item.positions.length > 1 ? 's' : ''}
                        </span>
                      </h1>
                    </AccordionHeader>
                    <AccordionPanel className="lg:pl-14 pb-5">
                      <table className="w-full">
                        <thead>
                          <tr className="dark:text-neutral-400 font-semibold text-xs [&>td]:py-2 [&>td]:px-2">
                            <td className="max-w-[0px] w-[0px]"></td>
                            <td className="text-nowrap">Puesto de atención</td>
                            <td className="text-nowrap">Atendiendo ahora</td>
                            <td className="text-nowrap">Disponible</td>
                            <td>Servicios </td>
                            <td></td>
                          </tr>
                        </thead>
                        <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
                          {positionsOrdered?.map((position) => (
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
        )}
      </div>
    </div>
  )
}
