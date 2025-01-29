import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  FolderFilled,
  FolderRegular,
  PeopleEyeFilled,
  PeopleEyeRegular
} from '@fluentui/react-icons'

export default function ResourceManagementSidebar() {
  return (
    <ReusableSidebar homePath="/m/events" title="Gestión de recursos">
      <nav className="pr-2 py-2 px-3">
        <ItemSidebarNav
          icon={PeopleEyeRegular}
          iconActive={PeopleEyeFilled}
          href="/m/resource-management/teacher-trackings"
          has={['events:show']}
        >
          Seguimiento docentes
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['resourceManagement:reportFiles']}
          icon={DocumentTableRegular}
          iconActive={DocumentTableFilled}
          href="/m/resource-management/report-files"
        >
          Archivos de reportes
        </ItemSidebarNav>
        <div className="font-semibold pl-4 pt-5 pb-2 dark:text-blue-400 text-blue-700 text-xs">
          Ajustes
        </div>
        <ItemSidebarNav
          icon={FolderRegular}
          iconActive={FolderFilled}
          has={['users:areas']}
          href="/m/resource-management/semesters"
        >
          Semestres
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderRegular}
          iconActive={FolderFilled}
          has={['users:areas']}
          href="/m/resource-management/cycles"
        >
          Ciclos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderRegular}
          iconActive={FolderFilled}
          has={['users:areas']}
          href="/m/resource-management/sections"
        >
          Secciones
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderRegular}
          iconActive={FolderFilled}
          has={['users:areas']}
          href="/m/resource-management/classes"
        >
          Aulas
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderRegular}
          iconActive={FolderFilled}
          has={['users:areas']}
          href="/m/resource-management/headquarters"
        >
          Sedes
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderRegular}
          iconActive={FolderFilled}
          has={['users:areas']}
          href="/m/resource-management/areas"
        >
          Areas
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
