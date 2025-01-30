import { Link, useLocation } from 'react-router'

const items = {
  edas: {
    title: 'Edas',
    items: {
      overview: 'Overview',
      collaborators: 'Colaboradores',
      register: 'Registrar',
      objetivos: 'Objetivos',
      evaluations: 'Evaluaciones'
    }
  }
}

export default function DocsSidebar() {
  const { pathname } = useLocation()
  return (
    <aside className="p-3 flex lg:min-w-[200px] flex-col gap-3">
      {Object.entries(items).map(([key, value]) => (
        <div key={key}>
          <h3 className="font-semibold text-base pb-2 dark:text-violet-300 text-violet-800">
            {value.title}
          </h3>
          <div className="flex flex-col gap-2 px-2 text-sm">
            {Object.entries(value.items).map(([k, value]) => {
              const isActive = pathname.startsWith(`/docs/${key}/${k}`)
              return (
                <Link
                  key={key}
                  data-active={isActive ? '' : undefined}
                  to={`/docs/${key}/${k}`}
                  className="dark:text-stone-400 data-[active]:font-medium hover:dark:text-violet-50 transition-all py-0.5 data-[active]:dark:text-violet-400 data-[active]:text-violet-800 text-stone-700"
                >
                  {value}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </aside>
  )
}
