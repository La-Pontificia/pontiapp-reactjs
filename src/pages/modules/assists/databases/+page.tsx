import {
  Avatar,
  Badge,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from '@fluentui/react-components'
import { CloudDatabaseRegular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
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
    <div className="flex flex-col px-3 w-full py-3 overflow-y-auto h-full">
      <div className="overflow-auto rounded-xl pt-2 h-full">
        {isLoading ? (
          <div className="h-full grid place-content-center">
            <Spinner size="huge" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar
                        badge={{
                          status: item.state === 'ONLINE' ? 'available' : 'away'
                        }}
                        icon={<CloudDatabaseRegular fontSize={27} />}
                        size={32}
                      />
                      <p className="text-nowrap font-semibold">{item.name}</p>
                    </div>
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
                    <p>{format(item.created_at, 'DD/MM/YYYY HH:mm:ss')}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
