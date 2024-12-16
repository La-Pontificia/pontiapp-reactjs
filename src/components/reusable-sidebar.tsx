/* eslint-disable react-hooks/exhaustive-deps */
import { useUi } from '~/store/ui'
import { cn } from '~/utils'
import React from 'react'

import { useMediaQuery } from '@uidotdev/usehooks'

export const ReusableSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const isSidebarOpen = useUi((state) => state.isSidebarOpen)
  const toggleSidebar = useUi((state) => state.toggleSidebar)

  const isMediumDevice = useMediaQuery(
    'only screen and (min-width : 369px) and (max-width : 992px)'
  )

  React.useEffect(() => {
    if (isMediumDevice && isSidebarOpen) {
      toggleSidebar()
    }
  }, [isMediumDevice])

  return (
    <aside
      {...props}
      style={{
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        marginLeft: isSidebarOpen ? '0' : '-280px'
      }}
      ref={ref}
      className={cn(
        'h-full transition-all overflow-y-auto w-[280px] min-w-[280px]',
        className
      )}
    >
      {children}
    </aside>
  )
})

ReusableSidebar.displayName = 'ReusableSidebar'
