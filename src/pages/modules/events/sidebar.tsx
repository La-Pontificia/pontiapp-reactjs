import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  GuestAddFilled,
  GuestAddRegular,
  MegaphoneCircleFilled,
  MegaphoneCircleRegular,
  TaskListSquarePersonFilled,
  TaskListSquarePersonRegular
} from '@fluentui/react-icons'

export default function AssistsEvents() {
  return (
    <ReusableSidebar homePath="/m/events" title="Eventos">
      <nav className="pr-2 py-2 px-3">
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
          has={['events:records:view']}
          icon={TaskListSquarePersonRegular}
          iconActive={TaskListSquarePersonFilled}
          href="/m/events/records"
        >
          Registros
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['events:records:reportFiles']}
          icon={DocumentTableRegular}
          iconActive={DocumentTableFilled}
          href="/m/events/report-files"
        >
          Archivos de reportes
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
