import {
  Button,
  Dialog,
  DialogSurface,
  Spinner
} from '@fluentui/react-components'
import { PeopleTeamAddRegular } from '@fluentui/react-icons'
import TeamForm from './form'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserTeam } from '~/types/user-team'
import { api } from '~/lib/api'
import GridTeams from './grid'
import { useAuth } from '~/store/auth'
import { Helmet } from 'react-helmet'

export default function CollaboratorsTeamsPage() {
  const [openForm, setOpenForm] = React.useState(false)
  const { user: authUser } = useAuth()

  const {
    data: teams,
    isLoading,
    refetch
  } = useQuery<UserTeam[]>({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await api.get<UserTeam[]>(
        'partials/teams/all?relationship=membersCount,ownersCount'
      )
      if (!res.ok) return []
      return res.data.map((d) => new UserTeam(d))
    }
  })
  return (
    <div className="w-full">
      <Helmet>
        <title>Equípos - Ponti App</title>
      </Helmet>
      <nav className="p-4">
        {authUser.hasPrivilege('users:teams:create') && (
          <Button
            onClick={() => setOpenForm(true)}
            appearance="outline"
            className="gap-2"
          >
            <PeopleTeamAddRegular
              fontSize={20}
              className="dark:text-blue-500"
            />
            <span>Crear equipo</span>
          </Button>
        )}
        {openForm && (
          <Dialog
            open={openForm}
            onOpenChange={(_, e) => setOpenForm(e.open)}
            modalType="modal"
          >
            <DialogSurface aria-describedby={undefined}>
              <TeamForm refetch={refetch} onOpenChange={setOpenForm} />
            </DialogSurface>
          </Dialog>
        )}
      </nav>
      <div>
        {isLoading && (
          <div className="flex-grow grid place-content-center">
            <Spinner size="large" />
          </div>
        )}

        {!isLoading && teams && teams?.length < 1 && (
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

        {!isLoading && teams && teams?.length > 0 && (
          <GridTeams refetch={refetch} teams={teams || []} />
        )}
      </div>
    </div>
  )
}
