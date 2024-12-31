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

export default function AttentionsReportFilesPage() {
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['sssists', 'report-files'],
    queryFn: async () => {
      const res = await api.get<Report[]>('partials/reports/all')
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
  if (!reports && !isLoading)
    return (
      <div className="h-full w-full grid place-content-center">
        No hay archivos de reportes
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
    <div className="w-full">
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
                          className="bg-stone-100 dark:bg-stone-900 [&>td]:px-4 first:[&>td]:first:rounded-tl-xl last:[&>td]:first:rounded-tr-xl first:[&>td]:last:rounded-bl-xl last:[&>td]:last:rounded-br-xl"
                        >
                          <td>
                            <div className="flex items-center gap-2 py-3">
                              <svg
                                width={'32'}
                                height={'32'}
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9.5 29h19c.275 0 .5-.225.5-.5V9h-4.5c-.827 0-1.5-.673-1.5-1.5V3H9.5c-.275 0-.5.225-.5.5v25c0 .275.225.5.5.5z"
                                  fill="#fff"
                                />
                                <path
                                  d="M28.293 8 24 3.707V7.5c0 .275.225.5.5.5h3.793z"
                                  fill="#fff"
                                />
                                <path
                                  opacity=".67"
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="m29.56 7.854-5.414-5.415A1.51 1.51 0 0 0 23.086 2H9.5C8.673 2 8 2.673 8 3.5v25c0 .827.673 1.5 1.5 1.5h19c.827 0 1.5-.673 1.5-1.5V8.914c0-.4-.156-.777-.44-1.06zM24 3.707 28.293 8H24.5a.501.501 0 0 1-.5-.5V3.707zM9.5 29h19c.275 0 .5-.225.5-.5V9h-4.5c-.827 0-1.5-.673-1.5-1.5V3H9.5c-.275 0-.5.225-.5.5v25c0 .276.224.5.5.5z"
                                  fill="#605E5C"
                                />
                                <path
                                  d="M25 23h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2z"
                                  fill="#134A2C"
                                />
                                <path
                                  d="M20 23h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2z"
                                  fill="#185C37"
                                />
                                <path
                                  d="M25 19h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2z"
                                  fill="#21A366"
                                />
                                <path
                                  d="M20 19h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2z"
                                  fill="#107C41"
                                />
                                <path
                                  d="M25 15h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2z"
                                  fill="#33C481"
                                />
                                <path
                                  d="M20 15h-2a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2z"
                                  fill="#21A366"
                                />
                                <path
                                  d="M3.5 25h11a1.5 1.5 0 0 0 1.5-1.5v-11a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 2 12.5v11A1.5 1.5 0 0 0 3.5 25z"
                                  fill="#107C41"
                                />
                                <path
                                  d="m6 22 2.174-4.01L6.182 14h1.602l1.087 2.549c.1.242.169.423.206.542h.015c.071-.194.146-.382.224-.564L10.478 14h1.47l-2.042 3.967L12 22h-1.565L9.18 19.2c-.06-.12-.11-.246-.15-.375h-.018a1.93 1.93 0 0 1-.145.363L7.574 22H6z"
                                  fill="#F9F7F7"
                                />
                              </svg>
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
                              className="flex items-center relative gap-2 dark:text-blue-500 hover:underline"
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
