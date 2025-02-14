import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  PeopleEyeFilled,
  PeopleEyeRegular,
  TabDesktopNewPageFilled,
  TabDesktopNewPageRegular
} from '@fluentui/react-icons'

export default function ResourceManagementSidebar() {
  return (
    <ReusableSidebar homePath="/m/events" title="Gestión de recursos">
      <nav className="pr-2 py-2 px-3">
        <ItemSidebarNav
          icon={PeopleEyeRegular}
          iconActive={PeopleEyeFilled}
          href="/m/rm/tt"
          has={['rm:tt']}
        >
          Seguimiento docentes
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['rm:reportFiles']}
          icon={DocumentTableRegular}
          iconActive={DocumentTableFilled}
          href="/m/rm/report-files"
        >
          Archivos de reportes
        </ItemSidebarNav>
        <div className="font-semibold pl-4 pt-5 pb-2 dark:text-blue-400 text-blue-700 text-xs">
          Apps de LP
        </div>
        <ItemSidebarNav
          icon={TabDesktopNewPageRegular}
          iconActive={TabDesktopNewPageFilled}
          href="https://club.lapontificia.edu.pe"
          has={['rm:club']}
        >
          App Descuentos
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
