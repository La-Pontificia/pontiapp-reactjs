import { useParams } from 'react-router'
import QuickSchedules from './_components/quick-schedules'
import QuickContactInformation from './_components/quick-contact-information'
import QuickOrganization from './_components/quick-organization'
import QuickInfo from './_components/quick-info'

export default function UsersSlugPage() {
  const params = useParams<{
    slug: string
  }>()
  const slug = params.slug

  return (
    <div className="max-w-7xl py-3 space-y-4 lg:px-5 px-4 mx-auto w-full">
      <QuickSchedules slug={slug} />
      <QuickContactInformation />
      <QuickOrganization slug={slug} />
      <QuickInfo />
    </div>
  )
}
