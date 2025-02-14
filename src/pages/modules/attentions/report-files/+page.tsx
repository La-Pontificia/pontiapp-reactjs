import { api } from '~/lib/api'
import { Report } from '~/types/report'
import { Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import ReportPage from '~/components/report-page'

export default function AttentionsReportFilesPage() {
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['sssists', 'report-files', 'attentions'],
    queryFn: async () => {
      const res = await api.get<Report[]>(
        'partials/reports/all?module=attentions'
      )
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

  return <ReportPage reports={reports} />
}
