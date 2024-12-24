import { Outlet } from 'react-router'
import { useUi } from '~/store/ui'
import RootSidebar from './_components/sidebar'
import RootHeader from './_components/header'
import UserNotices from './_components/outsides/notices'

export default function RootLayout() {
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  return (
    <main className="h-svh flex overflow-y-auto bg-gradient-to-t dark:from-[rgb(28,31,29)] dark:via-[rgb(30,28,33)] dark:to-[rgb(34,32,30)]">
      <RootSidebar />
      <UserNotices />
      <div className="w-full h-full overflow-auto flex-grow flex p-1.5 pl-0">
        <div
          data-maximized={isModuleMaximized ? '' : undefined}
          className="flex-grow relative overflow-auto data-[maximized]:absolute transition-all data-[maximized]:z-[999] data-[maximized]:inset-0 rounded-xl flex-col h-full flex overflow-y-auto w-full bg-[#f1f1f2] dark:bg-[#11110f] data-[maximized]:dark:bg-[#11110f]"
        >
          <RootHeader />
          <Outlet />
        </div>
      </div>
    </main>
  )
}
