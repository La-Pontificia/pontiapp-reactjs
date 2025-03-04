import { Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import ResourceManagementLayout from './+layout'
import ResourceManagementReportFilesPage from './report-files/+page'
import TeacherTrackingsPage from './tt/+page'
import AcademicProgramsPage from './academic-programs/+page'
import SectionsPage from './sections/+page'
import PeriodsPage from './periods/+page'
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
          path="tt"
          element={
            <ProtectedModule has="rm:tt" navigate="/">
              <TeacherTrackingsPage />
            </ProtectedModule>
          }
        />
        <Route
          path="academic-programs"
          element={
            <ProtectedModule has="rm:academicPrograms" navigate="/">
              <AcademicProgramsPage />
            </ProtectedModule>
          }
        />
        <Route
          path="periods"
          element={
            <ProtectedModule has="rm:periods" navigate="/">
              <PeriodsPage />
            </ProtectedModule>
          }
        />
        <Route
          path="sections"
          element={
            <ProtectedModule has="rm:sections" navigate="/">
              <SectionsPage />
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
