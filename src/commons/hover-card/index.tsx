'use client'

import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { cn } from '@/utils'

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, forwardRef) => (
  // <HoverCardPrimitive.Portal forceMount>
  <HoverCardPrimitive.Content
    ref={forwardRef}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 p-3 rounded-xl shadow-[0_0_25px_rgba(0,0,0,.2)] dark:shadow-[0_0_25px_rgba(0,0,0,.3)] bg-white dark:bg-[#2f2e2b] outline-none',
      className
    )}
    {...props}
  />
  // </HoverCardPrimitive.Portal>
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
