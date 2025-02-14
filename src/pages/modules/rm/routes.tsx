import { Navigate, Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import ResourceManagementLayout from './+layout'
import ResourceManagementReportFilesPage from './report-files/+page'
import TeacherTrackingsPage from './tt/+page'

export default function ResourceManagementRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="rm">
            <ResourceManagementLayout />
          </ProtectedModule>
        }
      >
        <Route index element={<Navigate to="tt" replace={true} />} />
        <Route
          path="tt"
          element={
            <ProtectedModule has="rm:tt" navigate="/">
              <TeacherTrackingsPage />
            </ProtectedModule>
          }
        />
        <Route
          path="report-files"
          element={
            <ProtectedModule has="rm:reportFiles" navigate="/">
              <ResourceManagementReportFilesPage />
            </ProtectedModule>
          }
        />
      </Route>
    </Routes>
  )
}
