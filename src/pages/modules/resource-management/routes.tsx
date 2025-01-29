import { Navigate, Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import ResourceManagementLayout from './+layout'
import ResourceManagementReportFilesPage from './report-files/+page'
import SemestersPage from './semesters/+page'
import TeacherTrackingsPage from './teacher-trackings/+page'

export default function ResourceManagementRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="resourceManagement">
            <ResourceManagementLayout />
          </ProtectedModule>
        }
      >
        <Route
          index
          element={<Navigate to="teacher-trackings" replace={true} />}
        />
        <Route
          path="teacher-trackings"
          element={
            <ProtectedModule
              has="resourceManagement:teacherTrackings"
              navigate="/"
            >
              <TeacherTrackingsPage />
            </ProtectedModule>
          }
        />
        <Route
          path="report-files"
          element={
            <ProtectedModule has="resourceManagement:reportFiles" navigate="/">
              <ResourceManagementReportFilesPage />
            </ProtectedModule>
          }
        />
        <Route
          path="semesters"
          element={
            <ProtectedModule has="resourceManagement:semesters" navigate="/">
              <SemestersPage />
            </ProtectedModule>
          }
        />
      </Route>
    </Routes>
  )
}
