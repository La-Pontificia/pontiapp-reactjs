import { Route, Routes } from 'react-router'
import ProtectedModule from '@/protected/module'
import Protected from '@/protected/auth'

import UsersSlugHistoryPage from '@/pages/modules/users/slug/history/+page'
import UsersTeamsPage from '@/pages/modules/users/teams/+page'
import UsersTeamSlugPage from '@/pages/modules/users/teams/[slug]/+page'
import UsersReportFilesPage from '@/pages/modules/users/report-files/+page'
import UsersAreasPage from '@/pages/modules/users/areas/+page'
import UsersDepartmentsPage from '@/pages/modules/users/departments/+page'
import UsersJobsPage from '@/pages/modules/users/jobs/+page'
import UsersRolesPage from '@/pages/modules/users/roles/+page'
import UsersContractTypesPage from '@/pages/modules/users/contract-types/+page'
import UsersUserRolesPage from '@/pages/modules/users/user-roles/+page'
import AllUsersPage from '@/pages/modules/users/+page'
import UsersLayout from '@/pages/modules/users/+layout'
import UsersSlugLayout from './slug/+layout'
import UsersSlugPage from './slug/+page'
import UsersSlugOrganizationPage from './slug/organization/+page'
import UsersSlugPropertiesPage from './slug/properties/+page'
import UsersSlugSchedulesPage from './slug/schedules/+page'
import UsersSlugAssistsPage from './slug/assists/+page'
import UserdSlugEditPage from './slug/edit/+page'

export default function UsersRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="users">
            <UsersLayout />
          </ProtectedModule>
        }
      >
        <Route index element={<Protected has="users:show" navigate="/">
          <AllUsersPage />
        </Protected>} />
        <Route path="teams">
          <Route
            index
            element={
              <Protected has="users:teams" navigate="/">
                <UsersTeamsPage />
              </Protected>
            }
          />
          <Route
            path=":slug"
            element={
              <Protected has="users:teams" navigate="/">
                <UsersTeamSlugPage />
              </Protected>
            }
          />
        </Route>

        <Route
          path="report-files"
          element={
            <Protected has="users:reportFiles" navigate="/m/users/all">
              <UsersReportFilesPage />
            </Protected>
          }
        />
        <Route
          path="areas"
          element={
            <Protected has="users:areas" navigate="/m/users/all">
              <UsersAreasPage />
            </Protected>
          }
        />
        <Route
          path="departments"
          element={
            <Protected has="users:departments" navigate="/m/users/all">
              <UsersDepartmentsPage />
            </Protected>
          }
        />
        <Route
          path="jobs"
          element={
            <Protected has="users:jobs" navigate="/m/users/all">
              <UsersJobsPage />
            </Protected>
          }
        />
        <Route
          path="roles"
          element={
            <Protected has="users:roles" navigate="/m/users/all">
              <UsersRolesPage />
            </Protected>
          }
        />
        <Route
          path="user-roles"
          element={
            <Protected has="users:userRoles" navigate="/m/users/all">
              <UsersUserRolesPage />
            </Protected>
          }
        />
        <Route
          path="contract-types"
          element={
            <Protected has="users:contractTypes" navigate="/">
              <UsersContractTypesPage />
            </Protected>
          }
        />
        <Route path=":slug" element={<UsersSlugLayout />}>
          <Route index element={<UsersSlugPage />} />
          <Route path="organization" element={<UsersSlugOrganizationPage />} />
          <Route path="properties" element={<UsersSlugPropertiesPage />} />
          <Route path="schedules" element={<UsersSlugSchedulesPage />} />
          <Route path="assists" element={<UsersSlugAssistsPage />} />
          <Route path="history" element={<UsersSlugHistoryPage />} />
          <Route
            path="edit"
            element={
              <Protected has="users:edit" navigate="/m/users/all">
                <UserdSlugEditPage />
              </Protected>
            }
          />
        </Route>
        {/* <Route path="*" element={<UsersPage />} /> */}
      </Route>
    </Routes>
  )
}
