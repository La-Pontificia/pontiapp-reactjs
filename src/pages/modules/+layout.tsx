import { ChevronRight16Filled } from '@fluentui/react-icons'
import { Link, Outlet, useLocation } from 'react-router'

const breadcrumb = {
  modules: 'Módulos',
  edas: 'EDAs',
  assists: 'Asistencias',
  collaborators: 'Colaboradores',
  events: 'Eventos',
  tickets: 'Tickets'
} as const

export default function ModuleLayout(): JSX.Element {
  const location = useLocation()
  const splitedLocation = location.pathname.split('/').slice(1)
  return (
    <div className="flex flex-col h-full overflow-y-auto flex-grow">
      <header className="p-5 py-7">
        <nav className="flex items-center gap-2 hover:[&>a]:underline font-semibold text-blue-600 dark:text-blue-500">
          <Link to="/">Home</Link>
          <ChevronRight16Filled className="text-neutral-500" />
          {splitedLocation.map((item, index) => {
            const info = breadcrumb[item as keyof typeof breadcrumb]
            const to = `/${splitedLocation.slice(0, index + 1).join('/')}`
            const addArrow = index < splitedLocation.length - 1

            return (
              <>
                <Link key={index} to={to}>
                  {info}
                </Link>
                {addArrow && (
                  <ChevronRight16Filled className="text-neutral-500" />
                )}
              </>
            )
          })}
        </nav>
        <div className="flex items-center pt-2">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Colaboradores
            </h1>
            <p className="text-sm">Gestión de colaboradores de la Pontificia</p>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
