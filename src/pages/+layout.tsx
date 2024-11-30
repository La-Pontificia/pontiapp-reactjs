import { Outlet } from 'react-router'
import RootHeader from './header'

export default function RootLayout() {
  return (
    <main
      className={`geist h-svh flex flex-col overflow-y-auto bg-[#f1f1f2] dark:bg-[#1b1a19]`}
    >
      <RootHeader />
      <div className="flex-grow h-full flex overflow-y-auto w-full">
        <Outlet />
      </div>
    </main>
  )
}
