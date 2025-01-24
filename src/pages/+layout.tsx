import { Outlet } from 'react-router'
import { useUi } from '~/store/ui'
import RootSidebar from './_components/sidebar'
import RootHeader from './_components/header'
import UserNotices from './_components/outsides/notices'
import BirthdayBoys from '~/components/birthdays'
import React from 'react'

export default function RootLayout() {
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <main className="h-svh flex overflow-y-auto bg-[#f7f9fb] dark:bg-[#20232b]">
      <RootSidebar contentRef={contentRef} />
      <UserNotices />
      <BirthdayBoys />
      <div
        data-maximized={isModuleMaximized ? '' : undefined}
        className="flex-grow h-full relative data-[maximized]:static flex p-1 pl-0"
      >
        <div
          ref={contentRef}
          data-maximized={isModuleMaximized ? '' : undefined}
          className="flex-grow relative max-w-[calc(100vw-74px)] data-[maximized]:max-w-full border dark:border-none shadow-[0_0_6px_rgba(0,0,0,.1)] dark:shadow-[0_0_6px_rgba(0,0,0,.5)] overflow-auto data-[maximized]:absolute data-[maximized]:z-[999] data-[maximized]:inset-0 rounded-xl data-[maximized]:rounded-none flex-col h-full flex overflow-y-auto w-full bg-[#f5f4f3] dark:bg-[#1f1e1d] text-black dark:text-neutral-100"
        >
          <RootHeader />
          <Outlet />
        </div>
      </div>
    </main>
  )
}
