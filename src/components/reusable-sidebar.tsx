/* eslint-disable react-hooks/exhaustive-deps */
import { useUi } from '~/store/ui'
import { cn } from '~/utils'
import React from 'react'

import { useMediaQuery } from '@uidotdev/usehooks'
import { Link, useLocation } from 'react-router'
import { Avatar, Badge, Tooltip } from '@fluentui/react-components'
import ExpiryStatusRenderer from './expiry-status-renderer'
import { FluentIcon, OpenFilled, OpenRegular } from '@fluentui/react-icons'
import { useAuth } from '~/store/auth'

type ContextReusableSidebar = {
  homePath: string
}
const ContextReusableSidebar = React.createContext<ContextReusableSidebar>(
  {} as ContextReusableSidebar
)

export const ReusableSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    homePath: string
    title?: string
  }
>(({ children, className, homePath, title, ...props }, ref) => {
  const isSidebarOpen = useUi((state) => state.isSidebarOpen)
  const toggleSidebar = useUi((state) => state.toggleSidebar)
  const toggleModuleMaximized = useUi((state) => state.toggleModuleMaximized)
  const isModuleMaximized = useUi((state) => state.isModuleMaximized)
  const [sidebarHover, setSidebarHover] = React.useState(false)

  const isMediumDevice = useMediaQuery(
    'only screen and (min-width : 169px) and (max-width : 992px)'
  )

  React.useEffect(() => {
    if (isMediumDevice && isSidebarOpen) {
      toggleSidebar()
    }
  }, [isMediumDevice])

  return (
    <ContextReusableSidebar.Provider
      value={{
        homePath
      }}
    >
      <aside
        {...props}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        style={{
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          marginLeft: isSidebarOpen ? '0' : '-200px'
        }}
        ref={ref}
        className={cn(
          'h-full max-lg:fixed max-lg:h-svh max-lg:pb-[65px] max-lg:top-[50px] max-lg:w-full max-lg:z-[9999] max-lg:dark:bg-[#21201d] max-lg:bg-[#f5f0f0] max-lg:mb-[65px] overflow-y-auto transition-all w-[200px] min-w-[200px]',
          className
        )}
      >
        <nav className="pl-6 pr-2 pt-4 flex justify-between">
          <h2 className="font-semibold dark:text-blue-400 text-blue-700 text-xs">
            {title}
          </h2>
          <Tooltip
            content={
              isModuleMaximized ? 'Restaurar tamaño' : 'Maximizar módulo actual'
            }
            relationship="label"
          >
            <button
              onClick={toggleModuleMaximized}
              data-active={sidebarHover ? '' : undefined}
              data-maximized={isModuleMaximized ? '' : undefined}
              className="opacity-0 max-lg:hidden text-stone-500 data-[maximized]:rotate-180 data-[maximized]:opacity-100 data-[maximized]:dark:text-[#5e67ed] data-[maximized]:text-blue-600 data-[active]:opacity-100 transition-opacity"
            >
              <OpenFilled fontSize={20} />
            </button>
          </Tooltip>
        </nav>
        {children}
      </aside>
    </ContextReusableSidebar.Provider>
  )
})

ReusableSidebar.displayName = 'ReusableSidebar'

type ItemNav = {
  has: string[]
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

export const ItemSidebarNav = (props: ItemNav) => {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const privileges = user.allPrivileges
  const ctx = React.useContext(ContextReusableSidebar)

  const isMediumDevice = useMediaQuery(
    'only screen and (min-width : 169px) and (max-width : 992px)'
  )

  const hasPrivilege = props.has.some((p) => privileges.includes(p))
  const toggleSidebar = useUi((state) => state.toggleSidebar)
  if (!hasPrivilege && !user.isDeveloper) return null

  const isActive =
    props.href === ctx.homePath
      ? pathname === props.href
      : pathname.startsWith(props.href)

  const Icon = isActive ? props.iconActive : props.icon

  const isExternal = props.href.startsWith('http')
  return (
    <Link
      data-active={isActive ? '' : undefined}
      to={props.href}
      target={isExternal ? '_blank' : undefined}
      onClick={() => {
        if (isMediumDevice) toggleSidebar()
      }}
      className="block relative dark:text-neutral-300 max-lg:dark:text-stone-400 text-neutral-900 data-[active]:font-semibold group pl-1"
    >
      <div className="absolute max-lg:hidden pointer-events-none inset-y-0 left-0 flex items-center">
        <span className="h-[10px] group-data-[active]:h-[5px] transition-all group-hover:h-[10px] group-data-[active]:bg-blue-600 dark:group-data-[active]:bg-[#7385ff] group-data-[active]:opacity-100 w-[3px] rounded-full bg-neutral-500/30 group-hover:opacity-100 opacity-0" />
      </div>
      <div className="flex dark:font-normal font-medium items-center transition-colors group-data-[active]:dark:text-white gap-2 py-1 rounded-lg group-hover:bg-white dark:group-hover:bg-stone-700/50 max-lg:text-base">
        <div className="max-lg:hidden">
          {props.emptyIcon ? (
            <span className="block aspect-square"></span>
          ) : Icon ? (
            <Icon
              fontSize={23}
              className="dark:text-neutral-200 group-data-[active]:dark:text-[#7385ff] group-data-[active]:text-blue-600"
            />
          ) : (
            <Avatar
              size={24}
              image={{
                src: props.avatar
              }}
            />
          )}
        </div>
        {props.children}
        {props.feacture && (
          <ExpiryStatusRenderer from={props.feacture.from}>
            <Badge appearance="tint" color="brand">
              {props.feacture.label}
            </Badge>
          </ExpiryStatusRenderer>
        )}
        {isExternal && <OpenRegular className="ml-auto" fontSize={20} />}
      </div>
    </Link>
  )
}
