import {
  ArrowMaximizeRegular,
  ArrowMinimizeRegular,
  BuildingPeopleRegular,
  ChevronRight16Filled
} from '@fluentui/react-icons'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import ModuleSidebar from './sidebar'

const breadcrumb = {
  modules: 'Módulos',
  edas: 'EDAs',
  assists: 'Asistencias',
  collaborators: 'Colaboradores',
  events: 'Eventos',
  tickets: 'Tickets',
  all: 'Todos',
  inactives: 'Inactivos',
  teams: 'Grupos',
  import: 'Importar',
  export: 'Exportar',
  roles: 'Cargos',
  'user-roles': 'Roles de usuario',
  jobs: 'Puestos',
  areas: 'Áreas',
  departments: 'Departamentos',
  create: 'Crear',
  'report-files': 'Archivos de reportes',
  organization: 'Organización',
  properties: 'Propiedades',
  schedules: 'Horarios',
  overview: 'Resumen',
  edit: 'Editar',
  'contract-types': 'Tipos de contrato'
} as const

const headers = {
  '': {
    title: 'Colaboradores',
    description: 'Gestión de colaboradores de la Pontificia'
  },
  create: {
    title: 'Crear colaborador',
    description: 'Agrega un nuevo colaborador al sistema'
  },
  all: {
    title: 'Todos los colaboradores',
    description: 'Lista de todos los colaboradores del sistema'
  },
  inactives: {
    title: 'Colaboradores inactivos',
    description: 'Lista de colaboradores inactivos del sistema'
  },
  teams: {
    title: 'Grupos de colaboradores',
    description: 'Lista de grupos de colaboradores del sistema'
  },
  import: {
    title: 'Importar colaboradores',
    description: 'Importa colaboradores al sistema'
  },
  export: {
    title: 'Exportar colaboradores',
    description: 'Exporta colaboradores del sistema'
  },
  roles: {
    title: 'Privilegios y roles',
    description: 'Lista de roles y privilegios del sistema'
  },
  'report-files': {
    title: 'Archivos de reportes',
    description: 'Lista de archivos de reportes del sistema'
  }
} as const

export default function ModuleLayout(): JSX.Element {
  const location = useLocation()
  const [fullScreen, setFullScreen] = React.useState(false)

  const splitedLocation = location.pathname.split('/').slice(1)
  const endLocation = splitedLocation[splitedLocation.length - 1]
  const header = headers[endLocation as keyof typeof headers] || headers['']

  return (
    <div className="flex flex-col h-full overflow-y-auto flex-grow">
      <div className="h-full overflow-y-auto flex flex-grow">
        <ModuleSidebar />
        <div
          data-full-screen={fullScreen ? '' : undefined}
          className="w-full overflow-y-auto dark:bg-[#0f0f0d] flex flex-col data-[full-screen]:rounded-none data-[full-screen]:fixed data-[full-screen]:inset-0 data-[full-screen]:z-[999] overflow-auto"
        >
          <header className="px-5 py-3 pb-3 border-b border-neutral-500/30 items-center flex justify-between">
            <div className="flex-grow flex basis-0">
              <BuildingPeopleRegular fontSize={30} className="opacity-30" />
            </div>
            <div className="px-2 text-center">
              <h2 className="font-semibold text-lg">Usuarios</h2>
              <nav className="flexitems-center text-xs gap-2 hover:[&>a]:underline text-blue-600 dark:text-blue-500">
                <Link to="/">Home</Link>
                <ChevronRight16Filled className="text-neutral-500" />
                {splitedLocation.map((item, index) => {
                  const info = breadcrumb[item as keyof typeof breadcrumb]
                  const to = `/${splitedLocation.slice(0, index + 1).join('/')}`
                  const addArrow = index < splitedLocation.length - 1
                  const isEnd = index === splitedLocation.length - 1

                  if (item === 'modules') return null

                  return (
                    <React.Fragment key={index}>
                      {isEnd ? (
                        <span className="grayscale select-none">
                          {info || item}
                        </span>
                      ) : (
                        <Link className="data-[end]:grayscale" to={to}>
                          {info || item}
                        </Link>
                      )}
                      {addArrow && (
                        <ChevronRight16Filled className="text-neutral-500" />
                      )}
                    </React.Fragment>
                  )
                })}
              </nav>
            </div>
            <div className="flex-grow flex basis-0 justify-end">
              <button
                className="text-blue-500 flex items-center gap-2 mr-4 dark:text-blue-400"
                onClick={() => setFullScreen((prev) => !prev)}
              >
                {fullScreen ? (
                  <ArrowMinimizeRegular fontSize={19} />
                ) : (
                  <ArrowMaximizeRegular fontSize={19} />
                )}
                {fullScreen ? 'Minimizar' : 'Maximizar'}
              </button>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
