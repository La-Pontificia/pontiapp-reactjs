import AssistsReportFilesPage from '~/pages/modules/assists/report-files/+page'
import AssistTerminalsPage from '~/pages/modules/assists/terminals/+page'
import AssistsWithoutUsersPage from '~/pages/modules/assists/without-users/+page'
import AssistsSummaryPage from '~/pages/modules/assists/summary/+page'
import AssistsDatabasesPage from '~/pages/modules/assists/databases/+page'
import AssistsMyPage from '~/pages/modules/assists/my/+page'
import AssistsWithUsersPage from '~/pages/modules/assists/with-users/+page'
import AssistsPage from '~/pages/modules/assists/+page'
import AssistsLayout from '~/pages/modules/assists/+layout'

import { Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import Protected from '~/protected/auth'

export default function AssistsRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="assists">
            <AssistsLayout />
          </ProtectedModule>
        }
      >
        <Route
          index
          element={
            <Protected has="assists:schedules" navigate="/">
              <AssistsPage />
            </Protected>
          }
        />
        <Route
          path="my"
          element={
            <Protected has="assists:my" navigate="/m/assists">
              <AssistsMyPage />
            </Protected>
          }
        />
        <Route
          path="report-files"
          element={
            <Protected has="assists:reportFiles" navigate="/m/assists">
              <AssistsReportFilesPage />
            </Protected>
          }
        />

        <Route
          path="without-users"
          element={
            <Protected has="assists:withoutUsers" navigate="/m/assists">
              <AssistsWithoutUsersPage />
            </Protected>
          }
        />
        <Route
          path="with-users"
          element={
            <Protected has="assists:withUsers" navigate="/m/assists">
              <AssistsWithUsersPage />
            </Protected>
          }
        />
        <Route
          path="summary"
          element={
            <Protected has="assists:summary" navigate="/m/assists">
              <AssistsSummaryPage />
            </Protected>
          }
        />
        <Route
          path="terminals"
          element={
            <Protected has="assists:assistTerminals" navigate="/m/assists">
              <AssistTerminalsPage />
            </Protected>
          }
        />
        <Route
          path="databases"
          element={
            <Protected has="assists:databases" navigate="/m/assists">
              <AssistsDatabasesPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  )
}
