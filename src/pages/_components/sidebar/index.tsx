import { useAuth } from '~/store/auth'
import { Avatar, Tooltip } from '@fluentui/react-components'
import {
  ClockFilled,
  ClockRegular,
  DocumentFlowchartFilled,
  DocumentFlowchartRegular,
  type FluentIcon,
  MegaphoneLoudFilled,
  MegaphoneLoudRegular,
  PersonFilled,
  PersonRegular,
  StoreMicrosoftFilled,
  StoreMicrosoftRegular,
  TabletFilled,
  TabletRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'
import React from 'react'
import SettingsDrawer from './settings'
// import { Lp } from '~/icons'

type ItemNav = {
  icon?: FluentIcon
  activeIcon?: FluentIcon
  href: string
  image?: string
  tooltip: string
  text: string
}

const ItemNav = (props: ItemNav) => {
  const { pathname } = useLocation()

  const isActive =
    props.href === '/'
      ? pathname === props.href
      : pathname.startsWith(props.href)
  const [hover, setHover] = React.useState(false)

  const Icon = isActive || hover ? props.activeIcon : props.icon

  return (
    <Tooltip
      relationship="inaccessible"
      positioning="before-top"
      content={props.tooltip}
    >
      <Link
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        data-active={isActive ? '' : undefined}
        to={props.href}
        className="relative group dark:text-stone-400 text-stone-600 flex justify-center items-center"
      >
        <div className="absolute inset-y-0 transition-all group-hover:py-5 group-data-[active]:py-4 py-7 left-0">
          <div className="h-full w-[3px] group-hover:bg-[#1d02ec] group-hover:dark:bg-[#7385ff] group-data-[active]:bg-[#1d02ec] group-data-[active]:dark:bg-[#7385ff] rounded-xl"></div>
        </div>
        <div className="w-[57px] transition-colors min-w-[57px] flex group-data-[active]:shadow-sm border-transparent border group-data-[active]:border-stone-200 group-data-[active]:dark:border-stone-700/70 items-center flex-col justify-center aspect-[10/9] text-center rounded-[14px] group-data-[active]:bg-white group-hover:dark:bg-[#1a1a1a] hover:bg-white group-data-[active]:dark:bg-[#1a1a1a]">
          {Icon ? (
            <Icon
              fontSize={28}
              className="group-data-[active]:dark:text-[#7385ff] group-hover:dark:text-[#7385ff] group-hover:text-[#1d02ec] group-data-[active]:text-[#1d02ec]"
            />
          ) : (
            <Avatar
              name={props.text}
              color="colorful"
              size={24}
              image={{
                src: props.image
              }}
            />
          )}
          <p className="text-[10px] leading-4 line-clamp-1">{props.text}</p>
        </div>
      </Link>
    </Tooltip>
  )
}

export const RootSidebar = ({
  contentRef
}: {
  contentRef: React.RefObject<HTMLDivElement>
}) => {
  const { user: authUser } = useAuth()
  return (
    <header className="flex flex-col gap-5 min-w-[70px] relative justify-between z-[1] overflow-x-hidden overflow-y-auto py-2 h-full">
      <nav className="flex pl-1 flex-col flex-grow space-y-4 overflow-y-auto">
        <ItemNav
          tooltip={authUser.displayName}
          text={authUser.displayName}
          image={authUser.photoURL}
          href={`/${authUser.username}`}
        />
        {authUser.hasModule('users') && (
          <ItemNav
            tooltip="Gestión de usuarios"
            text="Usuarios"
            icon={PersonRegular}
            activeIcon={PersonFilled}
            href="/m/users"
          />
        )}
        {authUser.hasModule('edas') && (
          <ItemNav
            tooltip="Gestión de Edas"
            text="Edas"
            icon={DocumentFlowchartRegular}
            activeIcon={DocumentFlowchartFilled}
            href="/m/edas"
          />
        )}
        {authUser.hasModule('assists') && (
          <ItemNav
            tooltip="Gestión de asistencias"
            text="Asisten..."
            icon={ClockRegular}
            activeIcon={ClockFilled}
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

        {authUser.hasModule('attentions') && (
          <ItemNav
            tooltip="Control de atención de tickets"
            text="Tickets"
            icon={TabletRegular}
            activeIcon={TabletFilled}
            href="/m/attentions"
          />
        )}

        {authUser.hasModule('inventories') && (
          <ItemNav
            tooltip="Modulo de inventarios"
            text="Inventario"
            icon={StoreMicrosoftRegular}
            activeIcon={StoreMicrosoftFilled}
            href="/m/inventories"
          />
        )}
      </nav>
      <nav className="flex justify-center">
        <SettingsDrawer contentRef={contentRef} />
      </nav>
    </header>
  )
}

export default RootSidebar
