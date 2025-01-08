// import { useAuth } from '~/store/auth'
import { ReusableSidebar } from '~/components/reusable-sidebar'
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge
} from '@fluentui/react-components'
import {
  ClockFilled,
  ClockRegular,
  // ClockFilled,
  // ClockRegular,
  CloudDatabaseFilled,
  CloudDatabaseRegular,
  DocumentPersonFilled,
  DocumentPersonRegular,
  DocumentTableFilled,
  DocumentTableRegular,
  type FluentIcon,
  FolderFilled,
  FolderRegular,
  PersonCircleFilled,
  PersonCircleRegular,
  // PersonCircleFilled,
  // PersonCircleRegular,
  PersonDeleteFilled,
  PersonDeleteRegular,
  TextBulletListSquareClockFilled,
  TextBulletListSquareClockRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'
import { useAuth } from '~/store/auth'
import ExpiryStatusRenderer from '~/components/expiry-status-renderer'

type ItemNav = {
  icon?: FluentIcon
  iconActive?: FluentIcon
  href: string
  avatar?: string
  children?: React.ReactNode
  emptyIcon?: boolean
  feacture?: {
    label: string
    from: Date
  }
}

const ItemNav = (props: ItemNav) => {
  const { pathname } = useLocation()

  const isActive =
    props.href === '/m/assists'
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
        <span className="h-[20px] group-data-[active]:bg-blue-800 dark:group-data-[active]:bg-blue-500 group-data-[active]:opacity-100 w-[3px] rounded-full bg-neutral-500/30 group-hover:opacity-100 opacity-0" />
      </div>
      <div className="flex items-center group-data-[active]:dark:text-white  gap-2 px-2 py-2 rounded-lg group-hover:bg-neutral-100 dark:group-hover:bg-neutral-200 dark:group-hover:bg-neutral-500/20">
        {props.emptyIcon ? (
          <span className="w-[24px] aspect-square"></span>
        ) : Icon ? (
          <Icon
            fontSize={24}
            className="dark:text-neutral-400 group-data-[active]:dark:text-blue-500 group-data-[active]:text-blue-800"
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
        {props.feacture && (
          <ExpiryStatusRenderer from={props.feacture.from}>
            <Badge appearance="tint" color="brand">
              {props.feacture.label}
            </Badge>
          </ExpiryStatusRenderer>
        )}
      </div>
    </Link>
  )
}

export const AssistsSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar>
      <nav className="px-7 pt-4 pb-1">
        <h2 className="text-sm opacity-70">Asistencias</h2>
      </nav>
      <nav className="pr-2 py-2 px-3">
        {authUser.hasPrivilege('assists:my') && (
          <ItemNav
            icon={PersonCircleRegular}
            iconActive={PersonCircleFilled}
            href="/m/assists/my"
          >
            Mis asistencias
          </ItemNav>
        )}
        {authUser.hasPrivilege('assists:schedules') && (
          <ItemNav
            feacture={{
              label: 'Nuevo',
              from: new Date('2025-01-06')
            }}
            icon={ClockRegular}
            iconActive={ClockFilled}
            href="/m/assists"
          >
            Asistencias
          </ItemNav>
        )}
        {authUser.hasPrivilege('assists:withUsers') && (
          <ItemNav
            icon={DocumentPersonRegular}
            iconActive={DocumentPersonFilled}
            href="/m/assists/with-users"
          >
            Con usuarios
          </ItemNav>
        )}
        {authUser.hasPrivilege('assists:withoutUsers') && (
          <ItemNav
            icon={PersonDeleteRegular}
            iconActive={PersonDeleteFilled}
            href="/m/assists/without-users"
          >
            Sin usuarios
          </ItemNav>
        )}
        {authUser.hasPrivilege('assists:summary') && (
          <ItemNav
            icon={TextBulletListSquareClockRegular}
            iconActive={TextBulletListSquareClockFilled}
            href="/m/assists/summary"
          >
            Resumen único
          </ItemNav>
        )}

        {authUser.hasPrivilege('assists:reportFiles') && (
          <ItemNav
            icon={DocumentTableRegular}
            iconActive={DocumentTableFilled}
            href="/m/assists/report-files"
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
              {authUser.hasPrivilege('assists:assistTerminals') && (
                <ItemNav
                  icon={FolderRegular}
                  iconActive={FolderFilled}
                  href="/m/assists/terminals"
                >
                  Biometricos
                </ItemNav>
              )}
              {authUser.hasPrivilege('assists:databases') && (
                <ItemNav
                  icon={CloudDatabaseRegular}
                  iconActive={CloudDatabaseFilled}
                  href="/m/assists/databases"
                >
                  Bases de datos
                </ItemNav>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </nav>
    </ReusableSidebar>
  )
}

export default AssistsSidebar
