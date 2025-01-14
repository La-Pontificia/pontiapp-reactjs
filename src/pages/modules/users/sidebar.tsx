import { ReusableSidebar } from '~/components/reusable-sidebar'
import { useAuth } from '~/store/auth'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Tooltip
} from '@fluentui/react-components'
import {
  Add20Regular,
  DocumentFilled,
  DocumentRegular,
  type FluentIcon,
  PeopleFilled,
  PeopleRegular,
  PersonDeleteFilled,
  PersonDeleteRegular,
  PersonFilled,
  PersonRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'

type ItemNav = {
  icon?: FluentIcon
  iconActive?: FluentIcon
  href: string
  avatar?: string
  children?: React.ReactNode
  emptyIcon?: boolean
}
const ItemNav = (props: ItemNav) => {
  const { pathname } = useLocation()

  const isActive =
    props.href === '/m/users'
      ? pathname === props.href
      : pathname.startsWith(props.href)

  const Icon = isActive ? props.iconActive : props.icon

  return (
    <Link
      data-active={isActive ? '' : undefined}
      to={props.href}
      className="block relative dark:text-white text-neutral-900 data-[active]:font-semibold group pl-3"
    >
      <div className="absolute pointer-events-none inset-y-0 left-0 flex items-center">
        <span className="h-[20px] group-data-[active]:bg-blue-800 dark:group-data-[active]:bg-blue-500 group-data-[active]:opacity-100 w-[3px] rounded-full bg-neutral-500/30 group-hover:opacity-100 opacity-0" />
      </div>
      <div className="flex items-center group-data-[active]:dark:text-white  gap-2 px-2 py-2 rounded-lg group-hover:bg-neutral-100 dark:group-hover:bg-neutral-200 dark:group-hover:bg-neutral-500/20">
        {props.emptyIcon ? (
          <span className="w-[24px] aspect-square"></span>
        ) : Icon ? (
          <Icon
            fontSize={24}
            className="dark:text-neutral-100 group-data-[active]:dark:text-blue-500 group-data-[active]:text-blue-800"
          />
        ) : (
          <Avatar
            size={24}
            image={{
              src: props.avatar
            }}
          />
        )}
        {props.children}
      </div>
    </Link>
  )
}

export const UsersSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar>
      <nav className="px-7 pt-4 pb-1">
        <h2 className="text-sm opacity-70 font-semibold">Usuarios</h2>
      </nav>
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
        {/* <ItemNav icon={InfoRegular} iconActive={InfoFilled} href="/m/users">
          Overview
        </ItemNav> */}

        {authUser.hasPrivilege('users:show') && (
          <ItemNav
            icon={PersonRegular}
            iconActive={PersonFilled}
            href="/m/users/all"
          >
            Todos
          </ItemNav>
        )}
        {authUser.hasPrivilege('users:show') && (
          <ItemNav
            icon={PersonDeleteRegular}
            iconActive={PersonDeleteFilled}
            href="/m/users/disabled"
          >
            Inactivos
          </ItemNav>
        )}
        {authUser.hasPrivilege('users:teams') && (
          <ItemNav
            icon={PeopleRegular}
            iconActive={PeopleFilled}
            href="/m/users/teams"
          >
            Grupos
          </ItemNav>
        )}
        {/* {authUser.hasPrivilege('users:reportFiles') && (
          <ItemNav
            icon={DocumentTableRegular}
            iconActive={DocumentTableFilled}
            href="/m/users/report-files"
          >
            Archivos de reportes
          </ItemNav>
        )} */}
        {(authUser.hasPrivilege('users:areas') ||
          authUser.hasPrivilege('users:departments') ||
          authUser.hasPrivilege('users:jobs') ||
          authUser.hasPrivilege('users:roles') ||
          authUser.hasPrivilege('users:userRoles') ||
          authUser.hasPrivilege('users:contractTypes')) && (
          <Accordion multiple defaultOpenItems={['1']} collapsible>
            <AccordionItem value="1">
              <AccordionHeader expandIconPosition="end" className="pl-4">
                <span className="font-semibold">Ajustes</span>
              </AccordionHeader>
              <AccordionPanel className="p-0 !mx-5">
                {authUser.hasPrivilege('users:areas') && (
                  <ItemNav
                    icon={DocumentRegular}
                    iconActive={DocumentFilled}
                    href="/m/users/areas"
                  >
                    Areas de trabajo
                  </ItemNav>
                )}

                {authUser.hasPrivilege('users:departments') && (
                  <ItemNav
                    icon={DocumentRegular}
                    iconActive={DocumentFilled}
                    href="/m/users/departments"
                  >
                    Departamentos
                  </ItemNav>
                )}
                {authUser.hasPrivilege('users:jobs') && (
                  <ItemNav
                    icon={DocumentRegular}
                    iconActive={DocumentFilled}
                    href="/m/users/jobs"
                  >
                    Puestos
                  </ItemNav>
                )}
                {authUser.hasPrivilege('users:roles') && (
                  <ItemNav
                    icon={DocumentRegular}
                    iconActive={DocumentFilled}
                    href="/m/users/roles"
                  >
                    Cargos
                  </ItemNav>
                )}
                {authUser.hasPrivilege('users:userRoles') && (
                  <ItemNav
                    icon={DocumentRegular}
                    iconActive={DocumentFilled}
                    href="/m/users/user-roles"
                  >
                    Privilegios y roles
                  </ItemNav>
                )}
                {authUser.hasPrivilege('users:contractTypes') && (
                  <ItemNav
                    icon={DocumentRegular}
                    iconActive={DocumentFilled}
                    href="/m/users/contract-types"
                  >
                    Tipos de contrato
                  </ItemNav>
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </nav>
    </ReusableSidebar>
  )
}

export default UsersSidebar
