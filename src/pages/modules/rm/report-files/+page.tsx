import { api } from '@/lib/api'
import { Report } from '@/types/report'
import { Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import ReportPage from '@/components/report-page'

export default function ResourceManagementReportFilesPage() {
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['rm', 'report-files'],
    queryFn: async () => {
      const res = await api.get<Report[]>('partials/reports/all?module=rm')
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

  return <ReportPage reports={reports} />
}
