import { Outlet } from 'react-router'
import { AssistsSidebar } from './sidebar'
import { Helmet } from 'react-helmet'

export default function AssistsLayout() {
  return (
    <div className="flex overflow-auto w-full flex-grow h-full">
      <Helmet>
        <title>Asistencias | Ponti App</title>
      </Helmet>
      <AssistsSidebar />
      <Outlet />
    </div>
  )
}
