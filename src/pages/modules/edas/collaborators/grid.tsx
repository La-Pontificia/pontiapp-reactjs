import { Collaborator } from '@/types/collaborator'
import UserGrid from './user-grid'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '@fluentui/react-components'

export default function UsersGrid({
  users,
  refetch
}: {
  users: Collaborator[]
  refetch: () => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableSelectionCell type="radio" invisible />
          <TableHeaderCell>Colaborador</TableHeaderCell>
          <TableHeaderCell>Cargo</TableHeaderCell>
          <TableHeaderCell>Área</TableHeaderCell>
          <TableHeaderCell className="max-xl:!hidden">Edas</TableHeaderCell>
          <TableHeaderCell className="max-xl:!hidden">
            Administrador
          </TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserGrid refetch={refetch} user={user} key={user.id} />
        ))}
      </TableBody>
    </Table>
  )
}
