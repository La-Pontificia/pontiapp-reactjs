import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar
} from '@fluentui/react-components'
import {
  type FluentIcon,
  Info20Filled,
  Info20Regular,
  People20Filled,
  People20Regular,
  PeopleProhibited20Filled,
  PeopleProhibited20Regular,
  PeopleTeam20Filled,
  PeopleTeam20Regular
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
    props.href === '/' ? pathname === props.href : pathname.endsWith(props.href)

  const Icon = isActive ? props.iconActive ?? props.icon : props.icon

  return (
    <Link
      data-active={isActive ? '' : undefined}
      to={props.href}
      className="block relative dark:text-neutral-300 text-neutral-700 data-[active]:font-semibold group pl-4"
    >
      <div className="absolute pointer-events-none inset-y-0 left-0 flex items-center px-1">
        <span className="h-[17px] group-data-[active]:bg-blue-800 dark:group-data-[active]:bg-blue-500 group-data-[active]:opacity-100 w-[3px] rounded-full bg-neutral-500/30 group-hover:opacity-100 opacity-0" />
      </div>
      <div className="flex items-center group-data-[active]:dark:text-white transition-all gap-2 px-2 py-2 rounded-lg group-hover:bg-neutral-200 dark:group-hover:bg-black">
        {props.emptyIcon ? (
          <span className="w-[20px] aspect-square"></span>
        ) : Icon ? (
          <Icon className="group-data-[active]:text-blue-800 group-data-[active]:dark:text-blue-500" />
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

export const CollaboratorsSidebar = () => {
  return (
    <aside className="h-full overflow-y-auto w-[300px] min-w-[300px]">
      <nav className="px-1">
        <ItemNav
          icon={Info20Regular}
          iconActive={Info20Filled}
          href="/modules/collaborators"
        >
          Overview
        </ItemNav>
        <ItemNav
          icon={People20Regular}
          iconActive={People20Filled}
          href="/modules/collaborators/all"
        >
          Todos
        </ItemNav>
        <ItemNav
          icon={PeopleProhibited20Regular}
          iconActive={PeopleProhibited20Filled}
          href="/modules/collaborators/actives"
        >
          Inactivos
        </ItemNav>
        <ItemNav
          icon={PeopleTeam20Regular}
          iconActive={PeopleTeam20Filled}
          href="/modules/collaborators/teams"
        >
          Grupos
        </ItemNav>
        <ItemNav emptyIcon href="/modules/collaborators/import">
          Importar
        </ItemNav>
        <ItemNav emptyIcon href="/modules/collaborators/export">
          Exportar
        </ItemNav>
      </nav>
      <Accordion multiple defaultOpenItems={['1']} collapsible>
        <AccordionItem value="1">
          <AccordionHeader expandIconPosition="end" className="pl-4">
            <span className="font-semibold">Ajustes</span>
          </AccordionHeader>
          <AccordionPanel className="p-0 !mx-1">
            <ItemNav emptyIcon href="/modules/collaborators/roles">
              Privilegios y roles
            </ItemNav>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </aside>
  )
}

export default CollaboratorsSidebar
