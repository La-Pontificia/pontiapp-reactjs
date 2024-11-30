/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { X } from 'lucide-react'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed z-[9999999] pointer-events-none max-h-screen p-6 bottom-0 right-0 top-auto w-full flex justify-center mx-auto',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'p-4 flex flex-col items-center gap-2 relative font-medium text-15 pointer-events-auto rounded-[10px] max-w-[97vw] data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut data-[state=close]:animate-slideOut data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=cancel]:translate-y-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut',
  {
    variants: {
      variant: {
        default: [
          'bg-black',
          'text-[#e7e5e4]',
          'drop-shadow-[0_10px_10px_rgba(0,0,0,.3)]',
          'dark:bg-white',
          'dark:text-black'
        ],
        success: ['dark:bg-green-600', 'text-white'],
        error: ['dark:bg-red-600', 'text-white', 'shadow-red-500/40'],
        warning: [
          'bg-yellow-400',
          'text-white',
          'drop-shadow-[0_10px_20px_rgba(234,179,8,.2)]'
        ],
        info: [
          'bg-sky-500',
          'text-white',
          'drop-shadow-[0_10px_20px_rgba(14,165,233,.2)]'
        ],
        empty: []
      },
      description: {
        true: ['text-left'],
        false: ['text-center']
      }
    },
    defaultVariants: {
      variant: 'default',
      description: false
    }
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={toastVariants({ variant })}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={className} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={className} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
}
