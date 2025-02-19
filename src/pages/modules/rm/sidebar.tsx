import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  FolderLinkFilled,
  FolderLinkRegular,
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
        <div className="font-semibold pl-4 pt-5 pb-2 dark:text-blue-400 text-blue-700 text-xs">
          Meta datos académicos
        </div>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/academic-programs"
          has={['rm:academicPrograms']}
        >
          Programas académicos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/periods"
          has={['rm:periods']}
        >
          Periodos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/sections"
          has={['rm:sections']}
        >
          Secciones
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/cycles"
          has={['rm:cycles']}
        >
          Ciclos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/course"
          has={['rm:course']}
        >
          Cursos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/classrooms"
          has={['rm:classrooms']}
        >
          Aulas
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/academic-areas"
          has={['rm:academicAreas']}
        >
          Áreas académicas
        </ItemSidebarNav>
        <div className="font-semibold pl-4 pt-5 pb-2 dark:text-blue-400 text-blue-700 text-xs">
          Meta datos pontiapp
        </div>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/business-units"
          has={['rm:businessUnits']}
        >
          Unidad de negocios
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/locations"
          has={['rm:locations']}
        >
          Sedes
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/areas"
          has={['rm:areas']}
        >
          Áreas
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/departments"
          has={['rm:departments']}
        >
          Departamentos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/positions"
          has={['rm:positions']}
        >
          Puestos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={FolderLinkRegular}
          iconActive={FolderLinkFilled}
          href="/m/rm/roles"
          has={['rm:roles']}
        >
          Cargos
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
