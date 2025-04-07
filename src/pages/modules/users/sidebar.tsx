import {
  ItemSidebarNav,
  ReusableSidebar,
  SidebarTitle
} from '~/components/reusable-sidebar'
import {
  FolderOpenFilled,
  FolderOpenRegular,
  PersonFilled,
  PersonProhibitedFilled,
  PersonProhibitedRegular,
  PersonRegular
} from '@fluentui/react-icons'

export const UsersSidebar = () => {
  return (
    <ReusableSidebar homePath="/m/users" title="Usuarios">
      <ItemSidebarNav
        has={['users:show']}
        icon={PersonRegular}
        iconActive={PersonFilled}
        href="/m/users/all"
      >
        Activos
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['users:show']}
        icon={PersonProhibitedRegular}
        iconActive={PersonProhibitedFilled}
        href="/m/users/disabled"
      >
        Inactivos
      </ItemSidebarNav>
      {/* <ItemSidebarNav
          has={['users:collaborators:show']}
          icon={PersonLightbulbRegular}
          iconActive={PersonLightbulbFilled}
          href="/m/users/collaborators"
        >
          Colaboradores
        </ItemSidebarNav> */}
      {/* <ItemSidebarNav
          has={['users:teams']}
          icon={PeopleRegular}
          iconActive={PeopleFilled}
          href="/m/users/teams"
        >
          Grupos
        </ItemSidebarNav> */}
      <SidebarTitle>Ajustes</SidebarTitle>
      <ItemSidebarNav
        has={['users:areas']}
        icon={FolderOpenRegular}
        iconActive={FolderOpenFilled}
        href="/m/users/areas"
      >
        Areas de trabajo
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['users:departments']}
        icon={FolderOpenRegular}
        iconActive={FolderOpenFilled}
        href="/m/users/departments"
      >
        Departamentos
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['users:jobs']}
        icon={FolderOpenRegular}
        iconActive={FolderOpenFilled}
        href="/m/users/jobs"
      >
        Puestos
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['users:roles']}
        icon={FolderOpenRegular}
        iconActive={FolderOpenFilled}
        href="/m/users/roles"
      >
        Cargos
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['users:userRoles']}
        icon={FolderOpenRegular}
        iconActive={FolderOpenFilled}
        href="/m/users/user-roles"
      >
        Privilegios y roles
      </ItemSidebarNav>
      <ItemSidebarNav
        has={['users:contractTypes']}
        icon={FolderOpenRegular}
        iconActive={FolderOpenFilled}
        href="/m/users/contract-types"
      >
        Tipos de contrato
      </ItemSidebarNav>
    </ReusableSidebar>
  )
}

export default UsersSidebar
