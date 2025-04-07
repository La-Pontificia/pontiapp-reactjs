import { Avatar, Badge } from '@fluentui/react-components'
import { CloudDatabaseRegular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell
} from '~/components/table'
import { TableContainer } from '~/components/table-container'
import { api } from '~/lib/api'
import { format } from '~/lib/dayjs'

export type AssistDatabase = {
  name: string
  state: 'ONLINE' | 'RESTORING'
  recoveryModel: string
  compatibilityLevel: number
  collation: string
  created_at: string
}

export default function AssistsDatabasesPage() {
  const { data: items, isLoading } = useQuery<AssistDatabase[]>({
    queryKey: ['assists-databases'],
    queryFn: async () => {
      const res = await api.get<AssistDatabase[]>('assists/databases')
      if (!res.ok) return []
      return res.data
    }
  })
  return (
    <TableContainer
      isLoading={isLoading}
      isEmpty={!items?.length}
      nav={
        <nav>
          <h1 className="font-semibold text-xl pr-2 py-1">
            Bases de datos de asistencias
          </h1>
        </nav>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableSelectionCell type="radio" />
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Estado</TableHeaderCell>
            <TableHeaderCell>Modelo de recuperación</TableHeaderCell>
            <TableHeaderCell>Nivel de compatibilidad</TableHeaderCell>
            <TableHeaderCell>Colación</TableHeaderCell>
            <TableHeaderCell>Creado en</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item, i) => (
            <TableRow key={i}>
              <TableSelectionCell type="radio" />
              <TableCell>
                <TableCellLayout
                  media={
                    <Avatar
                      badge={{
                        status: item.state === 'ONLINE' ? 'available' : 'away'
                      }}
                      icon={<CloudDatabaseRegular fontSize={27} />}
                      size={32}
                    />
                  }
                >
                  <p className="text-nowrap font-semibold">{item.name}</p>
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <Badge
                  color={item.state === 'ONLINE' ? 'success' : 'warning'}
                  appearance="tint"
                >
                  {item.state}
                </Badge>
              </TableCell>
              <TableCell>
                <p>{item.recoveryModel}</p>
              </TableCell>
              <TableCell>
                <p>{item.compatibilityLevel}</p>
              </TableCell>
              <TableCell>
                <p>{item.collation}</p>
              </TableCell>
              <TableCell>
                <p>{format(item.created_at, 'DD MMM YYYY')}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
