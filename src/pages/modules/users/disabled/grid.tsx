import { User } from '~/types/user'
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
  users: User[]
  refetch: () => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableSelectionCell type="radio" invisible />
          <TableHeaderCell>Usuario</TableHeaderCell>
          <TableHeaderCell className="!max-sm:hidden">Cargo</TableHeaderCell>
          <TableHeaderCell className="!max-xl:hidden">Email</TableHeaderCell>
          <TableHeaderCell className="!max-xl:hidden">
            Jefe (Manager)
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
