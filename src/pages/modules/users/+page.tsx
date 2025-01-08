import { Badge, Tooltip } from '@fluentui/react-components'
import {
  Add20Regular,
  BuildingPeopleRegular,
  PeopleProhibitedRegular
} from '@fluentui/react-icons'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router'

const CollaboratorsPage = (): JSX.Element => {
  return (
    <div className="h-full w-full">
      <Helmet>
        <title>Ponti App - Usuarios</title>
      </Helmet>
      <header className="border-b py-3 dark:text-neutral-200 border-neutral-500/30 p-1">
        <Tooltip relationship="label" content="Nuevo colaborador">
          <Link
            to="/modules/collaborators/create"
            className="flex text-sm hover:bg-neutral-500/10 rounded-md p-1.5 px-4 w-fit justify-center dark:[&>svg]:text-blue-600 items-center gap-1"
          >
            <Add20Regular />
            Nuevo
          </Link>
        </Tooltip>
      </header>
      <div className="p-5 flex items-center gap-2">
        <p className="text-xs opacity-70">
          Algunas métricas de los colaboradores
        </p>
        {
          // Not show badge if date is greater than 2025
          new Date() < new Date('2025-01-01') && (
            <Badge color="success" appearance="tint">
              Preview
            </Badge>
          )
        }
      </div>
      <div className="p-10 flex [&>div]:px-5 divide-x text-xs divide-neutral-500/30 dark:text-neutral-300">
        <div className="flex items-center gap-3">
          <BuildingPeopleRegular fontSize={30} className="opacity-60" />
          <div>
            <div>Habilitados</div>
            <Link className="dark:text-blue-500 hover:underline" to="">
              247{' '}
            </Link>
            colaboradores
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PeopleProhibitedRegular fontSize={30} className="opacity-60" />
          <div>
            <div>Inhabilitados</div>
            <Link className="dark:text-red-500 hover:underline" to="">
              247{' '}
            </Link>
            colaboradores
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaboratorsPage
