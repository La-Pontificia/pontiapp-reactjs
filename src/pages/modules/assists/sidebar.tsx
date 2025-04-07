import {
  ItemSidebarNav,
  ReusableSidebar,
  SidebarTitle
} from '~/components/reusable-sidebar'
import {
  ClockFilled,
  ClockRegular,
  CloudDatabaseFilled,
  CloudDatabaseRegular,
  DocumentPersonFilled,
  DocumentPersonRegular,
  DocumentTableFilled,
  DocumentTableRegular,
  FolderFilled,
  FolderRegular,
  PersonDeleteFilled,
  PersonDeleteRegular,
  TextBulletListSquareClockFilled,
  TextBulletListSquareClockRegular,
  WindowDevToolsFilled,
  WindowDevToolsRegular
} from '@fluentui/react-icons'
import { useAuth } from '~/store/auth'

export const AssistsSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar homePath="/m/assists" title="Asistencias">
      <ItemSidebarNav
        has={['assists:my']}
        href="/m/assists/my"
        avatar={authUser.photoURL}
      >
        Mis asistencias
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['assists:schedules']}
        feacture={{
          label: 'Nuevo',
          from: new Date('2025-01-06')
        }}
        icon={ClockRegular}
        iconActive={ClockFilled}
        href="/m/assists"
      >
        Asistencias
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['assists:withUsers']}
        icon={DocumentPersonRegular}
        iconActive={DocumentPersonFilled}
        href="/m/assists/with-users"
      >
        Con usuarios
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['assists:withoutUsers']}
        icon={PersonDeleteRegular}
        iconActive={PersonDeleteFilled}
        href="/m/assists/without-users"
      >
        Sin usuarios
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['assists:summary']}
        icon={TextBulletListSquareClockRegular}
        iconActive={TextBulletListSquareClockFilled}
        href="/m/assists/summary"
      >
        Resumen único
      </ItemSidebarNav>

      <ItemSidebarNav
        has={['assists:reportFiles']}
        icon={DocumentTableRegular}
        iconActive={DocumentTableFilled}
        href="/m/assists/report-files"
      >
        Archivos de reportes
      </ItemSidebarNav>
      <SidebarTitle>Ajustes</SidebarTitle>
      <ItemSidebarNav
        has={['assists:assistTerminals']}
        icon={FolderRegular}
        iconActive={FolderFilled}
        href="/m/assists/terminals"
      >
        Biometricos
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['assists:databases']}
        icon={CloudDatabaseRegular}
        iconActive={CloudDatabaseFilled}
        href="/m/assists/databases"
      >
        Bases de datos
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['assists:tools']}
        icon={WindowDevToolsRegular}
        iconActive={WindowDevToolsFilled}
        href="/m/assists/tools"
      >
        Tools
      </ItemSidebarNav>
    </ReusableSidebar>
  )
}

export default AssistsSidebar
