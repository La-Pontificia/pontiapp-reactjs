import { Button, Persona } from '@fluentui/react-components'
import { FolderGlobeRegular, FolderOpenRegular } from '@fluentui/react-icons'

import { Program } from '~/types/academic/program'
import { useNavigate } from 'react-router'
import { useSlugSection } from '../+layout'
import {
  TableSelectionCell,
  TableCell,
  TableCellLayout,
  TableRow
} from '~/components/table'

export default function Item({ item }: { item: Program }) {
  const { period } = useSlugSection()
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
              navigate(
                `/m/academic/sections/${period.id}/programs/${item.id}/sections`
              )
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
