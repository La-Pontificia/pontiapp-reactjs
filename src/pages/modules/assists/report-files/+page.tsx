import { api } from '~/lib/api'
import { format, timeAgo } from '~/lib/dayjs'
import { Report } from '~/types/report'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Spinner
} from '@fluentui/react-components'
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

  const firstKey = grouped ? Object.keys(grouped)[0] : null

  return (
    <div className="w-full overflow-auto">
      <p className="p-3 text-xs dark:text-blue-500 text-blue-700">
        Archivos de reportes de asistencias.
      </p>
      <div className="pb-4">
        <Accordion multiple defaultOpenItems={[firstKey]}>
          {grouped &&
            Object.entries(grouped).map(([key, items]) => (
              <AccordionItem value={key} key={key}>
                <AccordionHeader expandIconPosition="end" className="pr-4">
                  <h1 className="font-semibold capitalize text-base">
                    {format(new Date(key), 'dddd, MMMM D, YYYY')}
                  </h1>
                </AccordionHeader>
                <AccordionPanel className="lg:pl-14 pb-10">
                  <table className="w-full">
                    <thead>
                      <tr className="dark:text-neutral-400 font-semibold [&>td]:py-2 [&>td]:px-2">
                        <td className="min-w-[300px] lg:min-w-[400px] w-[500px]">
                          Archivo
                        </td>
                        <td className="text-nowrap w-full">Generado por</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-500/20">
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="bg-neutral-100 dark:bg-[#292827] [&>td]:px-4 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
                        >
                          <td>
                            <div className="flex items-center gap-2 py-3">
                              <ExcelColored size={30} />
                              <div>
                                <p className="text-sm line-clamp-1 opacity-90">
                                  {item.title}
                                </p>
                                <p className="text-xs dark:text-blue-500 line-clamp-1 opacity-90">
                                  {item.downloadLink}
                                </p>
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
                  </table>
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  )
}
