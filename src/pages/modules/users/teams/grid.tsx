import { UserTeam } from '@/types/user-team'
import TeamItem from './team'
import { cn } from '@/utils'

export default function GridTeams({
  teams,
  isLoading,
  refetch
}: {
  teams: UserTeam[]
  isLoading: boolean
  refetch: () => void
}) {
  return (
    <table className="w-full relative">
      <thead>
        <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
          <td></td>
          <td>Equipo</td>
          <td className="w-full">Descripción</td>
          <td className="max-xl:hidden">Miembros</td>
          <td className="max-2xl:hidden">propietarios</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {!isLoading &&
          teams.map((team) => (
            <TeamItem refetch={refetch} team={team} key={team.id} />
          ))}
        {isLoading && (
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
