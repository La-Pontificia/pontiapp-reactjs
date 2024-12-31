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
  CircleFilled,
  CircleRegular,
  DesktopCursorFilled,
  DesktopCursorRegular,
  DocumentTableFilled,
  DocumentTableRegular,
  type FluentIcon,
  FolderFilled,
  FolderRegular,
  PersonSupportFilled,
  PersonSupportRegular,
  TableSimpleExcludeFilled,
  TableSimpleExcludeRegular,
  TaskListSquarePersonFilled,
  TaskListSquarePersonRegular,
  TicketDiagonalFilled,
  TicketDiagonalRegular
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
    props.href === '/m/attentions'
      ? pathname === props.href
      : pathname.startsWith(props.href)

  const Icon = isActive ? props.iconActive : props.icon

  return (
    <Link
      data-active={isActive ? '' : undefined}
      to={props.href}
      className="block relative dark:text-neutral-300 text-neutral-900 data-[active]:font-semibold group pl-3"
    >
      <div className="absolute pointer-events-none inset-y-0 left-0 flex items-center">
        <span className="h-[20px] group-data-[active]:bg-blue-800 dark:group-data-[active]:bg-blue-500 group-data-[active]:opacity-100 w-[3px] rounded-full bg-stone-500/30 group-hover:opacity-100 opacity-0" />
      </div>
      <div className="flex items-center group-data-[active]:dark:text-white  gap-2 px-2 py-2 rounded-lg group-hover:bg-stone-100 dark:group-hover:bg-stone-200 dark:group-hover:bg-stone-500/20">
        {props.emptyIcon ? (
          <span className="w-[24px] aspect-square"></span>
        ) : Icon ? (
          <Icon
            fontSize={24}
            className="dark:text-stone-400 group-data-[active]:dark:text-blue-500 group-data-[active]:text-blue-800"
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

export default function AttentionsSidenar() {
  // const { user: authUser } = useAuth()
  return (
    <ReusableSidebar>
      <nav className="px-7 pt-4 pb-1">
        <h2 className="text-sm opacity-70">Atenciones</h2>
      </nav>
      <nav className="pr-2 py-2 px-3">
        <ItemNav
          icon={CircleRegular}
          iconActive={CircleFilled}
          href="/m/attentions/register"
        >
          Registro Rápido
        </ItemNav>
        <ItemNav
          icon={PersonSupportRegular}
          iconActive={PersonSupportFilled}
          href="/m/attentions/start"
        >
          Iniciar atención
        </ItemNav>
        <ItemNav
          icon={DesktopCursorRegular}
          iconActive={DesktopCursorFilled}
          href="/m/attentions/start"
        >
          Pantalla de Turnos
        </ItemNav>
        <ItemNav
          icon={TaskListSquarePersonRegular}
          iconActive={TaskListSquarePersonFilled}
          href="/m/attentions"
        >
          Atenciones
        </ItemNav>
        <ItemNav
          icon={TicketDiagonalRegular}
          iconActive={TicketDiagonalFilled}
          href="/m/attentions/tickets"
        >
          Tickets
        </ItemNav>
        <ItemNav
          icon={DocumentTableRegular}
          iconActive={DocumentTableFilled}
          href="/m/attentions/report-files"
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
                icon={TableSimpleExcludeRegular}
                iconActive={TableSimpleExcludeFilled}
                href="/m/attentions/positions"
              >
                Puestos de Atención
              </ItemNav>
              <ItemNav
                icon={FolderRegular}
                iconActive={FolderFilled}
                href="/m/attentions/services"
              >
                Opciones disponibles
              </ItemNav>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </nav>
    </ReusableSidebar>
  )
}
