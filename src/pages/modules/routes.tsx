import { Route, Routes } from 'react-router'
import ModuleLayout from './+layout'
import ModulePage from './+page'
import UsersRoutes from './users/route'
import EdasRoutes from './edas/route'
import AssistsRoutes from './assists/routes'
import EventsRoutes from './events/routes'
import AttentionsRoutes from './attentions/route'
import InventoriesRoutes from './inventories/routes'
import ResourceManagementRoutes from './rm/routes'

export default function ModulesRoutes() {
  return (
    <Routes>
      <Route element={<ModuleLayout />}>
        <Route index element={<ModulePage />} />
        <Route path="users/*" element={<UsersRoutes />} />
        <Route path="edas/*" element={<EdasRoutes />} />
        <Route path="assists/*" element={<AssistsRoutes />} />
        <Route path="events/*" element={<EventsRoutes />} />
        <Route path="attentions/*" element={<AttentionsRoutes />} />
        <Route path="inventories/*" element={<InventoriesRoutes />} />
        <Route path="rm/*" element={<ResourceManagementRoutes />} />
      </Route>
    </Routes>
  )
}
