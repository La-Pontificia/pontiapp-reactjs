import { User } from '~/types/user'
import UserGrid from './user-grid'

export default function UsersGrid({
  users,
  refetch
}: {
  users: User[]
  refetch: () => void
}) {
  return (
    <table className="w-full relative">
      <thead className="">
        <tr className="font-semibold [&>td]:p-3 [&>td]:text-nowrap dark:text-neutral-400 text-neutral-500 text-left">
          <td className="max-sm:w-full">Usuario</td>
          <td className="max-sm:hidden">Cargo</td>
          <td className="max-xl:hidden">Email</td>
          <td className="max-xl:hidden">Jefe (Manager)</td>
          <td></td>
        </tr>
      </thead>
      <tbody className="divide-y overflow-y-auto divide-neutral-300 dark:divide-neutral-500/30">
        {users.map((user) => (
          <UserGrid refetch={refetch} user={user} key={user.id} />
        ))}
      </tbody>
    </table>
  )
}
