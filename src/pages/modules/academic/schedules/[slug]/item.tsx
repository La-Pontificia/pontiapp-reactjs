import { Program } from '@/types/academic/program'
import { useNavigate } from 'react-router'
import { TableCell, TableCellLayout, TableRow } from '@/components/table'
import { useSlugSchedules } from './+layout'
import { FolderOpenRegular } from '@fluentui/react-icons'

export default function Item({ item }: { item: Program }) {
  const { period } = useSlugSchedules()
  const navigate = useNavigate()

  return (
    <>
      <TableRow>
        <TableCell>
          <TableCellLayout
            onClick={() =>
              navigate(`/m/academic/schedules/${period.id}/${item.id}`)
            }
            className="hover:underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-400"
            media={<FolderOpenRegular fontSize={25} />}
          >
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <div>
            <p className="block">{item.businessUnit?.acronym}</p>
            <p className="text-xs opacity-80">{item.businessUnit?.name}</p>
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}
