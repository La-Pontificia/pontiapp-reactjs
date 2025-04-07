import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled, Search20Regular } from '@fluentui/react-icons'
import Form from './form'
import { SearchBox, Spinner } from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import Item from './job'
import { Job } from '~/types/job'

export default function CollaboratorsJobsPage() {
  const [q, setQ] = React.useState<string>()
  const {
    data: items,
    isLoading,
    refetch
  } = useQuery<Job[]>({
    queryKey: ['jobs/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<Job[]>(
        `partials/jobs/all?relationship=roles${q ? `&q=${q}` : ''}`
      )
      if (!res.ok) return []
      return res.data.map((d) => new Job(d))
    }
  })

  const { handleChange, value: searchValue } = useDebounced({
    delay: 500,
    onCompleted: (value) => setQ(value)
  })

  const lastItem = items?.[items.length - 1]

  return (
    <div className="flex w-full flex-col pb-3 overflow-y-auto h-full">
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center gap-4">
        <Form
          refetch={refetch}
          initialValues={{
            level: (lastItem?.level ?? 0) + 1 || 1
          }}
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
          dismiss={{
            onClick: () => setQ('')
          }}
          onChange={(_, e) => {
            if (e.value === '') setQ(undefined)
            handleChange(e.value)
          }}
          contentBefore={<Search20Regular className="text-blue-500" />}
          placeholder="Buscar puestos"
        />
        <p className="text-xs dark:text-blue-500">
          {items && items?.length} puesto{items && items?.length > 1 ? 's' : ''}{' '}
          encontrado
          {items && items?.length > 1 ? 's' : ''}
        </p>
      </nav>
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
                <td>Puesto de trabajo</td>
                <td>Nivel</td>
                <td>Código</td>
                <td>Cargos</td>
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
    </div>
  )
}
