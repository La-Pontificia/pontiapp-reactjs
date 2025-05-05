import { DismissFilled } from '@fluentui/react-icons'
import { cn } from '@/utils'

import { useControllableState } from 'hothooks'
import React from 'react'

export const SearchBox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    dismiss?: () => void
    onSearch?: (value: string | null) => void
  }
>(
  (
    {
      className,
      dismiss,
      defaultValue: defaultProp,
      value: valueProp,
      onChange,
      onSearch,
      ...props
    },
    ref
  ) => {
    const [hover, setHover] = React.useState(false)

    const [value, setValue] = useControllableState<string>({
      defaultProp: defaultProp?.toString(),
      onChange: (v) => onSearch?.(v),
      prop: valueProp?.toString()
    })
    return (
      <label className="flex relative group items-center gap-2">
        <input
          {...props}
          ref={ref}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          readOnly={!hover}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onChange?.(e)
          }}
          className={cn(
            'w-full border bg-transparent border-stone-300 dark:border-stone-700 peer text-[13px] font-medium outline-none rounded-full px-3 placeholder:text-stone-500 placeholder:font-medium py-1.5',
            className
          )}
        />
        <div className="absolute group-hover:opacity-100 opacity-0 inset-y-0 px-3 right-0 flex items-center">
          <button
            type="button"
            className="text-stone-600 dark:text-stone-400"
            onClick={() => {
              setValue('')
              onSearch?.(null)
              dismiss?.()
            }}
          >
            <DismissFilled fontSize={18} />
          </button>
        </div>
      </label>
    )
  }
)
SearchBox.displayName = 'SearchBox'
export default SearchBox
