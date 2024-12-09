import { User } from '@/types/user'
import UserGrid from './user-grid'
import { cn } from '@/utils'

export default function UsersGrid({
  users,
  isLoading,
  isLoadingMore,
  refetch
}: {
  users: User[]
  isLoading: boolean
  isLoadingMore: boolean
  refetch: () => void
}) {
  return (
    <table className="w-full relative">
      <thead className="">
        <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
          <td></td>
          <td className="w-full">Usuario</td>
          <td>Cargo</td>
          <td className="max-xl:hidden">Email</td>
          <td className="max-2xl:hidden">Tipo</td>
          <td className="max-xl:hidden">Jefe (Manager)</td>
          <td></td>
        </tr>
      </thead>
      <tbody className="divide-y overflow-y-auto divide-neutral-500/30">
        {!isLoading &&
          users.map((user) => (
            <UserGrid refetch={refetch} user={user} key={user.id} />
          ))}
        {(isLoadingMore || isLoading) && (
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
      'relative transition-colors group border-b dark:border-neutral-700 [&>td]:p-3',
      className
    )}
  >
    <td></td>
    <td>
      <div className="flex items-center gap-2">
        <div className="w-[40px] aspect-square rounded-full animate-pulse bg-stone-500/50" />
        <div className="w-full h-[15px] rounded-full animate-pulse bg-stone-500/50" />
      </div>
    </td>
    <td>
      <div className="w-[100px] h-[15px] rounded-full animate-pulse bg-stone-500/50" />
    </td>
    <td>
      <div className="w-full h-[15px] rounded-full animate-pulse bg-stone-500/50" />
    </td>
    <td></td>
    <td>
      <div className="w-[110px] h-[15px] rounded-full animate-pulse bg-stone-500/50" />
    </td>
  </tr>
)
