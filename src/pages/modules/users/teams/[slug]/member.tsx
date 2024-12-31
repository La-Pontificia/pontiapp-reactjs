import { toast } from '~/commons/toast'
import { api } from '~/lib/api'
import { UserTeamMember } from '~/types/user-team'
import { handleError } from '~/utils'
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner
} from '@fluentui/react-components'
import {
  FolderBriefcase20Regular,
  MoreHorizontal20Filled,
  OpenRegular
} from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'
import { useTeamSlug } from './+page'

const roles = {
  member: 'Miembro',
  owner: 'Propietario'
}

export default function UserTeamMemberItem({
  member
}: {
  member: UserTeamMember
}) {
  return (
    <tr className="relative bg-stone-50/40 dark:bg-stone-900 odd:bg-stone-500/10 dark:even:bg-stone-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
      <td className=" pl-4">
        <label></label>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Avatar
            badge={{
              status: member.user.status ? 'available' : 'blocked'
            }}
            size={40}
            color="colorful"
            name={member.user.displayName}
            aria-label={member.user.displayName}
            image={{
              src: member.user.photoURL
            }}
          />
          <Link
            className="hover:underline hover:dark:text-blue-500 relative"
            to={`/m/users/${member.user.username}`}
          >
            {member.user.displayName}
          </Link>
        </div>
      </td>
      <td className="max-xl:hidden">
        <div className="flex items-start gap-2">
          <FolderBriefcase20Regular />
          <div className="">
            <div className="max-w-[30ch] text-ellipsis overflow-hidden">
              {member.user.role?.name}
            </div>
            <div className="text-xs dark:text-neutral-400">
              {member.user.role?.department?.name}
            </div>
          </div>
        </div>
      </td>
      <td>
        <p className="dark:text-blue-400 relative max-xl:max-w-[20ch] text-ellipsis overflow-hidden">
          <a href={`mailto:${member.user.email}`} className="hover:underline">
            {member.user.email}
          </a>
        </p>
      </td>
      <td>
        {member.role === 'member' ? (
          <Badge color="brand" appearance="tint">
            {roles[member.role]}
          </Badge>
        ) : (
          <Badge color="success" appearance="tint">
            {roles[member.role]}
          </Badge>
        )}
      </td>
      <td>
        <Link
          to={`/m/users/${member.user.username}`}
          className="flex items-center relative gap-2 dark:text-blue-500 hover:underline"
        >
          <OpenRegular fontSize={20} />
          Perfil
        </Link>
      </td>
      <td className="">
        <UserGridOptions member={member} />
      </td>
    </tr>
  )
}

export const UserGridOptions = ({ member }: { member: UserTeamMember }) => {
  const { isOwnerLoading, isOwner, refetchMembers } = useTeamSlug()

  const [isRemoveAlertOpen, setIRemoveAlertOpen] = React.useState(false)
  const [removingMember, setRemovingMember] = React.useState(false)

  const handleRemoveMember = async () => {
    setRemovingMember(true)
    const res = await api.post<string>(
      `partials/teams/members/${member.id}/remove`
    )
    if (!res.ok) {
      setRemovingMember(false)
      return toast(handleError(res.error))
    }
    setRemovingMember(false)
    setIRemoveAlertOpen(false)
    toast('Miembro removido del equipo')
    refetchMembers()
  }

  return (
    <>
      <Menu hasIcons positioning={{ autoSize: true }}>
        <MenuTrigger disableButtonEnhancement>
          <Button
            style={{
              padding: 0
            }}
            appearance="transparent"
            className="relative opacity-60"
          >
            <MoreHorizontal20Filled />
          </Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              disabled={isOwnerLoading || !isOwner}
              onClick={() => setIRemoveAlertOpen(true)}
            >
              Remover del equipo
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <Dialog
        open={isRemoveAlertOpen}
        onOpenChange={(_, e) => setIRemoveAlertOpen(e.open)}
        modalType="alert"
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>
              ¿Estás seguro de remover a {member.user.displayName} del equipo?
            </DialogTitle>
            <DialogContent>
              <p>
                Al remover a {member.user.displayName} del equipo ya no
                pertenerá a este.
              </p>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancelar</Button>
              </DialogTrigger>
              <Button
                onClick={handleRemoveMember}
                disabled={removingMember}
                icon={removingMember ? <Spinner size="tiny" /> : undefined}
                appearance="primary"
              >
                Remover
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
