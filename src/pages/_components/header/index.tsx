import { useUi } from '~/store/ui'

import { Tooltip } from '@fluentui/react-components'
import {
  ArrowMaximizeRegular,
  ArrowMinimizeRegular,
  CaretDownFilled,
  PanelLeftContractRegular,
  PanelLeftExpandFilled,
  SearchRegular,
  SettingsRegular
} from '@fluentui/react-icons'
import { useLocation } from 'react-router'
import UserMenu from './menu'
import UserFeedback from './feedback'
import { useAuth } from '~/store/auth'
import RootSearch from './search'
import ThemeToggle from './theme-toggle'

const Toggles = () => {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const isSidebarOpen = useUi((s) => s.isSidebarOpen)

  const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  const locaction = useLocation()
  const { user: authUser } = useAuth()

  const isHome =
    locaction.pathname === '/' || locaction.pathname === `/${authUser.username}`

  const isModules = locaction.pathname.includes('/m')

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
              <PanelLeftContractRegular fontSize={20} />
            ) : (
              <PanelLeftExpandFilled
                className="dark:text-blue-500"
                fontSize={20}
              />
            )}
          </button>
        </Tooltip>
      )}
      {isModules && (
        <Tooltip
          content={
            isModuleMaximized ? 'Restaurar tamaño' : 'Maximizar módulo actual'
          }
          relationship="label"
        >
          <button
            onClick={toggleModuleMaximized}
            className="p-2 px-2.5 dark:text-stone-400 hover:bg-stone-500/20  rounded-lg"
          >
            {isModuleMaximized ? (
              <ArrowMinimizeRegular
                className="dark:text-blue-500"
                fontSize={18}
              />
            ) : (
              <ArrowMaximizeRegular fontSize={18} />
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
  return (
    <header
      style={{
        marginTop: isHeaderOpen ? '0' : '-56px'
      }}
      data-hidden={!isHeaderOpen ? '' : undefined}
      className="h-14 min-h-[56px] dark:bg-[#1b1a19] bg-[#f5f0f0] relative dark:shadow-sm border-b dark:border-stone-700 dark:shadow-black/10 justify-between gap-4 w-full z-10 flex items-center px-2"
    >
      <nav className="flex relative flex-grow items-center basis-0">
        <Toggles />
        <h1 className="font-semibold text-base pl-2">Ponti App</h1>
      </nav>
      <nav className="">
        <RootSearch />
      </nav>
      <nav className="flex flex-grow basis-0 gap-5 justify-end">
        <ThemeToggle />
        <Tooltip content="Buscar" relationship="label">
          <button className="block lg:hidden">
            <SearchRegular fontSize={22} />
          </button>
        </Tooltip>
        <Tooltip content="Ajustes" relationship="label">
          <button>
            <SettingsRegular fontSize={23} />
          </button>
        </Tooltip>
        <UserFeedback />
        {/* <UserNotifications /> */}
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
