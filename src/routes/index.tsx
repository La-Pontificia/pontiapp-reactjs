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
import CreateCollaboratorPage from '@/pages/modules/collaborators/create/+page'
import CollaboratorsSlugLayout from '@/pages/modules/collaborators/slug/+layout'
import CollaboratorsSlugPage from '@/pages/modules/collaborators/slug/+page'
import CollaboratorsSlugOrganizationPage from '@/pages/modules/collaborators/slug/organization/+page'
import CollaboradotorsSlugPropertiesPage from '@/pages/modules/collaborators/slug/properties/+page'
import CollaboradotorsSlugSchedulesPage from '@/pages/modules/collaborators/slug/schedules/+page'
import RootSlugLayout from '@/pages/slug/+page'
import ColllaboratorsSlugHistoryPage from '@/pages/modules/collaborators/slug/history/+page'
import CollaboratorsEditLayout from '@/pages/modules/collaborators/edit/+layout'
import CollaboratorsEditPage from '@/pages/modules/collaborators/edit/+page'
import CollaboratorsTeamsPage from '@/pages/modules/collaborators/teams/+page'
import CollaboratorsTeamSlugPage from '@/pages/modules/collaborators/teams/[slug]/+page'
import CollaboratorsReportFilesPage from '@/pages/modules/collaborators/report-files/+page'
import CollaboratorsAreasPage from '@/pages/modules/collaborators/areas/+page'
import CollaboratorsDepartmentsPage from '@/pages/modules/collaborators/departments/+page'
import CollaboratorsJobsPage from '@/pages/modules/collaborators/jobs/+page'
import CollaboratorsRolesPage from '@/pages/modules/collaborators/roles/+page'
import CollaboratorsContractTypesPage from '@/pages/modules/collaborators/contract-types/+page'
import CollaboratorsUserRolesPage from '@/pages/modules/collaborators/user-roles/+page'
import CollaboratorsEditOrganizationPage from '@/pages/modules/collaborators/edit/organization/+page'
import CollaboratorsPropertiesEditPage from '@/pages/modules/collaborators/edit/properties/+page'

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
          <Route path="collaborators">
            <Route element={<CollaboratorsLayout />}>
              <Route index element={<CollaboratorsPage />} />
              <Route path="all" element={<AllCollaboratorsPage />} />
              <Route path="create" element={<CreateCollaboratorPage />} />
              <Route path="teams" element={<CollaboratorsTeamsPage />} />
              <Route
                path="report-files"
                element={<CollaboratorsReportFilesPage />}
              />
              <Route path="areas" element={<CollaboratorsAreasPage />} />
              <Route
                path="departments"
                element={<CollaboratorsDepartmentsPage />}
              />
              <Route path="jobs" element={<CollaboratorsJobsPage />} />
              <Route path="roles" element={<CollaboratorsRolesPage />} />
              <Route
                path="user-roles"
                element={<CollaboratorsUserRolesPage />}
              />
              <Route
                path="contract-types"
                element={<CollaboratorsContractTypesPage />}
              />
              <Route
                path="teams/:slug"
                element={<CollaboratorsTeamSlugPage />}
              />

              <Route path="edit/:slug" element={<CollaboratorsEditLayout />}>
                <Route index element={<CollaboratorsEditPage />} />
                <Route
                  path="organization"
                  element={<CollaboratorsEditOrganizationPage />}
                />
                <Route
                  path="properties"
                  element={<CollaboratorsPropertiesEditPage />}
                />
              </Route>

              <Route path=":slug" element={<CollaboratorsSlugLayout />}>
                <Route index element={<CollaboratorsSlugPage />} />
                <Route
                  path="organization"
                  element={<CollaboratorsSlugOrganizationPage />}
                />
                <Route
                  path="properties"
                  element={<CollaboradotorsSlugPropertiesPage />}
                />
                <Route
                  path="schedules"
                  element={<CollaboradotorsSlugSchedulesPage />}
                />
                <Route
                  path="history"
                  element={<ColllaboratorsSlugHistoryPage />}
                />
              </Route>

              <Route path="*" element={<CollaboratorsPage />} />
            </Route>
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

        <Route element={<RootSlugLayout />}>
          <Route path=":slug" element={<CollaboratorsSlugLayout />}>
            <Route index element={<CollaboratorsSlugPage />} />
            <Route
              path="organization"
              element={<CollaboratorsSlugOrganizationPage />}
            />
            <Route
              path="properties"
              element={<CollaboradotorsSlugPropertiesPage />}
            />
            <Route
              path="schedules"
              element={<CollaboradotorsSlugSchedulesPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route element={<LandingLayout />} path="/login">
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
