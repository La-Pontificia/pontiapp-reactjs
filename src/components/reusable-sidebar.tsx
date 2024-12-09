import { useUi } from '@/store/ui'
import { cn } from '@/utils'
import React from 'react'

export const ReusableSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const isSidebarOpen = useUi((state) => state.isSidebarOpen)
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
