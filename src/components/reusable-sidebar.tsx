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
          marginLeft: isSidebarOpen ? '0' : '-250px'
        }}
        ref={ref}
        className={cn(
          'h-full max-lg:fixed px-3 max-lg:h-svh max-lg:pb-[65px] max-lg:top-[50px] max-lg:w-full max-lg:z-[9999] max-lg:dark:bg-[#21201d] max-lg:bg-[#f5f0f0] max-lg:mb-[65px] overflow-y-auto transition-all w-[250px] min-w-[250px]',
          className
        )}
      >
        <SidebarTitle
          leftContent={
            <Tooltip
              content={
                isModuleMaximized
                  ? 'Restaurar tamaño'
                  : 'Maximizar módulo actual'
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
          }
        >
          {title}
        </SidebarTitle>
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
      className="block relative dark:text-neutral-300 max-lg:dark:text-stone-400 text-neutral-900 group"
    >
      <div className="flex items-center transition-colors group-data-[active]:font-medium group-data-[active]:dark:text-white gap-2 py-[6px] rounded-lg group-hover:bg-white dark:group-hover:bg-black max-lg:text-base px-2">
        <div className="max-lg:hidden">
          {props.emptyIcon ? (
            <span className="block aspect-square"></span>
          ) : Icon ? (
            <Icon
              fontSize={23}
              className="dark:text-neutral-200 group-data-[active]:dark:text-blue-500 group-data-[active]:text-blue-600"
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

export const SidebarTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    leftContent?: React.ReactNode
  }
>(({ children, className, leftContent, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'flex items-center gap-2 font-semibold dark:text-white text-black text-sm pr-2 pl-1 pb-2 pt-4 justify-between',
        className
      )}
    >
      {children}
      {leftContent}
    </div>
  )
})
