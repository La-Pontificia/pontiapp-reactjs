import { useAuth } from '~/store/auth'
import { Avatar, Tooltip } from '@fluentui/react-components'
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
  TabletSpeakerFilled,
  TabletSpeakerRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'

type ItemNav = {
  icon: FluentIcon
  activeIcon: FluentIcon
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
        className="relative px-1.5 group dark:text-stone-400 hover:dark:text-stone-50 data-[active]:dark:text-[#381aff] flex justify-center items-center"
      >
        <div className="absolute inset-y-0 group-hover:py-6 group-data-[active]:py-4 py-7 transition-all left-0">
          <div className="h-full w-[3px] group-hover:dark:bg-[#1e38e2] transition-all group-data-[active]:dark:bg-[#1e38e2] rounded-xl"></div>
        </div>
        <div className="w-[55px] flex items-center flex-col justify-center aspect-[10/10] py-0.5 text-center rounded-[14px] group-hover:dark:bg-[#0c0b0d] transition-all group-data-[active]:dark:bg-[#0d0d0f] border-transparent">
          {props.image ? (
            <Avatar
              name={props.text}
              color="colorful"
              size={24}
              image={{
                src: props.image
              }}
            />
          ) : (
            <Icon fontSize={25} />
          )}
          <p className="text-[10px] pt-0.5 leading-4 line-clamp-1">
            {props.text}
          </p>
        </div>
      </Link>
    </Tooltip>
  )
}

export const RootSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <nav className="flex pl-1 relative z-[1] flex-col space-y-1 justify-center">
      <ItemNav
        tooltip={authUser.displayName}
        text={authUser.displayName}
        image={authUser.photoURL}
        icon={HomeRegular}
        activeIcon={HomeFilled}
        href={`/${authUser.username}`}
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
      {authUser.hasModule('attentions') && (
        <ItemNav
          tooltip="Control de Atención"
          text="Atención"
          icon={TabletSpeakerRegular}
          activeIcon={TabletSpeakerFilled}
          href="/m/attentions"
        />
      )}
    </nav>
  )
}

export default RootSidebar
