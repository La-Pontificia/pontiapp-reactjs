import { useUi } from '~/store/ui'

import { Tooltip } from '@fluentui/react-components'
import {
  CaretDownFilled,
  NavigationFilled,
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
  const locaction = useLocation()

  const isHome = !locaction.pathname.startsWith(`/m`)

  return (
    <div className="flex items-center">
      {!isHome && (
        <Tooltip
          content={
            isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'
          }
          relationship="label"
        >
          <button onClick={toggleSidebar} className="px-2">
            <NavigationFilled fontSize={25} />
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
      className="h-[50px] min-h-[50px] lg:dark:bg-[#1c1a17] lg:bg-[#f5f0f0] relative dark:shadow-sm border-b dark:border-stone-700 dark:shadow-black/10 justify-between gap-4 w-full z-10 flex items-center px-2"
    >
      <nav className="flex relative flex-grow items-center basis-0">
        <Toggles />
        <nav className="px-1">
          <Link
            to={`/${authUser.username}`}
            className="flex justify-center drop-shadow-[0_0_10px_rgba(0,0,0,.1)] dark:drop-shadow-[0_0_10px_rgba(0,0,0,.5)] items-center gap-1"
          >
            <Lp
              size={25}
              className="dark:text-sky-500 lg:block hidden text-sky-700"
            />
          </Link>
        </nav>
        <h1 className="font-semibold text-base">PontiApp</h1>
      </nav>
      <nav className="max-lg:w-full">
        <RootSearch />
      </nav>
      <nav className="flex flex-grow dark:text-[#eaa8ff] text-[#0e37cd] basis-0 gap-5 justify-end">
        <Tooltip content="Buscar" relationship="label">
          <button className="block lg:hidden">
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
