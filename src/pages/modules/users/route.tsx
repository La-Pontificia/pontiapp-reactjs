import { Navigate, Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import Protected from '~/protected/auth'

import UsersEditSchedulesPage from '~/pages/modules/users/edit/schedules/+page'
import UsersSlugHistoryPage from '~/pages/modules/users/slug/history/+page'
import UsersEditLayout from '~/pages/modules/users/edit/+layout'
import UsersEditPage from '~/pages/modules/users/edit/+page'
import UsersTeamsPage from '~/pages/modules/users/teams/+page'
import UsersTeamSlugPage from '~/pages/modules/users/teams/[slug]/+page'
import UsersReportFilesPage from '~/pages/modules/users/report-files/+page'
import UsersAreasPage from '~/pages/modules/users/areas/+page'
import UsersDepartmentsPage from '~/pages/modules/users/departments/+page'
import UsersJobsPage from '~/pages/modules/users/jobs/+page'
import UsersRolesPage from '~/pages/modules/users/roles/+page'
import UsersContractTypesPage from '~/pages/modules/users/contract-types/+page'
import UsersUserRolesPage from '~/pages/modules/users/user-roles/+page'
import UsersEditOrganizationPage from '~/pages/modules/users/edit/organization/+page'
import UsersEditPropertiesPage from '~/pages/modules/users/edit/properties/+page'
import DisabledUsersPage from '~/pages/modules/users/disabled/+page'
import AllUsersPage from '~/pages/modules/users/all/+page'
import CreateUserPage from '~/pages/modules/users/create/+page'
import UsersLayout from '~/pages/modules/users/+layout'
import UsersSlugLayout from './slug/+layout'
import UsersSlugPage from './slug/+page'
import UsersSlugOrganizationPage from './slug/organization/+page'
import UsersSlugPropertiesPage from './slug/properties/+page'
import UsersSlugSchedulesPage from './slug/schedules/+page'
import UsersSlugAssistsPage from './slug/assists/+page'

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
        <Route index element={<Navigate to={'/m/users/all'} />} />
        <Route
          path="all"
          element={
            <Protected has="users:show" navigate="/">
              <AllUsersPage />
            </Protected>
          }
        />
        <Route
          path="disabled"
          element={
            <Protected has="users:show" navigate="/m/users/all">
              <DisabledUsersPage />
            </Protected>
          }
        />
        <Route
          path="create"
          element={
            <Protected has="users:create" navigate="/m/users/all">
              <CreateUserPage />
            </Protected>
          }
        />
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
            <Protected has="users:contractTypes" navigate="/m/users/all">
              <UsersContractTypesPage />
            </Protected>
          }
        />
        <Route path="teams">
          <Route
            index
            element={
              <Protected has="users:teams" navigate="/m/users/all">
                <UsersTeamsPage />
              </Protected>
            }
          />
          <Route
            path=":slug"
            element={
              <Protected has="users:teams" navigate="/m/users/all">
                <UsersTeamSlugPage />
              </Protected>
            }
          />
        </Route>
        <Route
          path="edit/:slug"
          element={
            <Protected has="users:edit" navigate="/m/users/all">
              <UsersEditLayout />
            </Protected>
          }
        >
          <Route index element={<UsersEditPage />} />
          <Route path="organization" element={<UsersEditOrganizationPage />} />
          <Route path="properties" element={<UsersEditPropertiesPage />} />

          <Route path="schedules" element={<UsersEditSchedulesPage />} />
        </Route>
        <Route path=":slug" element={<UsersSlugLayout />}>
          <Route index element={<UsersSlugPage />} />
          <Route path="organization" element={<UsersSlugOrganizationPage />} />
          <Route path="properties" element={<UsersSlugPropertiesPage />} />
          <Route path="schedules" element={<UsersSlugSchedulesPage />} />
          <Route path="assists" element={<UsersSlugAssistsPage />} />
          <Route path="history" element={<UsersSlugHistoryPage />} />
        </Route>
        {/* <Route path="*" element={<UsersPage />} /> */}
      </Route>
    </Routes>
  )
}
