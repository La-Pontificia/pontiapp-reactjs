import { Outlet } from 'react-router'
import AcademicSidebar from './sidebar'

export default function AcademicLayout() {
  return (
    <div className="flex grow overflow-auto">
      <AcademicSidebar />
      <Outlet />
    </div>
  )
}
