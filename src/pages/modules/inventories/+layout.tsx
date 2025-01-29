import { Outlet } from 'react-router'
import { Helmet } from 'react-helmet'
import InventoriesSidebar from './sidebar'

export default function InventoriesLayout() {
  return (
    <div className="flex overflow-auto w-full flex-grow h-full">
      <Helmet>
        <title>Inventarios | Ponti App</title>
      </Helmet>
      <InventoriesSidebar />
      <div className="w-full overflow-auto px-3 flex flex-grow h-full">
        <Outlet />
      </div>
    </div>
  )
}
