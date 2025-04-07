import { api } from '~/lib/api'
import { Report } from '~/types/report'
import { Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import ReportPage from '~/components/report-page'

export default function AcademicReportFilesPage() {
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['academic', 'report-files'],
    queryFn: async () => {
      const res = await api.get<Report[]>(
        'partials/reports/all?module=academic'
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

  return <ReportPage reports={reports} />
}
