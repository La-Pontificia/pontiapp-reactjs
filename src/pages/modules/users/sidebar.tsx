import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import { useAuth } from '~/store/auth'
import { Tooltip } from '@fluentui/react-components'
import {
  Add20Regular,
  DocumentFilled,
  DocumentRegular,
  PeopleFilled,
  PeopleRegular,
  PersonDeleteFilled,
  PersonDeleteRegular,
  PersonFilled,
  PersonRegular
} from '@fluentui/react-icons'
import { Link } from 'react-router'

export const UsersSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar homePath="/m/users" title="Usuarios">
      {authUser.hasPrivilege('users:create') && (
        <nav className="w-full px-5 pt-4">
          <Tooltip relationship="label" content="Nuevo usuario">
            <Link
              to="/m/users/create"
              className="flex text-sm rounded-full dark:text-white p-1.5 px-4 w-fit hover:scale-110 transition-transform justify-center bg-gradient-to-r text-white from-blue-600 to-violet-600 hover:bg-blue-500 dark:from-blue-600 dark:to-violet-600 hover:dark:bg-blue-500 items-center gap-1 font-semibold"
            >
              <Add20Regular />
              Nuevo
            </Link>
          </Tooltip>
        </nav>
      )}
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
