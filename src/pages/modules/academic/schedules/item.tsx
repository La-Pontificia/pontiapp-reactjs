import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '@/components/table'
import { FolderOpenRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router'

import { Period } from '@/types/academic/period'

export default function Item({ item, selected, setSelected }: { item: Period, selected: Period[], setSelected: React.Dispatch<React.SetStateAction<Period[]>> }) {
  const navigate = useNavigate()

  const isSelected = selected.some((i) => i.id === item.id)

  return (
    <>
      <TableRow
        data-selected={isSelected}
      >
        <TableSelectionCell
          onClick={() => {
            setSelected((prev) => isSelected ? prev.filter((i) => i.id !== item.id) : [...prev, item])
          }}
          checked={isSelected} />
        <TableCell>
          <TableCellLayout onClick={() =>
            navigate(`/m/academic/schedules/${item.id}`)
          } media={<FolderOpenRegular fontSize={25} />} className='hover:underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-400'>
            {item.name}
          </TableCellLayout>
        </TableCell>
      </TableRow>
    </>
  )
}
