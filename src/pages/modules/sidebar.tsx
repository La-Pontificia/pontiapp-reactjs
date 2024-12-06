import { Tooltip } from '@fluentui/react-components'
import {
  ClockBillFilled,
  DocumentLandscapeDataFilled,
  type FluentIcon,
  LaptopPersonFilled,
  MegaphoneLoudFilled,
  PeopleFilled
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'

type ItemNav = {
  icon: FluentIcon
  href: string
  tooltip: string
}

const ItemNav = (props: ItemNav) => {
  const { pathname } = useLocation()

  const isActive =
    props.href === '/'
      ? pathname === props.href
      : pathname.startsWith(props.href)

  const Icon = props.icon

  return (
    <Tooltip
      relationship="inaccessible"
      positioning="before-top"
      content={props.tooltip}
    >
      <Link
        data-active={isActive ? '' : undefined}
        to={props.href}
        className="px-5 data-[active]:drop-shadow-[0_0px_5px_rgba(37,99,235,.4)] relative py-3.5 group dark:text-stone-600 data-[active]:dark:text-blue-500 flex justify-center items-center"
      >
        <div className="absolute inset-y-0 py-3 left-0">
          <div className="h-full w-[3px] group-hover:bg-stone-500/50 transition-all group-data-[active]:dark:bg-blue-600 rounded-xl"></div>
        </div>
        <Icon fontSize={24} className="group-hover:scale-110" />
      </Link>
    </Tooltip>
  )
}

export const ModuleSidebar = () => {
  return (
    <nav className="border-r dark:border-stone-800">
      <ItemNav
        tooltip="Gestión de usuarios"
        icon={PeopleFilled}
        href="/modules/collaborators"
      />
      <ItemNav
        tooltip="Gestión de EDAs"
        icon={DocumentLandscapeDataFilled}
        href="/modules/edas"
      />
      <ItemNav
        tooltip="Gestión de asistencias"
        icon={ClockBillFilled}
        href="/modules/assists"
      />
      <ItemNav
        tooltip="Gestión de eventos"
        icon={MegaphoneLoudFilled}
        href="/modules/events"
      />
      <ItemNav
        tooltip="Gestión de tickets y colas"
        icon={LaptopPersonFilled}
        href="/modules/tickets"
      />
    </nav>
  )
}

export default ModuleSidebar
