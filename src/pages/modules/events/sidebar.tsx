// import { useAuth } from '~/store/auth'
import { ReusableSidebar } from '~/components/reusable-sidebar'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar
} from '@fluentui/react-components'
import {
  DocumentTableFilled,
  DocumentTableRegular,
  // BuildingFilled,
  // BuildingRegular,
  type FluentIcon,
  GuestAddFilled,
  GuestAddRegular,
  MegaphoneCircleFilled,
  MegaphoneCircleRegular,
  TaskListSquarePersonFilled,
  TaskListSquarePersonRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'
import { useAuth } from '~/store/auth'

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
    props.href === '/m/events'
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

export default function AssistsEvents() {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar>
      <nav className="px-7 pt-4 pb-1">
        <h2 className="text-sm opacity-70">Eventos</h2>
      </nav>
      <nav className="pr-2 py-2 px-3">
        <ItemNav
          icon={MegaphoneCircleRegular}
          iconActive={MegaphoneCircleFilled}
          href="/m/events"
        >
          Eventos
        </ItemNav>
        {authUser.hasPrivilege('events:records:register') && (
          <ItemNav
            icon={GuestAddRegular}
            iconActive={GuestAddFilled}
            href="/m/events/register"
          >
            Registrar asistencia
          </ItemNav>
        )}
        {authUser.hasPrivilege('events:records:view') && (
          <ItemNav
            icon={TaskListSquarePersonRegular}
            iconActive={TaskListSquarePersonFilled}
            href="/m/events/records"
          >
            Registros
          </ItemNav>
        )}

        {authUser.hasPrivilege('events:records:reportFiles') && (
          <ItemNav
            icon={DocumentTableRegular}
            iconActive={DocumentTableFilled}
            href="/m/events/report-files"
          >
            Archivos de reportes
          </ItemNav>
        )}

        <Accordion multiple defaultOpenItems={['1']} collapsible>
          <AccordionItem value="1">
            <AccordionHeader expandIconPosition="end" className="pl-4">
              <span className="font-semibold">Ajustes</span>
            </AccordionHeader>
            <AccordionPanel className="p-0 !mx-5">
              {/* <ItemNav
                icon={BuildingRegular}
                iconActive={BuildingFilled}
                href="/m/assists/databases"
              >
                Unidades de negocio
              </ItemNav> */}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </nav>
    </ReusableSidebar>
  )
}
