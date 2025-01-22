import React from 'react'
import { DismissFilled } from '@fluentui/react-icons'
import { cn } from '~/utils'

export const SearchBox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    dismiss?: () => void
  }
>(({ className, ...props }, ref) => {
  return (
    <label className="flex relative group items-center gap-2">
      <input
        ref={ref}
        {...props}
        className={cn(
          'w-full bg-transparent text-[13px] focus:border-blue-500 outline-none border rounded-full px-3 placeholder:text-stone-500 placeholder:font-medium py-1.5 border-stone-500',
          className
        )}
      />
      <div className="absolute group-hover:opacity-100 opacity-0 inset-y-0 px-3 right-0 flex items-center">
        <button
          type="button"
          className="text-stone-600 dark:text-stone-400"
          onClick={props.dismiss}
        >
          <DismissFilled fontSize={18} />
        </button>
      </div>
    </label>
  )
})
SearchBox.displayName = 'SearchBox'
export default SearchBox
