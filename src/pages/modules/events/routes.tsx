import EventsLayout from '@/pages/modules/events/+layout'
import EventsPage from '@/pages/modules/events/+page'
import EventsRegister from '@/pages/modules/events/register/+page'
import EventsReportFilesPage from '@/pages/modules/events/report-files/+page'

import { Route, Routes } from 'react-router'
import ProtectedModule from '@/protected/module'
import Protected from '@/protected/auth'
import EventSlugLayout from './[slug]/+layout'
import RecordsPage from './[slug]/records/+page'

export default function EventsRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="events">
            <EventsLayout />
          </ProtectedModule>
        }
      >
        <Route
          index
          element={
            <ProtectedModule has="events" navigate="/">
              <EventsPage />
            </ProtectedModule>
          }
        />
        <Route path=":eventId" element={<EventSlugLayout />}>
          <Route
            path="records"
            element={
              <Protected has="events:records:view" navigate="/m/events">
                <RecordsPage />
              </Protected>
            }
          />
        </Route>
        <Route
          path="register"
          element={
            <Protected has="events:records:register" navigate="/m/events">
              <EventsRegister />
            </Protected>
          }
        />
        <Route
          path="report-files"
          element={
            <Protected has="events:records:reportFiles" navigate="/m/events">
              <EventsReportFilesPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  )
}
