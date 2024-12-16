import { api } from '~/lib/api'
import { Area } from '~/types/area'
import { useQuery } from '@tanstack/react-query'
import { AddFilled, Search20Regular } from '@fluentui/react-icons'
import AreaForm from './form'
import AreaItem from './area'
import { SearchBox, Spinner } from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'

export default function CollaboratorsAreasPage() {
  const [q, setQ] = React.useState<string>()
  const {
    data: areas,
    isLoading,
    refetch
  } = useQuery<Area[]>({
    queryKey: ['areas/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<Area[]>(
        `partials/areas/all?relationship=departments${q ? `&q=${q}` : ''}`
      )
      if (!res.ok) return []
      return res.data.map((d) => new Area(d))
    }
  })

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex flex-col w-full pb-3 overflow-y-auto h-full">
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center gap-4">
        <AreaForm
          refetch={refetch}
          triggerProps={{
            disabled: isLoading,
            appearance: 'primary',
            icon: <AddFilled />,
            children: <span>Nuevo</span>
          }}
        />
        <SearchBox
          disabled={isLoading}
          value={searchValue}
          appearance="filled-lighter-shadow"
          dismiss={{
            onClick: () => setQ('')
          }}
          onChange={(_, e) => {
            if (e.value === '') setQ(undefined)
            handleChange(e.value)
          }}
          contentBefore={<Search20Regular className="text-blue-500" />}
          placeholder="Buscar área"
        />
        <p className="text-xs dark:text-blue-500">
          {areas && areas.length} área{areas && areas.length > 1 ? 's' : ''}{' '}
          encontrada
          {areas && areas.length > 1 ? 's' : ''}
        </p>
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
                <td>Área</td>
                <td>Código</td>
                <td>Departamentos</td>
                <td>Fecha creación</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                areas?.map((area) => (
                  <AreaItem refetch={refetch} key={area.id} area={area} />
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
