import { Outlet } from 'react-router'
import { useUi } from '@/store/ui'
import RootSidebar from './_components/sidebar'
import RootHeader from './_components/header'
import UserNotices from './_components/outsides/notices'
import BirthdayBoys from '@/components/birthdays'
import React from 'react'
import { UIContext } from '@/providers/ui'
import { useMediaQuery } from '@uidotdev/usehooks'
import BusinessUnitVerify from './_components/outsides/business-unit'

export default function RootLayout() {
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)
  const setModuleMaximized = useUi((s) => s.setModuleMaximized)

  const ctxui = React.useContext(UIContext)

  const isMediumDevice = useMediaQuery(
    'only screen and (min-width : 0px) and (max-width : 1023px)'
  )

  React.useEffect(() => {
    setModuleMaximized(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMediumDevice])

  return (
    <main className="h-svh flex overflow-y-auto bg-[#f7f9fb] dark:bg-[#20232b]">
      <RootSidebar />
      <UserNotices />
      <BirthdayBoys />
      <BusinessUnitVerify />
      <div
        data-maximized={isModuleMaximized ? '' : undefined}
        // lg:p-1 pl-0
        className="flex-grow h-full relative max-lg:pb-[65px] data-[maximized]:static flex"
      >
        <div
          ref={ctxui?.contentRef}
          data-maximized={isModuleMaximized ? '' : undefined}
          // lg:shadow-[0_0_6px_rgba(0,0,0,.1)] lg:dark:shadow-[0_0_6px_rgba(0,0,0,.5)]
          // max-lg:rounded-none rounded-xl
          className="flex-grow relative max-lg:relative max-w-[calc(100vw-70px)] max-lg:max-w-[100%] data-[maximized]:max-w-full border dark:border-none overflow-auto data-[maximized]:absolute data-[maximized]:z-[999] data-[maximized]:inset-0  data-[maximized]:rounded-none flex-col h-full flex overflow-y-auto w-full bg-[#f5f4f3] dark:bg-[#141414] text-black dark:text-neutral-100"
        >
          <RootHeader />
          <Outlet />
        </div>
      </div>
    </main>
  )
}
