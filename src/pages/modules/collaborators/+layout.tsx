import { Outlet } from 'react-router'
import CollaboratorsSidebar from './sidebar'
import CollaboratorsNav from './nav'

export default function CollaboratorsLayout() {
  return (
    <div className="flex flex-grow max-lg:flex-col gap-2 h-full overflow-y-auto">
      <CollaboratorsSidebar />
      <CollaboratorsNav />
      <div className="h-full flex flex-col pr-4 max-lg:px-3 w-full overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
