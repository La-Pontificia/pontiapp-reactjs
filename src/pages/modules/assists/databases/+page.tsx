import { Avatar, Badge, Spinner } from '@fluentui/react-components'
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
          <table className="w-full relative">
            <thead>
              <tr className="font-semibold [&>td]:px-3 [&>td]:pb-2 [&>td]:text-nowrap dark:text-neutral-400 text-left">
                <td>Nombre</td>
                <td>Estado</td>
                <td>Modelo de recuperación</td>
                <td>Nivel de compatibilidad</td>
                <td>Colación</td>
                <td>Creado en</td>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr className="relative bg-stone-50/40 dark:bg-stone-900 odd:bg-stone-500/10 dark:even:bg-stone-500/20 [&>td]:text-nowrap  group [&>td]:p-2.5 [&>td]:px-3 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl">
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar
                        badge={{
                          status: item.state === 'ONLINE' ? 'available' : 'away'
                        }}
                        icon={<CloudDatabaseRegular fontSize={27} />}
                        size={40}
                      />
                      <p className="text-nowrap">{item.name}</p>
                    </div>
                  </td>
                  <td>
                    <Badge
                      color={item.state === 'ONLINE' ? 'success' : 'warning'}
                      appearance="tint"
                    >
                      {item.state}
                    </Badge>
                  </td>
                  <td>
                    <p>{item.recoveryModel}</p>
                  </td>
                  <td>
                    <p>{item.compatibilityLevel}</p>
                  </td>
                  <td>
                    <p>{item.collation}</p>
                  </td>
                  <td>
                    <p>{format(item.created_at, 'DD/MM/YYYY HH:mm:ss')}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
