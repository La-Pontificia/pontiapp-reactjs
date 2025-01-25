import { api } from '~/lib/api'
import { format, timeAgo } from '~/lib/dayjs'
import { Report } from '~/types/report'
import { Spinner } from '@fluentui/react-components'
import { OpenRegular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { ExcelColored } from '~/icons'

export default function AssistsReportFilesPage() {
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['sssists', 'report-files'],
    queryFn: async () => {
      const res = await api.get<Report[]>('partials/reports/all?module=assists')
      if (!res.ok) return []
      return res.data.map((d) => new Report(d))
    }
  })

  if (isLoading)
    return (
      <div className="h-full grid w-full place-content-center">
        <Spinner size="huge" />
      </div>
    )

  // "created_at": "2024-11-18T08:51:18.000000Z",

  const grouped = reports?.reduce((acc, item) => {
    const date = new Date(item.created_at)
    const key = format(date, 'YYYY-MM-DD')
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, Report[]>)

  return (
    <div className="w-full overflow-auto">
      <nav className="w-full space-y-2 py-3 border-b mb-2 border-stone-500/30">
        <div className="flex flex-col lg:flex-row gap-4">
          <h2 className="font-semibold text-xl pr-2">Reporte de asistencias</h2>
        </div>
      </nav>
      <table className="w-full">
        {grouped &&
          Object.entries(grouped).map(([key, items]) => (
            <>
              <tbody>
                <tr className="">
                  <td colSpan={222} className="pb-2 opacity-60">
                    <h2>
                      {format(new Date(key), 'dddd, D [de] MMMM [del] YYYY')}
                    </h2>
                  </td>
                </tr>
              </tbody>
              <tbody key={key} className="divide-y divide-neutral-500/20">
                {reports &&
                  items.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white dark:bg-[#2a2826] [&>td]:px-4 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
                    >
                      <td>
                        <div className="flex items-center gap-2 py-3">
                          <ExcelColored size={25} />
                          <div>
                            <p className="text-sm line-clamp-1 font-semibold">
                              {item.title}
                            </p>
                            {/* <p className="text-xs dark:text-blue-500 line-clamp-1 opacity-90">
                          {item.downloadLink}
                        </p> */}
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="line-clamp-1">
                          {item.user.displayName}{' '}
                          <span className="opacity-60">
                            {timeAgo(item.created_at)}
                          </span>
                        </p>
                      </td>
                      <td>
                        <a
                          href={item.downloadLink}
                          target="_blank"
                          className="flex items-center relative gap-2 dark:text-blue-500 text-blue-700 hover:underline"
                        >
                          <OpenRegular fontSize={20} />
                          Descargar
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tbody>
                <tr className="">
                  <td
                    colSpan={222}
                    className="pb-3 font-medium opacity-50"
                  ></td>
                </tr>
              </tbody>
            </>
          ))}
      </table>
    </div>
  )
}
