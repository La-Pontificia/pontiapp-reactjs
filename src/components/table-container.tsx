import { Spinner } from '@fluentui/react-components'
import { FolderProhibitedRegular } from '@fluentui/react-icons'
import React from 'react'
import { cn } from '~/utils'

export const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    nav?: React.ReactNode
    footer?: React.ReactNode
    isLoading?: boolean
    isEmpty?: boolean
  }
>(({ children, className, nav, footer, isLoading, isEmpty, ...props }, ref) => {
  return (
    <div className="p-2 gap-3 flex overflow-auto flex-col grow">
      {nav && <div className="px-2">{nav}</div>}
      <div
        {...props}
        ref={ref}
        className={cn(
          'bg-white dark:bg-[#232323] flex flex-col overflow-auto grow rounded-2xl',
          className
        )}
      >
        {isLoading ? (
          <div className="flex-grow grid place-content-center">
            <Spinner />
            <p className="text-xs opacity-60 pt-4">Cargando datos...</p>
          </div>
        ) : isEmpty ? (
          <div className="grid place-content-center flex-grow w-full h-full text-xs opacity-80">
            <FolderProhibitedRegular
              fontSize={50}
              className="mx-auto opacity-70"
            />
            <p className="pt-2">No hay nada que mostrar</p>
          </div>
        ) : (
          <div className="grow overflow-auto">{children}</div>
        )}
        {footer && <div className="p-2">{footer}</div>}
      </div>
    </div>
  )
})
