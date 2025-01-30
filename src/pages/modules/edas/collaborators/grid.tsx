import { Collaborator } from '~/types/collaborator'
import UserGrid from './user-grid'

export default function UsersGrid({
  users,

  refetch
}: {
  users: Collaborator[]
  isLoadingMore: boolean
  refetch: () => void
}) {
  return (
    <table className="w-full relative">
      <thead className="">
        <tr className="[&>td]:text-xs border-b dark:border-stone-700/30 [&>td]:pt-1 [&>td]:p-3 opacity-60">
          <td></td>
          <td>Cargo</td>
          <td>Área</td>
          <td className="max-xl:hidden">Edas</td>
          <td className="max-xl:hidden">Administrador</td>
          <td className="">Invitaciónes</td>
        </tr>
      </thead>
      <tbody className="divide-y overflow-y-auto divide-stone-200 dark:divide-neutral-500/30">
        {users.map((user) => (
          <UserGrid refetch={refetch} user={user} key={user.id} />
        ))}
      </tbody>
    </table>
  )
}
