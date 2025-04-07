import { Button, Persona } from '@fluentui/react-components'
import { FolderGlobeRegular, FolderOpenRegular } from '@fluentui/react-icons'

import { Program } from '~/types/academic/program'
import { useNavigate } from 'react-router'
import {
  TableSelectionCell,
  TableCell,
  TableCellLayout,
  TableRow
} from '~/components/table'
import { useSlugSchedules } from '../+layout'

export default function Item({ item }: { item: Program }) {
  const { period } = useSlugSchedules()
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
        <TableCell>
          <Button
            onClick={() =>
              navigate(`/m/academic/schedules/${period.id}/programs/${item.id}`)
            }
            icon={<FolderGlobeRegular />}
            size="small"
          >
            Secciones
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
