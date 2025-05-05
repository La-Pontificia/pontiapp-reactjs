import {
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableRow
} from '@/components/table'
import { ArrowCircleDownRegular } from '@fluentui/react-icons'
import React from 'react'
import { ExcelColored } from '@/icons'
import { format, isIquals } from '@/lib/dayjs'
import { Report } from '@/types/report'
import { TableContainer } from './table-container'
import { Helmet } from 'react-helmet'
import { TableSelectionCell } from '@fluentui/react-components'
import { VITE_API_HOST } from '@/config/env'

export default function ReportPage({ reports }: { reports?: Report[] }) {
  const grouped = reports?.reduce((acc, item) => {
    const date = new Date(item.created_at)
    const key = format(date, 'YYYY-MM-DD')
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<string, Report[]>)



  return (
    <>
      <Helmet>
        <title>Archivos de reportes | Pontiapp</title>
      </Helmet>
      <TableContainer
        isEmpty={!reports?.length}
        nav={
          <nav className="w-full">
            <h2 className="text-lg font-semibold">Archivos de reportes</h2>
          </nav>
        }
      >
        {grouped &&
          Object.entries(grouped)
            .slice(0, 10)
            .map(([key, items]) => {
              const isToday = isIquals(key, new Date())
              return (
                <React.Fragment key={key}>
                  <nav className="border-b border-stone-500/40 p-2 opacity-60">
                    <h2>{isToday ? 'Hoy' : format(new Date(key), 'DD MMM YYYY')}</h2>
                  </nav>
                  <Table>
                    <TableBody>
                      {reports &&
                        items.map((item) => (
                          <TableRow key={item.id}>
                            <TableSelectionCell type="radio" />
                            <TableCell>
                              <TableCellLayout
                                media={
                                  <ExcelColored
                                    size={25}
                                    className="min-w-[25px]"
                                  />
                                }
                              >
                                <a
                                  href={item.downloadLink}
                                  target="_blank"
                                  className="hover:underline"
                                >
                                  {item.title}
                                </a>
                              </TableCellLayout>
                            </TableCell>
                            <TableCell className='max-w-[180px] max-sm:!hidden'>
                              <p className="">
                                <span className="opacity-60">
                                  {format(item.created_at, 'DD MMM YYYY h:mm A')}
                                </span>
                              </p>
                            </TableCell>
                            <TableCell className='max-w-[150px] max-lg:!hidden'>
                              <p className="">{item.user.displayName} </p>
                            </TableCell>
                            <TableCell className='max-w-[150px]'>
                              <a
                                href={VITE_API_HOST + '/api/tools/downloadReportFile/' + item.id}
                                target="_blank"
                                className="flex items-center hover:underline dark:text-stone-300 text-stone-800 font-medium relative gap-1"
                              >
                                <ArrowCircleDownRegular fontSize={25} />
                                Descargar
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </React.Fragment>
              )
            })}
      </TableContainer>
    </>
  )
}
