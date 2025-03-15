import React from 'react'
import { DismissFilled, SearchFilled } from '@fluentui/react-icons'
import { cn } from '~/utils'

export const SearchBox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    dismiss?: () => void
  }
>(({ className, dismiss, ...props }, ref) => {
  const [hover, setHover] = React.useState(false)
  return (
    <label className="flex relative group items-center gap-2">
      <input
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        ref={ref}
        readOnly={!hover}
        {...props}
        className={cn(
          'w-full bg-stone-500/20 peer text-[13px] font-medium outline-none rounded-lg px-3 placeholder:text-stone-500 placeholder:font-medium py-2 pl-8',
          className
        )}
      />
      <div className="absolute inset-y-0 peer-focus:opacity-100 peer-focus:dark:text-blue-500 opacity-50 flex items-center px-2">
        <SearchFilled fontSize={20} />
      </div>
      <div className="absolute group-hover:opacity-100 opacity-0 inset-y-0 px-3 right-0 flex items-center">
        <button
          type="button"
          className="text-stone-600 dark:text-stone-400"
          onClick={dismiss}
        >
          <DismissFilled fontSize={18} />
        </button>
      </div>
    </label>
  )
})
SearchBox.displayName = 'SearchBox'
export default SearchBox
