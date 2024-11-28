import { Route, Routes } from 'react-router'
import RootLayout from '@/pages/+layout'
import HomePage from '@/pages/+page'
import LandingLayout from '@/layouts/landing'
import LoginPage from '@/pages/login/+page'
import AuthMiddleware from '@/middlewares/auth'
import ModuleLayout from '@/pages/modules/+layout'
import ModulePage from '@/pages/modules/+page'
import CollaboratorsLayout from '@/pages/modules/collaborators/+layout'
import CollaboratorsPage from '@/pages/modules/collaborators/+page'
import EdasLayout from '@/pages/modules/edas/+layout'
import EdasPage from '@/pages/modules/edas/+page'
import AssistsPage from '@/pages/modules/assists/+page'
import AssistsLayout from '@/pages/modules/assists/+layout'
import EventsLayout from '@/pages/modules/events/+layout'
import EventsPage from '@/pages/modules/events/+page'
import TicketsLayout from '@/pages/modules/tickets/+layout'
import TicketsPage from '@/pages/modules/tickets/+page'
import AllCollaboratorsPage from '@/pages/modules/collaborators/all/+page'

export default function MainRoutes() {
  return (
    <Routes>
      <Route
        element={
          <AuthMiddleware>
            <RootLayout />
          </AuthMiddleware>
        }
      >
        <Route index element={<HomePage />} />

        {/* Modules Routes */}
        <Route path="modules" element={<ModuleLayout />}>
          <Route index element={<ModulePage />} />
          <Route path="collaborators" element={<CollaboratorsLayout />}>
            <Route index element={<CollaboratorsPage />} />
            <Route path="all" element={<AllCollaboratorsPage />} />
            <Route path="*" element={<CollaboratorsPage />} />
          </Route>
          <Route path="edas" element={<EdasLayout />}>
            <Route index element={<EdasPage />} />
          </Route>
          <Route path="assists" element={<AssistsLayout />}>
            <Route index element={<AssistsPage />} />
          </Route>
          <Route path="events" element={<EventsLayout />}>
            <Route index element={<EventsPage />} />
          </Route>
          <Route path="tickets" element={<TicketsLayout />}>
            <Route index element={<TicketsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<LandingLayout />} path="/login">
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
