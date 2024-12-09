import { useAuth } from '@/store/auth'
import { Tooltip } from '@fluentui/react-components'
import {
  ClockBillFilled,
  ClockBillRegular,
  DataHistogramFilled,
  DataHistogramRegular,
  type FluentIcon,
  HomeFilled,
  HomeRegular,
  MegaphoneLoudFilled,
  MegaphoneLoudRegular,
  PeopleEditFilled,
  PeopleEditRegular,
  SquareHintAppsFilled,
  SquareHintAppsRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'

type ItemNav = {
  icon: FluentIcon
  activeIcon: FluentIcon
  href: string
  tooltip: string
  text: string
}

const ItemNav = (props: ItemNav) => {
  const { pathname } = useLocation()

  const isActive =
    props.href === '/'
      ? pathname === props.href
      : pathname.startsWith(props.href)

  const Icon = isActive ? props.activeIcon : props.icon

  return (
    <Tooltip
      relationship="inaccessible"
      positioning="before-top"
      content={props.tooltip}
    >
      <Link
        data-active={isActive ? '' : undefined}
        to={props.href}
        className="relative px-1.5 group dark:text-stone-400 hover:dark:text-stone-50 data-[active]:dark:text-[#6e7aff] flex justify-center items-center"
      >
        <div className="absolute inset-y-0 group-hover:py-4 group-data-[active]:py-4 py-6 transition-all left-0">
          <div className="h-full w-[3px] group-hover:bg-stone-500/50 transition-all group-data-[active]:dark:bg-[#1e38e2] rounded-xl"></div>
        </div>
        <div className="w-[55px] flex items-center flex-col justify-center aspect-[10/8] py-0.5 text-center rounded-[14px] group-hover:dark:bg-[#0c0b0d] transition-all group-data-[active]:dark:bg-[#0d0d0f] border group-data-[active]:dark:border-violet-300/20 border-transparent">
          <Icon fontSize={25} />
          <p className="text-[10px] pt-0.5 leading-4">{props.text}</p>
        </div>
      </Link>
    </Tooltip>
  )
}

export const RootSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <nav className="flex pl-1 relative z-[1] flex-col space-y-2 justify-center">
      <ItemNav
        tooltip="Ponti App"
        text="Inicio"
        icon={HomeRegular}
        activeIcon={HomeFilled}
        href="/"
      />

      {authUser.hasModule('users') && (
        <ItemNav
          tooltip="Gestión de usuarios"
          text="Usuarios"
          icon={PeopleEditRegular}
          activeIcon={PeopleEditFilled}
          href="/m/users"
        />
      )}

      {authUser.hasModule('edas') && (
        <ItemNav
          tooltip="Gestión de Edas"
          text="Edas"
          icon={DataHistogramRegular}
          activeIcon={DataHistogramFilled}
          href="/m/edas"
        />
      )}

      {authUser.hasModule('assists') && (
        <ItemNav
          tooltip="Gestión de asistencias"
          text="Asisten..."
          icon={ClockBillRegular}
          activeIcon={ClockBillFilled}
          href="/m/assists"
        />
      )}
      {authUser.hasModule('events') && (
        <ItemNav
          tooltip="Gestión de eventos"
          text="Eventos"
          icon={MegaphoneLoudRegular}
          activeIcon={MegaphoneLoudFilled}
          href="/m/events"
        />
      )}
      {authUser.hasModule('tickets') && (
        <ItemNav
          tooltip="Gestión de tickets y colas"
          text="Tickets"
          icon={SquareHintAppsRegular}
          activeIcon={SquareHintAppsFilled}
          href="/m/tickets"
        />
      )}
    </nav>
  )
}

export default RootSidebar
