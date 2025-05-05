import { useAuth } from '@/store/auth'
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
  HatGraduationSparkleFilled,
  HatGraduationSparkleRegular,
  HomeFilled,
  HomeRegular,
  MegaphoneLoudFilled,
  MegaphoneLoudRegular,
  PeopleFilled,
  PeopleRegular,
  // PersonFilled,
  // PersonRegular,
  SearchRegular,
  // StoreMicrosoftFilled,
  // StoreMicrosoftRegular,
  // TabletFilled,
  // TabletRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'
import { cn } from '@/utils'
import Theme from './theme'
// import { Lp } from '@/icons'
// import { Lp } from '@/icons'

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
        className={cn(
          'relative group dark:text-stone-400 text-stone-600 flex justify-center items-center',
          props.className
        )}
      >
        <div className="absolute inset-y-0 transition-all group-hover:py-5 group-data-[active]:py-4 py-7 left-0">
          <div className="h-full w-[3px] group-hover:bg-blue-700 group-hover:dark:bg-violet-600 group-data-[active]:bg-blue-700 group-data-[active]:dark:bg-violet-600 rounded-xl"></div>
        </div>
        <div className="w-[57px] transition-colors min-w-[57px] flex group-data-[active]:shadow-sm border-transparent border group-data-[active]:border-stone-200 group-data-[active]:dark:border-stone-700/70 items-center flex-col justify-center aspect-[10/9] text-center rounded-[14px] group-data-[active]:bg-white group-hover:dark:bg-[#1a1a1a] hover:bg-white group-data-[active]:dark:bg-[#1a1a1a]">
          {Icon ? (
            <Icon
              fontSize={28}
              className="group-data-[active]:dark:text-violet-600 transition-all group-hover:scale-105 group-hover:dark:text-violet-600 group-hover:text-blue-700 group-data-[active]:text-blue-700"
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
          <p className="text-[10px] max-w-[9ch] leading-4 line-clamp-1 text-ellipsis">
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
    <header className="flex max-lg:w-full max-lg:border-t dark:border-black max-lg:bottom-0 max-lg:h-[65px] max-lg:fixed flex-col gap-5 min-w-[70px] relative justify-between z-[1] overflow-x-hidden overflow-y-auto lg:py-2 h-full">
      <nav className="pl-1 hidden lg:flex flex-col flex-grow space-y-4 overflow-y-auto">
        {/* <Link to="/" className=" flex items-center justify-center pt-2">
          <Lp
            size={35}
            className="dark:text-violet-500 lg:block hidden text-violet-700"
          />
        </Link> */}
        <ItemNav
          tooltip={authUser.displayName}
          text={authUser.displayName}
          // image={authUser.photoURL}
          icon={HomeRegular}
          activeIcon={HomeFilled}
          href={`/${authUser.username}`}
        />
        {authUser.hasModule('users') && (
          <ItemNav
            tooltip="Gestión de usuarios"
            text="Usuarios"
            icon={PeopleRegular}
            activeIcon={PeopleFilled}
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

        {/* {authUser.hasModule('attentions') && (
          <ItemNav
            tooltip="Control de atención de tickets"
            text="Tickets"
            icon={TabletRegular}
            activeIcon={TabletFilled}
            href="/m/attentions"
          />
        )} */}

        {/* {authUser.hasModule('inventories') && (
          <ItemNav
            tooltip="Modulo de inventarios"
            text="Inventario"
            icon={StoreMicrosoftRegular}
            activeIcon={StoreMicrosoftFilled}
            href="/m/inventories"
          />
        )} */}
        {authUser.hasModule('academic') && (
          <ItemNav
            tooltip="Gestión Académica"
            text="Académica"
            icon={HatGraduationSparkleRegular}
            activeIcon={HatGraduationSparkleFilled}
            href="/m/academic"
          />
        )}
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
        <Theme />
      </nav>
    </header>
  )
}

export default RootSidebar
