import { useAuth } from '@/store/auth'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar
} from '@fluentui/react-components'
import {
  Book20Regular,
  Clock20Filled,
  Clock20Regular,
  DocumentBulletList20Regular,
  type FluentIcon,
  Megaphone20Regular,
  People20Regular,
  TicketDiagonal20Regular
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
  const location = useLocation()

  const isActive = location.pathname.startsWith(props.href)

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
      <div className="flex items-center group-data-[active]:dark:text-white transition-all gap-2 px-2 py-2.5 rounded-lg group-hover:bg-neutral-200 dark:group-hover:bg-black">
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

export const RootSidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="h-full overflow-y-auto w-[300px] min-w-[300px]">
      <div className="py-10">
        <header className="text-sm px-7 font-semibold pb-1">
          {user.full_name}
        </header>
        <nav className="px-1">
          <ItemNav avatar={user.profile} href="/">
            Mi perfil
          </ItemNav>
          <ItemNav icon={Clock20Regular} iconActive={Clock20Filled} href="#">
            Mis asistencias
          </ItemNav>
        </nav>
        <Accordion multiple defaultOpenItems={['1']} collapsible>
          <AccordionItem value="1">
            <AccordionHeader expandIconPosition="end" className="pl-4">
              <span className="font-semibold">Módulos administrativos</span>
            </AccordionHeader>
            <AccordionPanel className="p-0 !mx-1">
              <ItemNav icon={People20Regular} href="/modules/collaborators">
                Gestión Colaboradores
              </ItemNav>
              <ItemNav icon={Book20Regular} href="/modules/edas">
                Gestión EDAs
              </ItemNav>
              <ItemNav
                icon={DocumentBulletList20Regular}
                href="/modules/assists"
              >
                Gestión Asistencia
              </ItemNav>
              <ItemNav icon={Megaphone20Regular} href="/modules/events">
                Gestión Eventos
              </ItemNav>
              <ItemNav icon={TicketDiagonal20Regular} href="/modules/tickets">
                Gestión Tickets
              </ItemNav>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionHeader expandIconPosition="end" className="pl-4">
              <span className="font-semibold">Ajustes de sistema</span>
            </AccordionHeader>
            <AccordionPanel className="p-0 !mx-1">
              <ItemNav emptyIcon href="/settings/areas">
                Areas de trabajo
              </ItemNav>
              <ItemNav emptyIcon href="/settings/departments">
                Departamentos
              </ItemNav>
              <ItemNav emptyIcon href="/settings/positions">
                Puestos de trabajo
              </ItemNav>
              <ItemNav emptyIcon href="/settings/roles">
                Cargos
              </ItemNav>
              <ItemNav emptyIcon href="/settings/branches">
                Sedes
              </ItemNav>
              <ItemNav emptyIcon href="/settings/businesses">
                Unidades de negocio
              </ItemNav>
              <ItemNav emptyIcon href="/settings/contract-types">
                Tipos de contrato
              </ItemNav>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )
}

export default RootSidebar
