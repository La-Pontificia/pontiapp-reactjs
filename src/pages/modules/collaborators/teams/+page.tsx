import {
  Button,
  Dialog,
  DialogSurface,
  DialogTrigger
} from '@fluentui/react-components'
import { PeopleTeamAddRegular } from '@fluentui/react-icons'
import TeamForm from './form'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserTeam } from '@/types/user-team'
import { api } from '@/lib/api'
import GridTeams from './grid'

export default function CollaboratorsTeamsPage() {
  const [openForm, setOpenForm] = React.useState(false)

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
    <div>
      <nav className="p-4">
        <Dialog
          open={openForm}
          onOpenChange={(_, e) => setOpenForm(e.open)}
          modalType="modal"
        >
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="outline" className="gap-2">
              <PeopleTeamAddRegular
                fontSize={20}
                className="dark:text-blue-500"
              />
              <span>Crear equipo</span>
            </Button>
          </DialogTrigger>
          <DialogSurface aria-describedby={undefined}>
            <TeamForm refetch={refetch} onOpenChange={setOpenForm} />
          </DialogSurface>
        </Dialog>
      </nav>
      <div>
        <GridTeams isLoading={isLoading} refetch={refetch} teams={data || []} />
      </div>
    </div>
  )
}
