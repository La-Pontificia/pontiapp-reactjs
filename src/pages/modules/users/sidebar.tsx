import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentFilled,
  DocumentRegular,
  PeopleFilled,
  PeopleRegular,
  PersonDeleteFilled,
  PersonDeleteRegular,
  PersonFilled,
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
          Todos
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:show']}
          icon={PersonDeleteRegular}
          iconActive={PersonDeleteFilled}
          href="/m/users/disabled"
        >
          Inactivos
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:teams']}
          icon={PeopleRegular}
          iconActive={PeopleFilled}
          href="/m/users/teams"
        >
          Grupos
        </ItemSidebarNav>
        <div className="font-semibold px-5 pt-5 pb-2">Ajustes</div>
        <ItemSidebarNav
          has={['users:areas']}
          icon={DocumentRegular}
          emptyIcon
          iconActive={DocumentFilled}
          href="/m/users/areas"
        >
          Areas de trabajo
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['users:departments']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          emptyIcon
          href="/m/users/departments"
        >
          Departamentos
        </ItemSidebarNav>
        <ItemSidebarNav
          emptyIcon
          has={['users:jobs']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/jobs"
        >
          Puestos
        </ItemSidebarNav>
        <ItemSidebarNav
          emptyIcon
          has={['users:roles']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/roles"
        >
          Cargos
        </ItemSidebarNav>
        <ItemSidebarNav
          emptyIcon
          has={['users:userRoles']}
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/users/user-roles"
        >
          Privilegios y roles
        </ItemSidebarNav>
        <ItemSidebarNav
          emptyIcon
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
