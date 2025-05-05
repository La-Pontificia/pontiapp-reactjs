import { Team } from '@/types/user/team'
import TeamItem from './team'

export default function GridTeams({
  teams,
  refetch
}: {
  teams: Team[]
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
        {teams.map((team) => (
          <TeamItem refetch={refetch} team={team} key={team.id} />
        ))}
      </tbody>
    </table>
  )
}
