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
      <thead className="border-b dark:border-stone-700">
        <tr className="">
          <td className="w-full"></td>
          <td className="max-sm:hidden"></td>
          <td className="max-xl:hidden"></td>
          <td></td>
        </tr>
      </thead>
      <tbody className="divide-y overflow-y-auto divide-neutral-300 dark:divide-neutral-500/20">
        {users.map((user) => (
          <UserGrid refetch={refetch} user={user} key={user.id} />
        ))}
      </tbody>
    </table>
  )
}
