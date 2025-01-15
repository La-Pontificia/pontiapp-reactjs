import { Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import AttentionsLayout from './+layout'
import Protected from '~/protected/auth'

import AttentionsPage from './+page'
import AttentionsRegisterPage from './register/+page'
import AttentionsAnswerTickets from './answer-tickets/page'
import AttentionsSlugAnswerTicket from './answer-tickets/slug/page'
import AttentionsShiftScreen from './shift-screen/+page'
import AttentionsPositionsPage from './positions/+page'
import AttentionsServicesPage from './services/+page'
import AttentionsBusinessUnitsPage from './business-units/+page'
import AttentionsTicketsPage from './tickets/+page'
import AttentionsReportFilesPage from './report-files/+page'

export default function AttentionsRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule has="attentions" navigate="/">
            <AttentionsLayout />
          </ProtectedModule>
        }
      >
        <Route
          index
          element={
            <Protected has="attentions:show" navigate="/">
              <AttentionsPage />
            </Protected>
          }
        />
        <Route
          path="register"
          element={
            <Protected has="attentions:tickets:create" navigate="/m/attentions">
              <AttentionsRegisterPage />
            </Protected>
          }
        />
        <Route path="answer-tickets">
          <Route
            index
            element={
              <Protected has="attentions:answerTicket" navigate="/m/attentions">
                <AttentionsAnswerTickets />
              </Protected>
            }
          />
          <Route
            path=":slug"
            element={
              <Protected has="attentions:answerTicket" navigate="/m/attentions">
                <AttentionsSlugAnswerTicket />
              </Protected>
            }
          />
        </Route>
        <Route
          path="shift-screen"
          element={
            <Protected has="attentions:shiftScreen" navigate="/m/attentions">
              <AttentionsShiftScreen />
            </Protected>
          }
        />
        <Route
          path="positions"
          element={
            <Protected has="attentions:positions" navigate="/m/attentions">
              <AttentionsPositionsPage />
            </Protected>
          }
        />
        <Route
          path="services"
          element={
            <Protected has="attentions:services" navigate="/m/attentions">
              <AttentionsServicesPage />
            </Protected>
          }
        />
        <Route
          path="business-units"
          element={
            <Protected has="attentions:businessUnits" navigate="/m/attentions">
              <AttentionsBusinessUnitsPage />
            </Protected>
          }
        />
        <Route
          path="tickets"
          element={
            <Protected has="attentions:tickets" navigate="/m/attentions">
              <AttentionsTicketsPage />
            </Protected>
          }
        />
        <Route
          path="report-files"
          element={
            <Protected has="attentions:reportFiles" navigate="/m/attentions">
              <AttentionsReportFilesPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  )
}
