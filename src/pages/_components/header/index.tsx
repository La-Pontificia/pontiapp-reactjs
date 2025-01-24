import { useUi } from '~/store/ui'

import { Tooltip } from '@fluentui/react-components'
import {
  CaretDownFilled,
  PanelLeftContractRegular,
  PanelLeftExpandFilled,
  SearchRegular
} from '@fluentui/react-icons'
import { Link, useLocation } from 'react-router'
import UserMenu from './menu'
import UserFeedback from './feedback'
import { useAuth } from '~/store/auth'
import RootSearch from './search'
import { Lp } from '~/icons'

const Toggles = () => {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const isSidebarOpen = useUi((s) => s.isSidebarOpen)

  // const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)
  // const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  const locaction = useLocation()
  const { user: authUser } = useAuth()

  const isHome =
    locaction.pathname === '/' ||
    locaction.pathname.startsWith(`/${authUser.username}`)

  // const isModules = locaction.pathname.includes('/m')

  return (
    <div className="flex items-center">
      {!isHome && (
        <Tooltip
          content={
            isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'
          }
          relationship="label"
        >
          <button
            onClick={toggleSidebar}
            className="p-2 px-2.5 dark:text-stone-400 hover:bg-stone-500/20  rounded-lg"
          >
            {isSidebarOpen ? (
              <PanelLeftContractRegular fontSize={26} />
            ) : (
              <PanelLeftExpandFilled
                className="dark:text-[#5e67ed] text-blue-600"
                fontSize={26}
              />
            )}
          </button>
        </Tooltip>
      )}
    </div>
  )
}

export default function RootHeader() {
  const isHeaderOpen = useUi((s) => s.isHeaderOpen)
  const toggleHeader = useUi((s) => s.toggleHeader)
  const { user: authUser } = useAuth()
  return (
    <header
      style={{
        marginTop: isHeaderOpen ? '0' : '-56px'
      }}
      data-hidden={!isHeaderOpen ? '' : undefined}
      className="h-[50px] min-h-[50px] dark:bg-[#1b1a19] bg-[#f5f0f0] relative dark:shadow-sm border-b dark:border-stone-700 dark:shadow-black/10 justify-between gap-4 w-full z-10 flex items-center px-2"
    >
      <nav className="flex relative flex-grow items-center basis-0">
        <Toggles />
        <nav className="px-2">
          <Link
            to={`/${authUser.username}`}
            className="flex justify-center drop-shadow-[0_0_10px_rgba(0,0,0,.1)] dark:drop-shadow-[0_0_10px_rgba(0,0,0,.5)] items-center gap-1"
          >
            <Lp size={25} className="dark:text-sky-500 text-sky-700" />
          </Link>
        </nav>
        <h1 className="font-semibold text-base pl-2 hidden sm:block">
          PontiApp
        </h1>
      </nav>
      <nav className="">
        <RootSearch />
      </nav>
      <nav className="flex flex-grow dark:text-[#646eff] text-blue-700 basis-0 gap-5 justify-end">
        <Tooltip content="Buscar" relationship="label">
          <button className="block md:hidden">
            <SearchRegular fontSize={25} />
          </button>
        </Tooltip>
        <UserFeedback />
        <UserMenu />
      </nav>
      {!isHeaderOpen && (
        <div className="absolute flex justify-center -bottom-10 opacity-30 transition-opacity hover:opacity-100 inset-x-0">
          <button
            onClick={toggleHeader}
            className="w-[150px] flex justify-center p-1 pointer-events-auto dark:text-stone-500"
          >
            <CaretDownFilled fontSize={20} />
          </button>
        </div>
      )}
    </header>
  )
}
