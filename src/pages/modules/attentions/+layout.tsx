import { Outlet } from 'react-router'
import AttentionsSidenar from './sidebar'

export default function AttentionsLayout() {
  return (
    <div className="flex h-full overflow-auto w-full">
      <AttentionsSidenar />
      <Outlet />
    </div>
  )
}
