import { Outlet } from 'react-router'
import AssistsEvents from './sidebar'
import { Helmet } from 'react-helmet'

export default function EventsLayout() {
  return (
    <div className="flex overflow-auto w-full flex-grow h-full">
      <Helmet>
        <title>Eventos | Ponti App</title>
      </Helmet>
      <AssistsEvents />
      <div className="w-full overflow-auto px-3 flex flex-grow h-full">
        <Outlet />
      </div>
    </div>
  )
}
