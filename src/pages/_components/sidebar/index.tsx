import { useAuth } from '~/store/auth'
import { Avatar, Tooltip } from '@fluentui/react-components'
import {
  ClockFilled,
  ClockRegular,
  CloudDatabaseFilled,
  CloudDatabaseRegular,
  DocumentFlowchartFilled,
  DocumentFlowchartRegular,
  type FluentIcon,
  GridDotsRegular,
  HomeRegular,
  MegaphoneLoudFilled,
  MegaphoneLoudRegular,
  PersonFilled,
  PersonRegular,
  SearchRegular,
  // StoreMicrosoftFilled,
  // StoreMicrosoftRegular,
  TabletFilled,
  TabletRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'
import React from 'react'
import SettingsDrawer from './settings'
import { cn } from '~/utils'
// import { Lp } from '~/icons'

type ItemNav = {
  icon?: FluentIcon
  activeIcon?: FluentIcon
  href: string
  image?: string
  tooltip: string
  text: string
  className?: string
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
        className={cn(
          'relative group dark:text-stone-400 text-stone-600 flex justify-center items-center',
          props.className
        )}
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
          <p className="text-[10px] leading-4 line-clamp-1 text-ellipsis">
            {props.text}
          </p>
        </div>
      </Link>
    </Tooltip>
  )
}

export const RootSidebar = () => {
  const { user: authUser } = useAuth()

  const responsiveItems = {
    user: {
      href: `/${authUser.username}`,
      text: 'Inicio',
      icon: HomeRegular
    },
    search: {
      href: '/search',
      text: 'Buscar',
      icon: SearchRegular
    },
    modules: {
      text: 'Módulos',
      href: '/m',
      icon: GridDotsRegular
    }
  }
  return (
    <header className="flex max-lg:w-full max-lg:bottom-0 max-lg:h-[65px] max-lg:dark:bg-[#312f2c] max-lg:bg-[#f5f0f0] max-lg:fixed flex-col gap-5 min-w-[70px] relative justify-between z-[1] overflow-x-hidden overflow-y-auto lg:py-2 h-full">
      <nav className="pl-1 hidden lg:flex flex-col flex-grow space-y-4 overflow-y-auto">
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

        {/* {authUser.hasModule('inventories') && (
          <ItemNav
            tooltip="Modulo de inventarios"
            text="Inventario"
            icon={StoreMicrosoftRegular}
            activeIcon={StoreMicrosoftFilled}
            href="/m/inventories"
          />
        )} */}
        {authUser.hasModule('rm') && (
          <ItemNav
            tooltip="Gestión de recursos"
            text="Recursos"
            icon={CloudDatabaseRegular}
            activeIcon={CloudDatabaseFilled}
            href="/m/rm"
          />
        )}
      </nav>
      <nav className="flex lg:hidden h-full">
        {Object.entries(responsiveItems).map(([key, item]) => {
          return (
            <Link
              className="w-full text-xs dark:text-stone-300 flex text-center items-center justify-center"
              key={key}
              to={item.href}
            >
              <div>
                <item.icon fontSize={25} className="mx-auto" />
                <p>{item.text}</p>
              </div>
            </Link>
          )
        })}
      </nav>
      <nav className="flex max-lg:hidden justify-center">
        <SettingsDrawer />
      </nav>
    </header>
  )
}

export default RootSidebar
