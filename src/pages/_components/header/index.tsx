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
import { Link, useLocation } from 'react-router'
import UserMenu from './menu'
import UserFeedback from './feedback'
import { useAuth } from '~/store/auth'
import RootSearch from './search'

const Toggles = () => {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const isSidebarOpen = useUi((s) => s.isSidebarOpen)

  const toggleModuleMaximized = useUi((s) => s.toggleModuleMaximized)
  const isModuleMaximized = useUi((s) => s.isModuleMaximized)

  const locaction = useLocation()

  const isHome = locaction.pathname === '/'
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
            className="p-2 px-2.5 dark:text-stone-400 hover:bg-stone-500/20 transition-all rounded-lg"
          >
            {isSidebarOpen ? (
              <PanelLeftContractRegular fontSize={25} />
            ) : (
              <PanelLeftExpandFilled
                className="dark:text-blue-500"
                fontSize={25}
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
            className="p-2 px-2.5 dark:text-stone-400 hover:bg-stone-500/20 transition-all rounded-lg"
          >
            {isModuleMaximized ? (
              <ArrowMinimizeRegular
                className="dark:text-blue-500"
                fontSize={20}
              />
            ) : (
              <ArrowMaximizeRegular fontSize={20} />
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
  const { user } = useAuth()
  return (
    <header
      style={{
        marginTop: isHeaderOpen ? '0' : '-56px'
      }}
      data-hidden={!isHeaderOpen ? '' : undefined}
      className="h-14 min-h-[56px] relative transition-all dark:text-blue-500 shadow-xl shadow-black/30 justify-between gap-4 text-blue-600 w-full z-20 flex items-center px-2"
    >
      <nav className="flex relative flex-grow gap-2 items-center basis-0">
        <Toggles />
        <Link to={`/${user.username}`} className="flex items-center gap-1">
          <img src="/_lp-only-logo.webp" className="" width={25} alt="" />
          <img
            src="/_lp_only-letters.webp"
            className="dark:invert grayscale"
            width={70}
            alt='Logo Lettras "La Pontificia"'
          />
        </Link>
        <h1 className="font-semibold text-base hidden md:block pl-2">
          Ponti App
        </h1>
      </nav>
      <nav className="">
        <RootSearch />
      </nav>
      <nav className="flex flex-grow basis-0 gap-5 justify-end">
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
