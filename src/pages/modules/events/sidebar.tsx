import { ItemSidebarNav, ReusableSidebar } from '@/components/reusable-sidebar'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  GuestAddFilled,
  GuestAddRegular,
  MegaphoneCircleFilled,
  MegaphoneCircleRegular
} from '@fluentui/react-icons'

export default function AssistsEvents() {
  return (
    <ReusableSidebar homePath="/m/events" title="Eventos">
      <ItemSidebarNav
        icon={MegaphoneCircleRegular}
        iconActive={MegaphoneCircleFilled}
        href="/m/events"
        has={['events:show']}
      >
        Eventos
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={GuestAddRegular}
        has={['events:records:register']}
        iconActive={GuestAddFilled}
        href="/m/events/register"
      >
        Registrar asistencia
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['events:records:reportFiles']}
        icon={DocumentTableRegular}
        iconActive={DocumentTableFilled}
        href="/m/events/report-files"
      >
        Archivos de reportes
      </ItemSidebarNav>
    </ReusableSidebar>
  )
}
