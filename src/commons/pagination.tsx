import { ChevronLeftFilled, ChevronRightFilled } from '@fluentui/react-icons'
import { ResponsePaginate } from '~/types/paginate-response'

export default function Pagination({
  state,
  onChangePage
}: {
  state: Omit<ResponsePaginate<unknown>, 'data'>
  onChangePage?: (page: number) => void
}) {
  const { current_page, from, links, next_page_url, prev_page_url, to, total } =
    state
  return (
    <div className="flex w-full items-center justify-start gap-3">
      <footer className="flex items-center gap-2 max-lg:w-full overflow-hidden disabled:[&>button]:!pointer-events-none disabled:[&>button]:!opacity-20 dark:text-stone-300 text-stone-700">
        <button
          className="max-lg:mr-auto border dark:border-stone-500/30 rounded-md flex items-center gap-2 justify-center h-[30px] aspect-[16/14]"
          onClick={() => {
            onChangePage?.(current_page - 1)
          }}
          disabled={!prev_page_url}
        >
          <ChevronLeftFilled fontSize={25} />
        </button>
        {links?.slice(1, links.length - 1).map((link, key) => {
          return (
            <button
              disabled={!link.url}
              data-active={link.active ? '' : undefined}
              key={key}
              onClick={() => {
                if (current_page === Number(link.label)) return
                onChangePage?.(Number(link.label))
              }}
              className="w-[30px] aspect-square font-medium text-base data-[active]:dark:text-blue-400 data-[active]:dark:bg-blue-700/30 data-[active]:dark:border-blue-600 data-[active]:text-blue-700 data-[active]:bg-blue-400/10 data-[active]:border-blue-700 border dark:border-stone-500/30 rounded-md flex items-center justify-center"
            >
              {link.label}
            </button>
          )
        })}
        <button
          className="max-lg:ml-auto border dark:border-stone-500/30 rounded-md flex items-center gap-2 justify-center h-[30px] aspect-[16/14]"
          onClick={() => {
            onChangePage?.(current_page + 1)
          }}
          disabled={!next_page_url}
        >
          <ChevronRightFilled fontSize={20} />
        </button>
      </footer>
      {from && to && total && (
        <p className="max-lg:hidden font-medium text-sm">
          <span>{from}</span>
          {'-'}
          <span>{to}</span>
          {' de '}
          <span>{total}</span>
        </p>
      )}
    </div>
  )
}
