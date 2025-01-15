import { Outlet } from 'react-router'
import { EdasSidebar } from './sidebar'
import { Helmet } from 'react-helmet'

export default function EdasLayout() {
  return (
    <div className="flex overflow-auto w-full flex-grow h-full">
      <Helmet>
        <title>Edas | Ponti App</title>
      </Helmet>
      <EdasSidebar />
      <Outlet />
    </div>
  )
}
