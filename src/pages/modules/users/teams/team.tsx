import { UserTeam } from '~/types/user-team'
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger
} from '@fluentui/react-components'
import { MoreHorizontal20Filled } from '@fluentui/react-icons'

import React from 'react'
import { Link, useNavigate } from 'react-router'

export default function TeamItem({
  team: teamProp,
  refetch
}: {
  team: UserTeam
  refetch: () => void
}) {
  const [team, setTeam] = React.useState(teamProp)

  return (
    <tr className="relative bg-neutral-50/40 dark:bg-neutral-900 odd:bg-neutral-500/10 dark:even:bg-neutral-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
      <td className=" pl-4">
        <label></label>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Avatar
            size={40}
            color="colorful"
            name={team.name}
            aria-label={team.name}
            image={{
              src: team.photoURL
            }}
          />
          <Link
            className="hover:underline hover:dark:text-blue-500 relative"
            to={`/m/users/teams/${team.id}`}
          >
            {team.name}
          </Link>
        </div>
      </td>
      <td>
        <p className="line-clamp-2 opacity-60">{team.description}</p>
      </td>
      <td>
        <Link
          to={`/m/users/teams/${team.id}`}
          className="text-center relative block dark:text-blue-500 hover:underline"
        >
          {team.membersCount} {team.membersCount === 1 ? 'miembro' : 'miembros'}
        </Link>
      </td>
      <td>
        <Link
          to={`/m/users/teams/${team.id}`}
          className="text-center relative block dark:text-blue-500 hover:underline"
        >
          {team.ownersCount}{' '}
          {team.ownersCount === 1 ? 'propietario' : 'propietarios'}
        </Link>
      </td>
      <td className="max-xl:hidden"></td>
      <td className="">
        <TeamGridOptions refetch={refetch} setTeam={setTeam} team={team} />
      </td>
    </tr>
  )
}

export const TeamGridOptions = ({
  team
}: //   refetch
{
  team: UserTeam
  setTeam: React.Dispatch<React.SetStateAction<UserTeam>>
  refetch: () => void
}) => {
  const navigate = useNavigate()

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
            <MenuItem onClick={() => navigate(`/m/users/teams/${team.id}`)}>
              Ver equipo
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </>
  )
}
