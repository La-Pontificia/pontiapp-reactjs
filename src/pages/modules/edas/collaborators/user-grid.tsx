// import { toast } from 'anni'
// import { api } from '~/lib/api'
// import { useAuth } from '~/store/auth'
// import { handleAuthError } from '~/utils'
import { Avatar } from '@fluentui/react-components'
import React from 'react'
import { Link } from 'react-router'
import UserHoverInfo from '~/components/user-hover-info'
import { Collaborator } from '~/types/collaborator'

export default function UserGrid({
  user: userProp
}: // refetch
{
  user: Collaborator
  refetch: () => void
}) {
  // const [managerUpdating, setManagerUpdating] = React.useState(false)
  const [user] = React.useState(new Collaborator(userProp))
  // const { user: authUser } = useAuth()

  // const handleManager = async (manager?: Collaborator) => {
  //   setManagerUpdating(true)
  //   const res = await api.post(`users/${user.id}/manager`, {
  //     data: {
  //       managerId: manager?.id
  //     }
  //   })
  //   if (!res.ok) {
  //     setManagerUpdating(false)
  //     return toast(handleAuthError(res.error))
  //   }
  //   setManagerUpdating(false)
  //   setUser(
  //     (u) =>
  //       new Collaborator({
  //         ...u,
  //         manager: manager ? new Collaborator(manager) : undefined
  //       } as Collaborator)
  //   )
  //   refetch()
  //   toast('Jefe actualizado correctamente.')
  // }
  return (
    <tr className="relative [&>td]:text-nowrap group [&>td]:p-3 [&>td]:px-3">
      <td>
        <UserHoverInfo slug={user.username}>
          <div className="flex items-center gap-2">
            <Avatar
              size={40}
              color="colorful"
              name={user.displayName}
              aria-label={user.displayName}
              image={{
                src: user.photoURL
              }}
            />
            <Link
              className="hover:underline font-semibold relative"
              to={`/m/edas/${user.username}`}
            >
              {user.displayName}
            </Link>
          </div>
        </UserHoverInfo>
      </td>
      <td>
        <div className="max-w-[30ch] opacity-70 text-ellipsis overflow-hidden">
          {user.role.name}
        </div>
      </td>
      <td className="max-xl:hidden">
        <div className="max-w-[30ch] opacity-90 text-ellipsis overflow-hidden">
          {user.role.department.area.name}
        </div>
      </td>
      <td>
        <p className="font-medium opacity-70">
          {user.edasCount} {user.edasCount === 1 ? 'Eda' : 'Edas'}
        </p>
      </td>
      <td className="max-xl:hidden">
        {user.manager?.displayName ? (
          <p className="dark:text-blue-500 text-blue-600 font-medium">
            {user.manager?.displayName}
          </p>
        ) : (
          <p>Sin jefe</p>
        )}
      </td>
    </tr>
  )
}
