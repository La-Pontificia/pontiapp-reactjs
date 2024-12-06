import { Outlet } from 'react-router'

export default function RootSlugLayout() {
  return (
    <div className="h-full flex-grow flex flex-col w-full overflow-auto">
      <Outlet />
    </div>
  )
}
