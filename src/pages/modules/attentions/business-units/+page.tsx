import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { GlobeRegular } from '@fluentui/react-icons'
import { Avatar, Button, Checkbox, Spinner } from '@fluentui/react-components'
import React from 'react'
import { BusinessUnit } from '~/types/business-unit'
import { useAuth } from '~/store/auth'
import { toast } from 'anni'
import { handleError } from '~/utils'

export default function AttentionsBusinessUnitsPage() {
  const { user: authUser } = useAuth()
  const [fetching, setFetching] = React.useState(false)
  const {
    data,
    isLoading: isLoading,
    refetch
  } = useQuery<{
    atttentionBusinessUnits: BusinessUnit[]
    businessUnits: BusinessUnit[]
  }>({
    queryKey: ['attentions/businessUnits', 'all'],
    queryFn: async () => {
      const res = await api.get<{
        atttentionBusinessUnits: BusinessUnit[]
        businessUnits: BusinessUnit[]
      }>('attentions/businessUnits')
      if (!res.ok)
        return {
          atttentionBusinessUnits: [],
          businessUnits: []
        }
      return {
        atttentionBusinessUnits: res.data.atttentionBusinessUnits.map(
          (b) => new BusinessUnit(b)
        ),
        businessUnits: res.data.businessUnits.map((b) => new BusinessUnit(b))
      }
    }
  })

  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  React.useEffect(() => {
    if (data?.atttentionBusinessUnits) {
      setSelectedIds(data.atttentionBusinessUnits.map((b) => b.id))
    }
  }, [data?.atttentionBusinessUnits])

  const onUpdate = async () => {
    setFetching(true)
    const res = await api.post('attentions/businessUnits/update', {
      data: JSON.stringify({
        ids: selectedIds
      })
    })

    if (!res.ok) {
      toast.error(handleError(res.error))
    } else {
      refetch()
      toast('Unidades de negocio actualizadas correctamente')
    }
    setFetching(false)
  }

  return (
    <div className="flex px-3 flex-col w-full pb-3 overflow-auto h-full">
      <h1 className="pt-4 text-xs dark:text-blue-600 text-blue-500">
        Selecciona las unidades de negocio que estarán disponibles para las
        atenciones.
      </h1>
      <div className="overflow-auto flex-grow rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          data && (
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="dark:text-neutral-400 text-xs font-semibold [&>td]:py-2 [&>td]:px-2">
                    <td className="min-w-[50px] max-w-[50px] w-[50px]"></td>
                    <td className="text-nowrap">Unidad</td>
                    <td className="text-nowrap">Acrónimo</td>
                    <td className="text-nowrap">Dominio</td>
                  </tr>
                </thead>
                <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
                  {data.businessUnits.map((business) => {
                    const domainURL = business.domain.startsWith('https')
                      ? business.domain
                      : `https://${business.domain}`

                    const isSelected = selectedIds.includes(business.id)
                    return (
                      <tr
                        key={business.id}
                        className="relative bg-white dark:bg-[#292827] [&>td]:text-nowrap group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
                      >
                        <td>
                          <div>
                            <Checkbox
                              checked={isSelected}
                              onChange={(_, state) => {
                                if (state.checked) {
                                  setSelectedIds([...selectedIds, business.id])
                                } else {
                                  setSelectedIds(
                                    selectedIds.filter(
                                      (id) => id !== business.id
                                    )
                                  )
                                }
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Avatar
                              name={business.name}
                              color="colorful"
                              size={40}
                            />
                            <p>{business.name}</p>
                          </div>
                        </td>
                        <td>
                          <p className="font-semibold">{business.acronym}</p>
                        </td>
                        <td>
                          <a
                            target="_blank"
                            href={domainURL}
                            className="flex items-center dark:text-blue-600 gap-1.5 hover:underline text-nowrap"
                          >
                            <GlobeRegular fontSize={20} />
                            {domainURL}
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <footer className="py-3">
                <Button
                  disabled={
                    selectedIds.length === 0 ||
                    isLoading ||
                    !authUser.hasPrivilege('attentions:businessUnits:update') ||
                    selectedIds.length ===
                      data?.atttentionBusinessUnits.length ||
                    fetching
                  }
                  onClick={onUpdate}
                >
                  Actualizar
                </Button>
              </footer>
            </div>
          )
        )}
      </div>
    </div>
  )
}
