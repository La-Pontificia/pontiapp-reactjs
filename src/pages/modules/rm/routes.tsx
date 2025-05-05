import { Route, Routes } from 'react-router'
import ProtectedModule from '@/protected/module'
import ResourceManagementLayout from './+layout'
import ResourceManagementReportFilesPage from './report-files/+page'
import ResourceManagementPage from './+page'

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
        <Route
          index
          element={
            <ProtectedModule navigate="/" has="rm">
              <ResourceManagementPage />
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
        <Route
          path="*"
          element={
            <div className="grid place-content-center flex-grow text-sm">
              Not implemented yet
            </div>
          }
        />
      </Route>
    </Routes>
  )
}
