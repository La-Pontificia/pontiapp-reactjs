import {
  BookSearchFilled,
  BookSearchRegular,
  BuildingFilled,
  BuildingRegular,
  CalendarFilled,
  CalendarPersonFilled,
  CalendarPersonRegular,
  CalendarRegular,
  ChartMultipleFilled,
  ChartMultipleRegular,
  DocumentTableFilled,
  DocumentTableRegular,
  FolderListFilled,
  FolderListRegular,
  HatGraduationFilled,
  HatGraduationRegular,
  PeopleEyeFilled,
  PeopleEyeRegular
} from '@fluentui/react-icons'
import {
  ItemSidebarNav,
  ReusableSidebar,
  SidebarTitle
} from '@/components/reusable-sidebar'
import { useAuth } from '@/store/auth'

export const AcademicSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar homePath="/m/academic">
      <ItemSidebarNav
        icon={ChartMultipleRegular}
        iconActive={ChartMultipleFilled}
        href="/m/academic"
      >
        Dashboard
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={PeopleEyeRegular}
        iconActive={PeopleEyeFilled}
        href="/m/academic/te"
        has={['academic:teacherEvaluation']}
      >
        Seguimiento docentes
      </ItemSidebarNav>

      <ItemSidebarNav
        has={['academic:reportFiles']}
        icon={DocumentTableRegular}
        iconActive={DocumentTableFilled}
        href="/m/academic/report-files"
      >
        Archivos de reportes
      </ItemSidebarNav>
      {authUser.hasPrivilege(
        ['academic:schedules', 'academic:teacherSchedules'],
        'or'
      ) && <SidebarTitle>Horarios</SidebarTitle>}

      <ItemSidebarNav
        has={['academic:schedules']}
        icon={CalendarRegular}
        iconActive={CalendarFilled}
        href="/m/academic/schedules"
      >
        Horarios de clase
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={CalendarPersonRegular}
        iconActive={CalendarPersonFilled}
        href="/m/academic/teacher-schedules"
        has={['academic:teacherSchedules']}
      >
        Disponibilidad de los docentes
      </ItemSidebarNav>
      {authUser.hasPrivilege(
        [
          'academic:programs',
          'academic:periods',
          'academic:sections',
          'academic:courses',
          'academic:pavilionsClassrooms',
          'academic:areas'
        ],
        'or'
      ) && <SidebarTitle>Datos y ajustes</SidebarTitle>}
      <ItemSidebarNav
        icon={HatGraduationRegular}
        iconActive={HatGraduationFilled}
        href="/m/academic/programs"
        has={['academic:programs']}
      >
        Programas
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={FolderListRegular}
        iconActive={FolderListFilled}
        href="/m/academic/periods"
        has={['academic:periods']}
      >
        Periodos
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={FolderListRegular}
        iconActive={FolderListFilled}
        href="/m/academic/sections"
        has={['academic:sections']}
      >
        Secciones
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={BookSearchRegular}
        iconActive={BookSearchFilled}
        href="/m/academic/courses"
        has={['academic:courses']}
      >
        Cursos
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={BuildingRegular}
        iconActive={BuildingFilled}
        href="/m/academic/classrooms"
        has={['academic:pavilionsClassrooms']}
      >
        Aulas y pabellones
      </ItemSidebarNav>
      <ItemSidebarNav
        icon={FolderListRegular}
        iconActive={FolderListFilled}
        href="/m/academic/areas"
        has={['academic:areas']}
      >
        Áreas
      </ItemSidebarNav>
    </ReusableSidebar>
  )
}

export default AcademicSidebar
