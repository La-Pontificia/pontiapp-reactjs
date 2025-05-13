import { FolderOpenRegular } from '@fluentui/react-icons'

import { Program } from '@/types/academic/program'
import { useNavigate } from 'react-router'
import { useSlugSection } from './+layout'
import {
  TableSelectionCell,
  TableCell,
  TableCellLayout,
  TableRow
} from '@/components/table'

export default function Item({ item }: { item: Program }) {
  const { period } = useSlugSection()
  const navigate = useNavigate()

  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout
            onClick={() =>
              navigate(`/m/academic/sections/${period.id}/${item.id}/sections`)
            }
            className="hover:underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-400"
            media={<FolderOpenRegular fontSize={25} />}
          >
            {item.name}
          </TableCellLayout>
        </TableCell>
      </TableRow>
    </>
  )
}
