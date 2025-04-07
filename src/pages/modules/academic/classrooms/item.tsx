import { Button } from '@fluentui/react-components'
import {
  TableCell,
  TableCellLayout,
  TableRow,
  TableSelectionCell
} from '~/components/table'
import { BuildingRegular, FolderOpenRegular } from '@fluentui/react-icons'
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
            onClick={() =>
              navigate(`/m/academic/classrooms/${item.id}/pavilions`)
            }
            icon={<BuildingRegular />}
            size="small"
          >
            Pabellones
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
