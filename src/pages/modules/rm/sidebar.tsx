import {
  ItemSidebarNav,
  ReusableSidebar,
  SidebarTitle
} from '@/components/reusable-sidebar'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  FolderOpenFilled,
  FolderOpenRegular,
  TabDesktopNewPageFilled,
  TabDesktopNewPageRegular
} from '@fluentui/react-icons'
import { useAuth } from '@/store/auth'

export default function ResourceManagementSidebar() {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar homePath="/m/events" title="Gestión de recursos">
      <ItemSidebarNav
        has={['rm:reportFiles']}
        icon={DocumentTableRegular}
        iconActive={DocumentTableFilled}
        href="/m/rm/report-files"
      >
        Archivos de reportes
      </ItemSidebarNav>
      {authUser.hasPrivilege(['rm:club'], 'or') && (
        <>
          <SidebarTitle>Apps de LP</SidebarTitle>
          <ItemSidebarNav
            icon={TabDesktopNewPageRegular}
            iconActive={TabDesktopNewPageFilled}
            href="https://club.lapontificia.edu.pe"
            has={['rm:club']}
          >
            App Descuentos
          </ItemSidebarNav>
        </>
      )}
      {authUser.hasPrivilege(['rm:businessUnits', 'rm:locations'], 'or') && (
        <>
          <SidebarTitle>Meta datos pontiapp</SidebarTitle>
          <ItemSidebarNav
            icon={FolderOpenRegular}
            iconActive={FolderOpenFilled}
            href="/m/rm/business-units"
            has={['rm:businessUnits']}
          >
            Unidad de negocios
          </ItemSidebarNav>
          <ItemSidebarNav
            icon={FolderOpenRegular}
            iconActive={FolderOpenFilled}
            href="/m/rm/locations"
            has={['rm:locations']}
          >
            Sedes
          </ItemSidebarNav>
        </>
      )}
    </ReusableSidebar>
  )
}
