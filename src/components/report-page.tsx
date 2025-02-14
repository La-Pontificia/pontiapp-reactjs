import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@fluentui/react-components'
import {
  ArrowCircleDownRegular,
  FolderSearchRegular
} from '@fluentui/react-icons'
import React from 'react'
import { ExcelColored } from '~/icons'
import { format } from '~/lib/dayjs'
import { Report } from '~/types/report'

export default function ReportPage({ reports }: { reports?: Report[] }) {
  const grouped = reports?.reduce((acc, item) => {
    const date = new Date(item.created_at)
    const key = format(date, 'YYYY-MM-DD')
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, Report[]>)

  return (
    <div className="w-full flex flex-col overflow-auto">
      <nav className="w-full">
        <h2 className="text-sm pt-3 mb-2 px-2">Archivos</h2>
      </nav>
      <div className="flex-grow">
        {grouped &&
          Object.entries(grouped).map(([key, items]) => (
            <React.Fragment key={key}>
              <nav className="border-b border-stone-500/40 p-2 opacity-60">
                <h2>{format(new Date(key), 'DD MMM YYYY')}</h2>
              </nav>
              <Table>
                <TableBody>
                  {reports &&
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 py-3">
                            <ExcelColored size={25} className="min-w-[25px]" />
                            <div>
                              <a
                                href={item.downloadLink}
                                target="_blank"
                                className="text-sm line-clamp-1 font-semibold hover:underline"
                              >
                                {item.title}
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-1">
                            <span className="opacity-60">
                              {format(item.created_at, 'DD MMM YYYY h:mm A')}
                            </span>
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="line-clamp-1">
                            {item.user.displayName}{' '}
                          </p>
                        </TableCell>
                        <TableCell>
                          <a
                            href={item.downloadLink}
                            target="_blank"
                            className="flex items-center hover:underline dark:text-stone-400 text-stone-700 font-medium relative gap-1"
                          >
                            <ArrowCircleDownRegular
                              fontSize={25}
                              className="dark:text-blue-500 text-blue-700 "
                            />
                            Descargar
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </React.Fragment>
          ))}

        {reports && reports.length === 0 && (
          <div className="grid place-content-center flex-grow w-full h-full text-xs opacity-80">
            <FolderSearchRegular fontSize={50} className="mx-auto opacity-70" />
            <p className="pt-2">No hay nada que mostrar</p>
          </div>
        )}
      </div>
    </div>
  )
}
