import { Outlet } from 'react-router'
import RootHeader from './header'

export default function RootLayout() {
  return (
    <main className="h-svh flex flex-col overflow-y-auto bg-[#f1f1f2] dark:bg-[#111110]">
      <RootHeader />
      <div className="flex-grow h-full flex overflow-y-auto w-full">
        <Outlet />
      </div>
    </main>
  )
}
