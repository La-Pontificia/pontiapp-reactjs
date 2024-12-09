import { Button, Dialog, DialogSurface } from '@fluentui/react-components'
import { PeopleTeamAddRegular } from '@fluentui/react-icons'
import TeamForm from './form'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserTeam } from '@/types/user-team'
import { api } from '@/lib/api'
import GridTeams from './grid'
import { useAuth } from '@/store/auth'
import { Helmet } from 'react-helmet'

export default function CollaboratorsTeamsPage() {
  const [openForm, setOpenForm] = React.useState(false)
  const { user: authUser } = useAuth()

  const { data, isLoading, refetch } = useQuery<UserTeam[]>({
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
        <Button
          onClick={() => setOpenForm(true)}
          disabled={!authUser.hasPrivilege('users:teams:create')}
          appearance="outline"
          className="gap-2"
        >
          <PeopleTeamAddRegular fontSize={20} className="dark:text-blue-500" />
          <span>Crear equipo</span>
        </Button>
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
        <GridTeams isLoading={isLoading} refetch={refetch} teams={data || []} />
      </div>
    </div>
  )
}
