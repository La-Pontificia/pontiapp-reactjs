import { Outlet } from 'react-router'
import OthersSidebar from './sidebar'
import { Helmet } from 'react-helmet'

export default function ResourceManagementLayout() {
  return (
    <div className="flex overflow-auto w-full flex-grow h-full">
      <Helmet>
        <title>Gestión de recursos | Ponti App</title>
      </Helmet>
      <OthersSidebar />
      <div className="w-full overflow-auto px-3 flex flex-grow h-full">
        <Outlet />
      </div>
    </div>
  )
}
