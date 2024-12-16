import { Outlet } from 'react-router'
import { useUi } from '~/store/ui'
import RootSidebar from './_components/sidebar'
import RootHeader from './_components/header'
import UserNotices from './_components/outsides/notices'

export default function RootLayout() {
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  return (
    <main className="h-svh flex overflow-y-auto dark:bg-[#1c1d23]">
      <RootSidebar />
      <UserNotices />
      <div className="w-full h-full overflow-auto flex-grow flex p-1 pl-0">
        <div
          aria-hidden
          className="absolute opacity-80 pointer-events-none select-none inset-0 bg-[radial-gradient(circle_at_76%_26%,#17262f_0,#18171c_57%,#141414_100%)]"
        />
        <div
          data-maximized={isModuleMaximized ? '' : undefined}
          className="flex-grow relative border border-stone-500/10 overflow-auto data-[maximized]:absolute transition-all data-[maximized]:z-[999] data-[maximized]:inset-0 shadow-sm dark:shadow-blue-950/50 data-[maximized]:border-0 data-[maximized]:rounded-none rounded-xl flex-col h-full flex overflow-y-auto w-full bg-[#f1f1f2] dark:bg-[#11110f] data-[maximized]:dark:bg-[#11110f]"
        >
          <RootHeader />
          <Outlet />
        </div>
      </div>
    </main>
  )
}
