import { cn } from '~/utils'
import React from 'react'

export const Listeng = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    pulse?: boolean
    rotate?: boolean
    grayScale?: boolean
  }
>(
  (
    { className, pulse = false, rotate = false, grayScale = true, ...props },
    forwardRef
  ) => {
    return (
      <div
        ref={forwardRef}
        {...props}
        data-grayScale={grayScale ? '' : undefined}
        className={cn(
          'relative group data-[grayScale]:opacity-40 data-[grayScale]:grayscale aspect-square w-[150px]',
          className
        )}
      >
        <div
          data-pulse={pulse ? '' : undefined}
          className="data-[pulse]:animate-scale-pulse w-full h-full"
        >
          <div
            data-rotate={rotate ? '' : undefined}
            className="aspect-square data-[rotate]:animate-spin absolute inset-0 bg-gradient-to-b from-blue-500 via-violet-500 to-lime-500 rounded-full p-1"
          >
            <div className="w-full h-full dark:bg-neutral-950 bg-white rounded-full"></div>
          </div>
        </div>
        <div
          data-pulse={pulse ? '' : undefined}
          className="data-[pulse]:animate-scale-pulse w-full absolute inset-0 h-full"
        >
          <div
            data-rotate={rotate ? '' : undefined}
            className="aspect-square blur-lg w-full h-full data-[rotate]:animate-spin bg-gradient-to-b from-blue-500 via-violet-500 to-lime-500 rounded-full p-2"
          >
            <div className="w-full h-full dark:bg-neutral-950 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }
)

Listeng.displayName = 'ListengComponent'
