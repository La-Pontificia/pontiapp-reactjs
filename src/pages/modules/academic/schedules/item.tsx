import { Button } from '@fluentui/react-components'
import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '~/components/table'
import { FolderOpenRegular, HatGraduationRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router'

import { Period } from '~/types/academic/period'

export default function Item({ item }: { item: Period }) {
  const navigate = useNavigate()
  return (
    <>
      <TableRow>
        <TableSelectionCell type="radio" />
        <TableCell>
          <TableCellLayout media={<FolderOpenRegular fontSize={25} />}>
            {item.name}
          </TableCellLayout>
        </TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() =>
              navigate(`/m/academic/schedules/${item.id}/programs`)
            }
            icon={<HatGraduationRegular />}
          >
            Programas académicos
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
