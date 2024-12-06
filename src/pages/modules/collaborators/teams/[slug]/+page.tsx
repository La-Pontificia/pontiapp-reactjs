import { api } from '@/lib/api'
import { UserTeam, UserTeamMember } from '@/types/user-team'
import { SearchBox, Spinner } from '@fluentui/react-components'
import { Search20Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router'
import { ResponsePaginate } from '@/types/paginate-response'
import UserTeamsMemersGrid from './grid'
import { toast } from '@/commons/toast'
import { useDebounced } from '@/hooks/use-debounced'
import CollaboratorsTeamSlugNav from './nav'
import { handleError } from '@/utils'

export default function CollaboratorsTeamSlugPage() {
  const [loadingMore, setLoadingMore] = React.useState(false)
  const params = useParams<{
    slug: string
  }>()

  const [members, setMembers] = React.useState<UserTeamMember[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<UserTeamMember[]>>(
    {} as ResponsePaginate<UserTeamMember[]>
  )

  const [q, setQ] = React.useState<string>()

  const getQuery = () => {
    let query = '?relationship=user.role.job,user.role.department,user.userRole'
    if (q) query += `&q=${q}`
    return query
  }

  const {
    data: team,
    refetch: refetchTeam,
    isLoading
  } = useQuery({
    queryKey: ['teams', params.slug],
    queryFn: async () => {
      const res = await api.get<UserTeam>('partials/teams/' + params.slug)
      if (!res.ok) return
      return new UserTeam(res.data)
    }
  })

  const {
    data,
    isLoading: isMemberLoading,
    refetch: refetchMembers
  } = useQuery<ResponsePaginate<UserTeamMember[]> | null>({
    queryKey: ['teams/members', params.slug, getQuery()],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<UserTeamMember[]>>(
        `partials/teams/${params.slug}/members${getQuery()}`
      )
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<UserTeamMember[]>>(
      `partials/teams/${params.slug}/members${getQuery()}&page=${
        info.current_page + 1
      }`
    )
    if (res.ok) {
      setMembers((prev) => [
        ...prev,
        ...res.data.data.map((user) => new UserTeamMember(user))
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
    setMembers(data.data.map((team) => new UserTeamMember(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 300,
    onCompleted: (value) => setQ(value)
  })

  return (
    <div className="flex flex-col flex-grow h-full overflow-y-auto">
      <CollaboratorsTeamSlugNav
        isLoading={isLoading}
        refetchMembers={refetchMembers}
        refetch={refetchTeam}
        team={team}
      />

      <div className="flex-grow h-full flex overflow-y-auto flex-col">
        <nav className="py-2">
          <SearchBox
            disabled={isMemberLoading}
            value={searchValue}
            dismiss={{
              onClick: () => setQ('')
            }}
            onChange={(_, e) => {
              if (e.value === '') setQ('')
              handleChange(e.value)
            }}
            contentBefore={<Search20Regular className="text-blue-500" />}
            placeholder="Buscar colaborador"
          />
        </nav>
        <div className="flex-grow h-full overflow-y-auto">
          <UserTeamsMemersGrid
            members={members}
            isLoading={isMemberLoading}
            isLoadingMore={loadingMore}
            refetch={refetchMembers}
          />
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
    </div>
  )
}
