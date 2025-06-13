import { useUi } from '@/store/ui'

import { Tooltip } from '@fluentui/react-components'
import {
  CaretDownFilled,
  PanelLeftFilled,
  PanelLeftRegular,
  // NotebookQuestionMarkRegular,
  SearchRegular
} from '@fluentui/react-icons'
import { useLocation } from 'react-router'
import UserMenu from './menu'
import UserFeedback from './feedback'
// import { useAuth } from '@/store/auth'
import RootSearch from './search'
// import { Lp } from '@/icons'
import BusinessUnitToggle from './business-unit'

const Toggles = () => {
  const toggleSidebar = useUi((s) => s.toggleSidebar)
  const isSidebarOpen = useUi((s) => s.isSidebarOpen)
  const locaction = useLocation()

  const isHome = !locaction.pathname.startsWith(`/m`)

  return (
    <>
      {!isHome && (
        <div className="flex pl-2 items-center">
          <Tooltip
            content={
              isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'
            }
            relationship="label"
          >
            <button onClick={toggleSidebar} className="p-0.5">
              {isSidebarOpen ? (
                <PanelLeftFilled fontSize={25} />
              ) : (
                <PanelLeftRegular fontSize={25} />
              )}
            </button>
          </Tooltip>
        </div>
      )}
    </>
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
      className="h-[50px] min-h-[50px] relative dark:shadow-sm dark:shadow-black/10 justify-between gap-4 w-full z-10 flex items-center"
    >
      <nav className="flex relative flex-grow items-center basis-0">
        <Toggles />
        <BusinessUnitToggle />
      </nav>
      <nav className="max-lg:w-full">
        <RootSearch />
      </nav>
      <nav className="flex px-2 flex-grow items-center dark:text-[#eaa8ff] text-[#0e37cd] basis-0 gap-5 justify-end">
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
