import { cn } from '@/utils'
import React from 'react'

export const Listeng = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean
  }
>(({ className, disabled, ...props }, forwardRef) => {
  return (
    <div
      ref={forwardRef}
      {...props}
      data-ready={!disabled ? '' : undefined}
      className={cn(
        'relative group grayscale opacity-40 data-[ready]:opacity-100 data-[ready]:grayscale-0 aspect-square w-[120px]',
        className
      )}
    >
      <div className="group-data-[ready]:animate-scale-pulse w-full h-full">
        <div className="aspect-square group-data-[ready]:animate-spin absolute inset-0 bg-gradient-to-b from-blue-500 via-violet-500 to-lime-500 rounded-full p-1">
          <div className="w-full h-full dark:bg-stone-950 rounded-full"></div>
        </div>
      </div>
      <div className="aspect-square blur-lg absolute group-data-[ready]:animate-spin inset-0 bg-gradient-to-b from-blue-500 via-violet-500 to-lime-500 rounded-full p-2">
        <div className="w-full h-full dark:bg-stone-950 rounded-full"></div>
      </div>
    </div>
  )
})

Listeng.displayName = 'ListengComponent'
