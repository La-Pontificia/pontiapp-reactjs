import { Persona } from '@fluentui/react-components'

import { Program } from '@/types/academic/program'
import { useNavigate } from 'react-router'
import {
  TableSelectionCell,
  TableCell,
  TableCellLayout,
  TableRow
} from '@/components/table'
import { useSlugSchedules } from './+layout'
import { FolderOpenRegular } from '@fluentui/react-icons'

export default function Item({
  item,
  selected,
  setSelected
}: {
  item: Program,
  selected: Program[],
  setSelected: React.Dispatch<React.SetStateAction<Program[]>>
}) {
  const { period } = useSlugSchedules()
  const navigate = useNavigate()

  const isSelected = selected.some((i) => i.id === item.id)

  return (
    <>
      <TableRow aria-selected={isSelected}>
        <TableSelectionCell
          onClick={() => {
            setSelected((prev) => isSelected ? prev.filter((i) => i.id !== item.id) : [...prev, item])
          }}
          checked={isSelected}
          type="radio" />
        <TableCell>
          <TableCellLayout
            onClick={() =>
              navigate(`/m/academic/schedules/${period.id}/${item.id}`)
            }
            className='hover:underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-400'
            media={<FolderOpenRegular fontSize={25} />}>
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <Persona
            className="!pt-1"
            avatar={{
              size: 28,
              className: '!rounded-md',
              image: {
                src: item.businessUnit?.logoURL
              }
            }}
            name={item.businessUnit?.acronym}
            secondaryText={item.businessUnit?.name}
          />
        </TableCell>
      </TableRow>
    </>
  )
}
