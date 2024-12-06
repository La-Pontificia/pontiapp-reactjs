import { UserTeam } from '@/types/user-team'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner
} from '@fluentui/react-components'
import { AddRegular, DeleteRegular, PenRegular } from '@fluentui/react-icons'
import React from 'react'
import TeamForm from '../form'
import { api } from '@/lib/api'
import { toast } from '@/commons/toast'
import { useNavigate } from 'react-router'
import { User } from '@/types/user'
import UserDrawer from '@/components/user-drawer'
import { handleError } from '@/utils'

export default function CollaboratorsTeamSlugNav({
  isLoading,
  team,
  refetch,
  refetchMembers
}: {
  isLoading: boolean
  team?: UserTeam
  refetch: () => void
  refetchMembers: () => void
}) {
  const [openEdit, setOpenEdit] = React.useState(false)
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const [addingMembers, setAddingMembers] = React.useState(false)
  const [addingOwners, setAddingOwners] = React.useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await api.post(`partials/teams/${team?.id}/delete`)
    if (!res.ok) {
      setDeleting(false)
      return toast(handleError(res.error))
    }
    setDeleting(false)
    toast('Equipo eliminado correctamente')
    navigate('/modules/collaborators/teams')
  }

  const handleAddMembers = async (users: User[]) => {
    setAddingMembers(true)
    const res = await api.post(`partials/teams/${team?.id}/addMembers`, {
      data: JSON.stringify({
        members: users.map((user) => user.id)
      })
    })
    if (!res.ok) {
      setAddingMembers(false)
      return toast(handleError(res.error))
    }
    refetchMembers()
    toast('Miembros añadidos correctamente')
    setAddingMembers(false)
  }

  const handleAddOwners = async (users: User[]) => {
    setAddingOwners(true)
    const res = await api.post(`partials/teams/${team?.id}/addMembers`, {
      data: JSON.stringify({
        owners: users.map((user) => user.id)
      })
    })
    if (!res.ok) {
      setAddingOwners(false)
      return toast(handleError(res.error))
    }
    refetchMembers()
    toast('Propietarios añadidos correctamente')
    setAddingOwners(false)
  }

  return (
    <header className="border-b min-h-[100px] border-neutral-500/20 py-5">
      {isLoading && (
        <div className="flex h-full justify-center items-center">
          <Spinner />
        </div>
      )}
      {!isLoading && team && (
        <div className="flex items-center gap-5">
          <Avatar
            size={64}
            color="colorful"
            name={team.name}
            aria-label={team.name}
            image={{
              src: team.photoURL
            }}
          />
          <div className="space-y-1.5 flex-grow">
            <h2 className="font-bold leading-4 tracking-tight text-lg line-clamp-1">
              {team.name}
            </h2>
            <p className="text-xs opacity-60 line-clamp-1">
              {team.description}
            </p>
          </div>
          <div className="flex [&>div]:px-4 divide-x divide-neutral-500/30 items-center">
            <div className="flex">
              <UserDrawer
                title="Añadir propietarios"
                onSubmitTitle="Añadir"
                onSubmit={handleAddOwners}
                includeCurrentUser
                max={400}
                triggerProps={{
                  appearance: 'subtle',
                  style: {
                    flexDirection: 'column',
                    gap: '0.3rem',
                    padding: '0.5rem 0.5rem'
                  },
                  disabled: addingOwners,
                  icon: addingOwners ? (
                    <Spinner size="tiny" />
                  ) : (
                    <AddRegular fontSize={30} className="dark:text-blue-500" />
                  ),

                  size: 'small',
                  children: (
                    <span className="max-lg:hidden">Añadir propietarios</span>
                  )
                }}
              />

              <UserDrawer
                title="Añadir miembros"
                onSubmitTitle="Añadir"
                onSubmit={handleAddMembers}
                includeCurrentUser
                max={400}
                triggerProps={{
                  appearance: 'subtle',
                  style: {
                    flexDirection: 'column',
                    gap: '0.3rem',
                    padding: '0.5rem 0.5rem'
                  },
                  disabled: addingMembers,
                  icon: addingMembers ? (
                    <Spinner size="tiny" />
                  ) : (
                    <AddRegular fontSize={30} className="dark:text-blue-500" />
                  ),

                  size: 'small',
                  children: (
                    <span className="max-lg:hidden">Añadir miembros</span>
                  )
                }}
              />

              <Dialog
                open={openEdit}
                onOpenChange={(_, e) => setOpenEdit(e.open)}
                modalType="modal"
              >
                <DialogTrigger disableButtonEnhancement>
                  <Button
                    appearance="subtle"
                    style={{
                      flexDirection: 'column',
                      gap: '0.3rem',
                      padding: '0.5rem 0.5rem'
                    }}
                    icon={
                      <PenRegular
                        fontSize={30}
                        className="dark:text-blue-500"
                      />
                    }
                    size="small"
                  >
                    <span className="max-lg:hidden">Editar</span>
                  </Button>
                </DialogTrigger>
                <DialogSurface aria-describedby={undefined}>
                  <TeamForm
                    defaultValue={team}
                    refetch={refetch}
                    onOpenChange={setOpenEdit}
                  />
                </DialogSurface>
              </Dialog>

              <Button
                appearance="subtle"
                style={{
                  flexDirection: 'column',
                  gap: '0.3rem',
                  padding: '0.5rem 0.5rem'
                }}
                onClick={() => setOpenDelete(true)}
                icon={
                  <DeleteRegular fontSize={30} className="dark:text-blue-500" />
                }
                size="small"
              >
                <span className="max-lg:hidden">Eliminar</span>
              </Button>

              <Dialog
                open={openDelete}
                onOpenChange={(_, e) => setOpenDelete(e.open)}
                modalType="alert"
              >
                <DialogSurface>
                  <DialogBody>
                    <DialogTitle>
                      ¿Estás seguro de eliminar el equipo {team.name}?
                    </DialogTitle>
                    <DialogContent>
                      Al eliminar el equipo {team.name} ya no pertenecerá a la
                      organización.
                    </DialogContent>
                    <DialogActions>
                      <DialogTrigger disableButtonEnhancement>
                        <Button appearance="secondary">Cancelar</Button>
                      </DialogTrigger>
                      <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        icon={deleting ? <Spinner size="tiny" /> : undefined}
                        appearance="primary"
                      >
                        ELiminar
                      </Button>
                    </DialogActions>
                  </DialogBody>
                </DialogSurface>
              </Dialog>
            </div>
            <div className="max-lg:hidden">
              <h2 className="text-2xl font-semibold text-center">
                {team.ownersCount}
              </h2>
              <p className="text-xs opacity-60">
                {team.ownersCount === 1 ? 'Propietario' : 'Propietarios'}
              </p>
            </div>
            <div className="max-lg:hidden">
              <h2 className="text-2xl font-semibold text-center">
                {team.membersCount}
              </h2>
              <p className="text-xs opacity-60">
                {team.membersCount === 1 ? 'Miembro' : 'Miembros'}
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
