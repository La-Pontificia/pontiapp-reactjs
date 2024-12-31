import { Outlet } from 'react-router'
import { useUi } from '~/store/ui'
import RootSidebar from './_components/sidebar'
import RootHeader from './_components/header'
import UserNotices from './_components/outsides/notices'

export default function RootLayout() {
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  return (
    <main className="h-svh flex overflow-y-auto bg-gradient-to-t from-[#f7f9fb] via-[#f7f9fb] to-[#f7f9fb] dark:from-[rgb(28,31,29)] dark:via-[rgb(30,28,33)] dark:to-[rgb(34,32,30)]">
      <RootSidebar />
      <UserNotices />
      <div
        data-maximized={isModuleMaximized ? '' : undefined}
        className="flex-grow h-full overflow-x-auto relative data-[maximized]:static flex p-1 pl-0"
      >
        {!isModuleMaximized && (
          <span
            aria-hidden
            className="block inset-x-0 border dark:border-stone-800 inset-y-[4px] shadow-md shadow-black/10 pointer-events-none select-none rounded-xl z-10 absolute"
          />
        )}
        <div
          data-maximized={isModuleMaximized ? '' : undefined}
          className="flex-grow relative overflow-auto data-[maximized]:absolute  data-[maximized]:z-[999] data-[maximized]:inset-0 rounded-xl data-[maximized]:rounded-none flex-col h-full flex overflow-y-auto w-full bg-gradient-to-t from-[#ffffff] via-[#ffffff] to-[#ffffff] text-black dark:text-stone-100 dark:from-[#11110f] dark:via-[#11110f] dark:to-[#11110f]"
        >
          <RootHeader />
          <Outlet />
        </div>
      </div>
    </main>
  )
}
