/* eslint-disable react-refresh/only-export-components */
import { api } from '@/lib/api'
import { Team, TeamMember } from '@/types/user/team'
import { SearchBox, Spinner } from '@fluentui/react-components'
import { Search20Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router'
import { ResponsePaginate } from '@/types/paginate-response'
import TeamsMemersGrid from './grid'
import { toast } from 'anni'
import { useDebounced } from '@/hooks/use-debounced'
import CollaboratorsTeamSlugNav from './nav'
import { handleError } from '@/utils'
import { useAuth } from '@/store/auth'

type State = {
  team?: Team
  isOwner?: boolean
  isOwnerLoading: boolean
  refetch: () => void
  refetchMembers: () => void
  isLoading: boolean
  isLoadingMore: boolean
  members: TeamMember[]
}
const TeamSlugContext = React.createContext<State>({} as State)

export const useTeamSlug = () => React.useContext(TeamSlugContext)

export default function CollaboratorsTeamSlugPage() {
  const { user: authUser } = useAuth()
  const [loadingMore, setLoadingMore] = React.useState(false)
  const params = useParams<{
    slug: string
  }>()

  const [members, setMembers] = React.useState<TeamMember[]>([])
  const [info, setInfo] = React.useState<ResponsePaginate<TeamMember[]>>(
    {} as ResponsePaginate<TeamMember[]>
  )

  const [q, setQ] = React.useState<string>()

  const getQuery = () => {
    let query = '?relationship=user.role.job,user.role.department,user.userRole'
    if (q) query += `&q=${q}`
    return query
  }

  const { data: isOwner, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['teams', params?.slug, 'isOwner'],
    queryFn: async () => {
      const res = await api.get<boolean>(
        `partials/teams/${params?.slug}/isOwner`
      )
      if (!res.ok) return
      return res.data
    }
  })

  const {
    data: team,
    refetch: refetchTeam,
    isLoading
  } = useQuery({
    queryKey: ['teams', params.slug],
    queryFn: async () => {
      const res = await api.get<Team>('partials/teams/' + params.slug)
      if (!res.ok) return
      return new Team(res.data)
    }
  })

  const {
    data,
    isLoading: isMemberLoading,
    refetch: refetchMembers
  } = useQuery<ResponsePaginate<TeamMember[]> | null>({
    queryKey: ['teams/members', params.slug, getQuery()],
    queryFn: async () => {
      const res = await api.get<ResponsePaginate<TeamMember[]>>(
        `partials/teams/${params.slug}/members${getQuery()}`
      )
      if (!res.ok) return null
      return res.data
    }
  })

  const nextPage = async () => {
    setLoadingMore(true)
    const res = await api.get<ResponsePaginate<TeamMember[]>>(
      `partials/teams/${params.slug}/members${getQuery()}&page=${info.current_page + 1
      }`
    )
    if (res.ok) {
      setMembers((prev) => [
        ...prev,
        ...res.data.data.map((user) => new TeamMember(user))
      ])
      setInfo({
        ...res.data,
        data: []
      })
    } else {
      toast.error(handleError(res.error))
    }
    setLoadingMore(false)
  }

  React.useEffect(() => {
    if (!data) return
    setMembers(data.data.map((team) => new TeamMember(team)))
    setInfo(data)
  }, [data])

  const { handleChange, value: searchValue } = useDebounced({
    delay: 500,
    onCompleted: (value) => setQ(value)
  })

  return (
    <TeamSlugContext.Provider
      value={{
        refetch: refetchTeam,
        isOwnerLoading,
        isOwner: isOwner || authUser.isDeveloper,
        team,
        refetchMembers,
        isLoading,
        isLoadingMore: loadingMore,
        members
      }}
    >
      <div className="flex flex-col w-full flex-grow h-full overflow-y-auto">
        <CollaboratorsTeamSlugNav />
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
          <div className="flex-grow flex flex-col h-full overflow-y-auto">
            {isMemberLoading && (
              <div className="flex-grow grid place-content-center">
                <Spinner size="large" />
              </div>
            )}

            {!isMemberLoading && members.length < 1 && (
              <div className="grid place-content-center flex-grow">
                <img
                  src="/search.webp"
                  width={90}
                  alt="No se encontraron resultados"
                  className="mx-auto"
                />
                <p className="text-xs opacity-60 pt-5">
                  No se encontraron resultados para la búsqueda
                </p>
              </div>
            )}

            {!isMemberLoading && members.length > 0 && (
              <>
                <div className="flex flex-grow items-start">
                  <TeamsMemersGrid />
                </div>
                {info && (
                  <footer className="flex p-5 justify-center">
                    <div className="flex justify-between w-full">
                      <p className="flex basis-0 flex-grow">
                        Mostrando {info.from} - {info.to} de {info.total}{' '}
                        resultados
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
              </>
            )}
          </div>
        </div>
      </div>
    </TeamSlugContext.Provider>
  )
}
