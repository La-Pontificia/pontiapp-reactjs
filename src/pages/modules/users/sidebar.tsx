import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentFilled,
  DocumentRegular,
  // PeopleFilled,
  // PeopleRegular,
  PersonFilled,
  // PersonLightbulbFilled,
  // PersonLightbulbRegular,
  PersonProhibitedFilled,
  PersonProhibitedRegular,
  PersonRegular
} from '@fluentui/react-icons'

export const UsersSidebar = () => {
  return (
    <ReusableSidebar homePath="/m/users" title="Usuarios">
      <nav className="pr-2 py-2 px-3">
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
        <div className="font-semibold pl-4 pt-5 pb-2 dark:text-blue-400 text-blue-700 text-xs">
          Ajustes
        </div>
        <ItemSidebarNav
          has={['users:areas']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/areas"
        >
          Areas de trabajo
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:departments']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/departments"
        >
          Departamentos
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:jobs']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/jobs"
        >
          Puestos
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:roles']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/roles"
        >
          Cargos
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:userRoles']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/user-roles"
        >
          Privilegios y roles
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:contractTypes']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/contract-types"
        >
          Tipos de contrato
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}

export default UsersSidebar
