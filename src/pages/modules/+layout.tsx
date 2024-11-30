import {
  ArrowMaximize20Regular,
  ArrowMinimize20Regular,
  ChevronRight16Filled
} from '@fluentui/react-icons'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router'

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
  roles: 'Privilegios y roles',
  create: 'Crear'
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
      <header className="pt-2 px-4">
        <nav className="flex items-center font-sans gap-2 hover:[&>a]:underline text-blue-600 dark:text-blue-500">
          <Link to="/">Home</Link>
          <ChevronRight16Filled className="text-neutral-500" />
          {splitedLocation.map((item, index) => {
            const info = breadcrumb[item as keyof typeof breadcrumb]
            const to = `/${splitedLocation.slice(0, index + 1).join('/')}`
            const addArrow = index < splitedLocation.length - 1
            const isEnd = index === splitedLocation.length - 1

            return (
              <React.Fragment key={index}>
                {isEnd ? (
                  <span className="grayscale select-none">{info}</span>
                ) : (
                  <Link className="data-[end]:grayscale" to={to}>
                    {info}
                  </Link>
                )}
                {addArrow && (
                  <ChevronRight16Filled className="text-neutral-500" />
                )}
              </React.Fragment>
            )
          })}
        </nav>
      </header>
      <div
        data-full-screen={fullScreen ? '' : undefined}
        className="h-full dark:dark:bg-[#1b1a19] flex-col data-[full-screen]:fixed data-[full-screen]:inset-0 z-[999] overflow-y-auto flex flex-grow"
      >
        <header className="flex py-5 px-4 items-center">
          <div className="flex-grow">
            <h1 className="text-2xl font-sans font-medium tracking-tight">
              {header.title}
            </h1>
            <p className="text-xs dark:text-stone-400">{header.description}</p>
          </div>
          <button
            className="text-blue-500 flex items-center gap-2 mr-4 dark:text-blue-400"
            onClick={() => setFullScreen((prev) => !prev)}
          >
            {fullScreen ? (
              <ArrowMinimize20Regular />
            ) : (
              <ArrowMaximize20Regular />
            )}
            {fullScreen ? 'Minimizar' : 'Maximizar'}
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
