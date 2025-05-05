import {
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  Button,
  partitionAvatarGroupItems,
} from '@fluentui/react-components'
import { PeopleAddRegular } from '@fluentui/react-icons'
// import TeamForm from './form'
// import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Team } from '@/types/user/team'
import { api } from '@/lib/api'
// import GridTeams from './grid'
import { useAuth } from '@/store/auth'
import { Helmet } from 'react-helmet'
import { TableContainer } from '@/components/table-container'
import SearchBox from '@/commons/search-box'
import { timeAgo } from '@/lib/dayjs'
import { useNavigate } from 'react-router'

export default function CollaboratorsTeamsPage() {
  // const [openForm, setOpenForm] = React.useState(false)
  const { user: authUser } = useAuth()

  const navigate = useNavigate()

  const {
    data: teams,
    isLoading,
    // refetch
  } = useQuery<Team[]>({
    queryKey: ['teams', 'all'],
    queryFn: async () => {
      const res = await api.get<Team[]>(
        'users/teams'
      )
      if (!res.ok) return []
      return res.data.map((d) => new Team(d))
    }
  })
  return (
    <>
      <Helmet>
        <title>Teams | PontiApp</title>
      </Helmet>
      <TableContainer
        isLoading={isLoading}
        isEmpty={teams?.length === 0}
        nav={
          <nav className="flex items-center gap-4 w-full pt-2 px-1">
            <h1 className="font-semibold grow text-lg">Teams</h1>
            {authUser.hasPrivilege('users:create') && (
              <>
                <button
                  // onClick={() => setCreateFormOpen(true)}
                  className="flex max-lg:hidden items-center gap-1"
                >
                  <PeopleAddRegular
                    fontSize={20}
                    className="dark:text-blue-500 text-blue-700"
                  />
                  Crear
                </button>
                {/* <FormUser open={createFormOpen} setOpen={setCreateFormOpen} /> */}
              </>
            )}
            <div className="ml-auto">
              <SearchBox
                // onSearch={setValue}
                placeholder="Filtrar"
              />
            </div>
            {/* <div className='flex items-center grow gap-2'>
              {Object.entries(filterButtons).map(([key, value]) => (
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, status: key }))
                  }}
                  data-active={filters.status === key ? '' : undefined}
                  key={key}
                  className="border text-nowrap outline outline-2 outline-transparent data-[active]:border-transparent data-[active]:dark:border-transparent data-[active]:outline-blue-600 data-[active]:dark:outline-blue-600 data-[active]:bg-blue-700/10 data-[active]:dark:bg-blue-700/20 border-stone-300 dark:border-stone-500 rounded-full py-1 px-3 font-medium"
                >
                  {value}
                </button>
              ))}
            </div>
            {authUser.hasPrivilege('users:edit') && (
              <>
                <button
                  disabled
                  onClick={() => setCreateFormOpen(true)}
                  className="flex disabled:grayscale disabled:opacity-40 max-lg:hidden items-center gap-1"
                >
                  <PenRegular
                    fontSize={20}
                    className="dark:text-blue-500 text-blue-700"
                  />
                  Editar
                </button>
                <FormUser open={createFormOpen} setOpen={setCreateFormOpen} />
              </>
            )}
            <Tooltip content="Mas filtros" relationship="description">
              <button
                onClick={() => setOpenFilters(true)}
                className="flex items-center gap-1"
              >
                <FilterAddFilled
                  fontSize={25}
                  className="dark:text-blue-500 text-blue-700"
                />
                <p className="max-md:hidden">Filtros</p>
              </button>
            </Tooltip>
            {openFilters && (
              <CollaboratorsFilters
                filters={filters}
                setFilters={setFilters}
                setSidebarIsOpen={setOpenFilters}
                sidebarIsOpen={openFilters}
              />
            )}
            */}
          </nav>
        }
      >
        <div className='p-2 grid lg:grid-cols-2 gap-4'>
          {teams?.map((team) => {
            const partitionedItems = partitionAvatarGroupItems({ items: team.members });
            return (
              <div
                onClick={() => {
                  navigate(`/users/teams/${team.id}`)
                }}
                className='flex cursor-pointer gap-2 rounded-xl overflow-hidden border-2 dark:border-neutral-800' key={team.id}>
                <div className='p-4 py-1 text-center flex flex-col justify-center aspect-[16/12] w-[170px]'>
                  <div className='opacity-50'>
                    Creado por {team.creator?.displayName} {' '}
                    {timeAgo(team.created_at)}
                  </div>
                  <div className='font-bold tracking-tight text-xl pb-1 text-ellipsis text-nowrap overflow-hidden'>
                    {team.name}
                  </div>
                </div>
                <div className='dark:bg-[#1f1f1f] flex p-3 grow'>
                  <div className='flex grow flex-col justify-center'>
                    <p>
                      {team.description}
                    </p>
                    <div className='pt-2'>
                      <AvatarGroup size={28} layout="stack">
                        {partitionedItems.inlineItems.map((member, k) => (
                          <AvatarGroupItem
                            image={{
                              src: member.photoURL,
                            }}
                            name={member.displayName} key={k} />
                        ))}
                        {partitionedItems.overflowItems && (
                          <AvatarGroupPopover>
                            {partitionedItems.overflowItems.map((member, k) => (
                              <AvatarGroupItem name={member.displayName} key={k} />
                            ))}
                          </AvatarGroupPopover>
                        )}
                      </AvatarGroup>
                    </div>
                    <div className='text-blue-500'>
                      {team.members.length} miembros
                    </div>
                  </div>
                  <div className='mt-auto'>
                    <Button
                      shape='circular'
                      onClick={() => {
                        navigate(`/users/teams/${team.id}`)
                      }}
                      appearance='secondary'
                    >
                      Ver equipo
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </TableContainer>
    </>
  )
}
