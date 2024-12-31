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
import React from 'react'

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
        className="relative px-1.5 group dark:text-stone-400 text-stone-600  flex justify-center items-center"
      >
        <div className="absolute inset-y-0 transition-all group-hover:py-6 group-data-[active]:py-4 py-7  left-0">
          <div className="h-full w-[3px] group-hover:bg-[#1e38e2] group-hover:dark:bg-[#1e38e2]  group-data-[active]:bg-blue-600 group-data-[active]:dark:bg-[#1e38e2] rounded-xl"></div>
        </div>
        <div className="w-[60px] min-w-[60px] flex group-data-[active]:shadow-sm border-transparent group-data-[active]:border group-data-[active]:border-stone-200 group-data-[active]:dark:border-stone-800 items-center flex-col justify-center aspect-[10/9] py-0.5 text-center rounded-[14px] group-data-[active]:bg-white group-hover:dark:bg-[#0c0b0d] hover:bg-white/60  group-data-[active]:dark:bg-[#0d0d0f]">
          {props.image ? (
            <Avatar
              name={props.text}
              color="colorful"
              size={24}
              className=""
              image={{
                src: props.image
              }}
            />
          ) : (
            <Icon
              fontSize={25}
              className="group-data-[active]:dark:text-[#381aff] group-data-[active]:text-[#1d02ec]"
            />
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
    <header className="flex flex-col min-w-[70px] relative justify-between z-[1] overflow-x-hidden overflow-y-auto py-5 h-full">
      <nav className="flex-grow basis-0">
        <Link
          to={`/${authUser.username}`}
          className="flex justify-center items-center gap-1"
        >
          <img
            src="/_lp-only-logo.webp"
            width={25}
            alt='Logo Lettras "La Pontificia"'
          />
        </Link>
      </nav>
      <nav className="flex pl-1 flex-col space-y-2 justify-center">
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
      <nav className="flex-grow basis-0 justify-end"></nav>
    </header>
  )
}

export default RootSidebar
