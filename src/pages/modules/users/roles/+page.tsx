import { api } from '~/lib/api'
import { useQuery } from '@tanstack/react-query'
import { AddFilled, Search20Regular } from '@fluentui/react-icons'
import Form from './form'
import { SearchBox, Spinner } from '@fluentui/react-components'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'
import Item from './role'
import { Role } from '~/types/role'
import { ResponsePaginate } from '~/types/paginate-response'
import { toast } from 'anni'
import { handleError } from '~/utils'

export default function CollaboratorsRolesPage() {
  const [items, setItems] = React.useState<Role[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<Role[]>>(
    {} as ResponsePaginate<Role[]>
  )
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [q, setQ] = React.useState<string>()

  const query = `partials/roles/all?paginate=true&relationship=job,usersCount,department${
    q ? `&q=${q}` : ''
  }`

  const { data, isLoading, refetch } = useQuery<ResponsePaginate<
    Role[]
  > | null>({
    queryKey: ['roles/all/relationship', q],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<Role[]>>(query)
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<Role[]>>(
      `${query}&page=${info.current_page + 1}`
    )
    if (res.ok) {
      setItems((prev) => [
        ...prev,
        ...res.data.data.map((user) => new Role(user))
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
    setItems(data.data.map((team) => new Role(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex flex-col pb-3 overflow-y-auto h-full">
      <nav className="pb-3 pt-4 flex border-b border-neutral-500/30 items-center gap-4">
        <Form
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
          dismiss={{
            onClick: () => setQ('')
          }}
          onChange={(_, e) => {
            if (e.value === '') setQ(undefined)
            handleChange(e.value)
          }}
          contentBefore={<Search20Regular className="text-blue-500" />}
          placeholder="Buscar cargo"
        />
        <p className="text-xs dark:text-blue-500">
          {items.length} cargo{items.length > 1 ? 's' : ''} encontrado
          {items.length > 1 ? 's' : ''}
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
                <td className="max-w-[200px] min-w-[200px]">Cargo</td>
                <td>Código</td>
                <td>Puesto</td>
                <td>Departamento</td>
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
