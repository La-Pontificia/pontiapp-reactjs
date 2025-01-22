import { Collaborator } from '~/types/collaborator'
import UserGrid from './user-grid'
import { cn } from '~/utils'

export default function UsersGrid({
  users,
  isLoadingMore,
  refetch
}: {
  users: Collaborator[]
  isLoadingMore: boolean
  refetch: () => void
}) {
  return (
    <table className="w-full relative">
      <thead className="">
        <tr className="font-semibold [&>td]:p-3 [&>td]:text-nowrap dark:text-neutral-400 text-neutral-500 text-left">
          <td>Colaborador</td>
          <td>Cargo</td>
          <td>Área</td>
          <td className="max-xl:hidden">Edas</td>
          <td className="max-xl:hidden">Jefe (Manager)</td>
        </tr>
      </thead>
      <tbody className="divide-y overflow-y-auto divide-stone-200 dark:divide-neutral-500/30">
        {users.map((user) => (
          <UserGrid refetch={refetch} user={user} key={user.id} />
        ))}
        {isLoadingMore && (
          <>
            <SkeletonUserItem />
            <SkeletonUserItem className="opacity-70" />
            <SkeletonUserItem className="opacity-40" />
          </>
        )}
      </tbody>
    </table>
  )
}

const SkeletonUserItem = ({ className }: { className?: string }) => (
  <tr
    className={cn(
      'relative  group border-b dark:border-neutral-700 [&>td]:p-3',
      className
    )}
  >
    <td>
      <div className="flex items-center gap-2">
        <div className="w-[40px] aspect-square rounded-full animate-pulse bg-neutral-500/50" />
        <div className="w-full h-[15px] rounded-full animate-pulse bg-neutral-500/50" />
      </div>
    </td>
    <td>
      <div className="w-[100px] h-[15px] rounded-full animate-pulse bg-neutral-500/50" />
    </td>
    <td>
      <div className="w-full h-[15px] rounded-full animate-pulse bg-neutral-500/50" />
    </td>
    <td>
      <div className="w-[110px] h-[15px] rounded-full animate-pulse bg-neutral-500/50" />
    </td>
  </tr>
)
