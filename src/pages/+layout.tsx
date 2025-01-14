import { Outlet } from 'react-router'
import { useUi } from '~/store/ui'
import RootSidebar from './_components/sidebar'
import RootHeader from './_components/header'
import UserNotices from './_components/outsides/notices'

export default function RootLayout() {
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  return (
    <main className="h-svh flex overflow-y-auto bg-[#f7f9fb] dark:bg-[#20232b]">
      <RootSidebar />
      <UserNotices />
      <div
        data-maximized={isModuleMaximized ? '' : undefined}
        className="flex-grow h-full relative data-[maximized]:static flex p-1 pl-0"
      >
        <div
          data-maximized={isModuleMaximized ? '' : undefined}
          className="flex-grow relative border dark:border-transparent shadow-[0_0_6px_rgba(0,0,0,.1)] dark:shadow-[0_0_6px_rgba(0,0,0,.5)] overflow-auto data-[maximized]:absolute data-[maximized]:z-[999] data-[maximized]:inset-0 rounded-xl data-[maximized]:rounded-none flex-col h-full flex overflow-y-auto w-full bg-[#ffffff] text-black dark:text-neutral-100 dark:bg-[#1f1f1f]"
        >
          <RootHeader />
          <Outlet />
        </div>
      </div>
    </main>
  )
}
