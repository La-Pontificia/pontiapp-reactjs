import { Outlet } from 'react-router'
import CollaboratorsSidebar from './sidebar'

export default function CollaboratorsLayout() {
  return (
    <div className="flex flex-grow h-full overflow-y-auto">
      <CollaboratorsSidebar />
      <div className="flex-grow overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
