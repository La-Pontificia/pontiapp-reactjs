import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { FolderOpenRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router'

import { Period } from '@/types/academic/period'

export default function Item({ item }: { item: Period }) {
  const navigate = useNavigate()
  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout onClick={() => navigate(`/m/academic/sections/${item.id}`)} className='hover:underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-400' media={<FolderOpenRegular fontSize={25} />}>
            {item.name}
          </TableCellLayout>
        </TableCell>
      </TableRow>
    </>
  )
}
