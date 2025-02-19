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
    <div className="flex py-2 max-lg:px-2 w-full items-center justify-start gap-3">
      <footer className="flex items-center max-lg:w-full [&>button]:rounded-lg [&>button]:transition-all [&>button]:justify-center [&>button]:lg:flex [&>button]:gap-2 [&>button]:items-center [&>button]:first:px-2 [&>button]:last:px-3 overflow-hidden disabled:[&>button]:pointer-events-none disabled:[&>button]:opacity-50 dark:text-stone-300 text-stone-700">
        <button
          className="max-lg:mr-auto flex"
          onClick={() => {
            onChangePage?.(current_page - 1)
          }}
          disabled={!prev_page_url}
        >
          <p>Anterior</p>
        </button>
        <p className="font-semibold flex lg:hidden">{current_page}</p>
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
              className="data-[active]:dark:text-blue-400 data-[active]:text-blue-600 max-lg:hidden font-medium"
            >
              {link.label}
            </button>
          )
        })}
        <button
          className="max-lg:ml-auto flex"
          onClick={() => {
            onChangePage?.(current_page + 1)
          }}
          disabled={!next_page_url}
        >
          <p>Siguiente</p>
        </button>
      </footer>
      <p className="max-lg:hidden">
        <span>{from}</span>
        {'-'}
        <span>{to}</span>
        {' de '}
        <span>{total}</span>
      </p>
    </div>
  )
}
