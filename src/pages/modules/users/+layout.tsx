import { Outlet } from 'react-router'
import UsersSidebar from './sidebar'
import { Helmet } from 'react-helmet'

export default function UsersLayout() {
  return (
    <div className="flex flex-grow h-full overflow-y-auto">
      <Helmet>
        <title>Usuarios - Ponti App</title>
      </Helmet>
      <UsersSidebar />
      <div className="h-full flex flex-col max-lg:px-0 w-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
