// import { Outlet } from 'react-router'
// import EdasSidebar from './sidebar'

import { Spinner } from '@fluentui/react-components'
import { Helmet } from 'react-helmet'

export default function EdasLayout() {
  return (
    <div className="overflow-y-auto flex-grow grid place-content-center pr-2">
      <Helmet>
        <title>Edas | Ponti App</title>
      </Helmet>
      <div className="space-y-3">
        <div>
          <Spinner appearance="inverted" size="huge" />
        </div>
        <h1 className="text-xs">
          Modulo de edas en actualización, por favor regresa mas tarde.
        </h1>
      </div>
    </div>
  )
}
