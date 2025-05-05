import { ChevronLeftFilled, ChevronRightFilled } from '@fluentui/react-icons'
import ReactPaginate from 'react-paginate'
import { ResponsePaginate } from '@/types/paginate-response'
import { cn } from '@/utils'

export default function Pagination({
  state,
  onChangePage
}: {
  state: Omit<ResponsePaginate<unknown>, 'data'>
  onChangePage?: (page: number) => void
}) {
  const { current_page, per_page, total } =
    state
  return (
    <div className="flex w-full items-center justify-center gap-3">
      <ReactPaginate
        className={cn([
          'flex items-center justify-center',
          'border rounded-md divide-x text-sm text-blue-700 dark:text-blue-500 divide-neutral-500/40 border-neutral-500/40 font-semibold',
          '[&>li>a]:transition-colors [&>li>a]:flex [&>li>a]:justify-center [&>li>a]:items-center [&>li>a]:w-9 [&>li>a]:aspect-square',
          'hover:[&>li>a]:bg-neutral-500/20',
        ])}
        breakLabel="..."
        previousLabel={<ChevronLeftFilled fontSize={20} />}
        nextLabel={<ChevronRightFilled fontSize={20} />}
        onPageChange={({ selected }) => {
          onChangePage?.(selected + 1)
          console.log(selected + 1)
        }}
        forcePage={current_page ? current_page - 1 : 0}
        pageRangeDisplayed={4}
        disabledClassName='opacity-50 pointer-events-none'
        activeClassName='dark:bg-blue-500 bg-blue-700 text-white'
        marginPagesDisplayed={1}
        pageCount={
          Math.ceil(total ? total / per_page : 0) || 1
        }
        renderOnZeroPageCount={null}
      />
    </div>
  )
}
