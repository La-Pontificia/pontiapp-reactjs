// import { useAuth } from '@/store/auth'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar
} from '@fluentui/react-components'
import {
  DocumentFolderFilled,
  DocumentFolderRegular,
  DocumentTableFilled,
  DocumentTableRegular,
  type FluentIcon,
  FolderFilled,
  FolderRegular,
  InfoFilled,
  InfoRegular,
  PeopleEyeFilled,
  PeopleEyeRegular,
  PersonStarburstFilled,
  PersonStarburstRegular
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
    props.href === '/m/edas'
      ? pathname === props.href
      : pathname.startsWith(props.href)

  const Icon = isActive ? props.iconActive : props.icon

  return (
    <Link
      data-active={isActive ? '' : undefined}
      to={props.href}
      className="block relative dark:text-neutral-300 text-neutral-700 data-[active]:font-semibold group pl-3"
    >
      <div className="absolute pointer-events-none inset-y-0 left-0 flex items-center">
        <span className="h-[20px] group-data-[active]:bg-blue-800 dark:group-data-[active]:bg-blue-500 group-data-[active]:opacity-100 w-[3px] rounded-full bg-stone-500/30 group-hover:opacity-100 opacity-0" />
      </div>
      <div className="flex items-center group-data-[active]:dark:text-white transition-all gap-2 px-2 py-2 rounded-lg group-hover:bg-stone-200 dark:group-hover:bg-stone-500/20">
        {props.emptyIcon ? (
          <span className="w-[24px] aspect-square"></span>
        ) : Icon ? (
          <Icon
            fontSize={24}
            className="group-data-[active]:text-blue-500 dark:text-stone-400 group-data-[active]:dark:text-blue-500"
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

export const EdasSidebar = () => {
  // const { user: authUser } = useAuth()
  return (
    <aside className="h-full lg:block hidden overflow-y-auto w-[280px] min-w-[280px]">
      <nav className="px-7 pt-4 pb-1">
        <h2 className="text-sm opacity-70">Edas</h2>
      </nav>
      <nav className="pr-2 py-2 px-3">
        <ItemNav icon={InfoRegular} iconActive={InfoFilled} href="/m/edas">
          Overview
        </ItemNav>
        <ItemNav
          icon={PersonStarburstRegular}
          iconActive={PersonStarburstFilled}
          href="/m/edas/my"
        >
          Mis edas
        </ItemNav>
        <ItemNav
          icon={PeopleEyeRegular}
          iconActive={PeopleEyeFilled}
          href="/m/edas/collaborators"
        >
          Colaboradores
        </ItemNav>
        <ItemNav
          icon={DocumentFolderRegular}
          iconActive={DocumentFolderFilled}
          href="/m/edas/all"
        >
          Todas las edas
        </ItemNav>

        <ItemNav
          icon={DocumentTableRegular}
          iconActive={DocumentTableFilled}
          href="/m/edas/report-files"
        >
          Archivos de reportes
        </ItemNav>

        <Accordion multiple defaultOpenItems={['1']} collapsible>
          <AccordionItem value="1">
            <AccordionHeader expandIconPosition="end" className="pl-4">
              <span className="font-semibold">Ajustes</span>
            </AccordionHeader>
            <AccordionPanel className="p-0 !mx-5">
              <ItemNav
                icon={FolderRegular}
                iconActive={FolderFilled}
                href="/m/users/years"
              >
                Años
              </ItemNav>
              <ItemNav
                icon={FolderRegular}
                iconActive={FolderFilled}
                href="/m/users/areas"
              >
                Plantillas de encuestas
              </ItemNav>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </nav>
    </aside>
  )
}

export default EdasSidebar
