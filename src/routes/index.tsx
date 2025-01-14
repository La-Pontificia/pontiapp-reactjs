import { Navigate, Route, Routes } from 'react-router'
import RootLayout from '~/pages/+layout'
import HomePage from '~/pages/+page'
import LandingLayout from '~/layouts/landing'
import LoginPage from '~/pages/login/+page'
import AuthMiddleware from '~/middlewares/auth'
import ModuleLayout from '~/pages/modules/+layout'
import ModulePage from '~/pages/modules/+page'
import UsersLayout from '~/pages/modules/users/+layout'
import UsersPage from '~/pages/modules/users/+page'
import EdasLayout from '~/pages/modules/edas/+layout'
import EdasPage from '~/pages/modules/edas/+page'
import AssistsLayout from '~/pages/modules/assists/+layout'
import EventsLayout from '~/pages/modules/events/+layout'
import EventsPage from '~/pages/modules/events/+page'
import AllUsersPage from '~/pages/modules/users/all/+page'
import CreateUserPage from '~/pages/modules/users/create/+page'
import UsersSlugLayout from '~/pages/modules/users/slug/+layout'
import UsersSlugPage from '~/pages/modules/users/slug/+page'
import UsersSlugOrganizationPage from '~/pages/modules/users/slug/organization/+page'
import UsersSlugPropertiesPage from '~/pages/modules/users/slug/properties/+page'
import UsersSlugSchedulesPage from '~/pages/modules/users/slug/schedules/+page'
import RootSlugLayout from '~/pages/slug/+page'
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
import { AuthProvider } from '~/store/auth'
import UsersEditSchedulesPage from '~/pages/modules/users/edit/schedules/+page'
import Protected from '~/protected/auth'
import ProtectedModule from '~/protected/module'
import CollaboratorsPage from '~/pages/modules/edas/collaborators/+page'
import NotFounPage from '~/pages/not-fount'
import AssistsReportFilesPage from '~/pages/modules/assists/report-files/+page'
import AssistTerminalsPage from '~/pages/modules/assists/terminals/+page'
import AssistsWithoutUsersPage from '~/pages/modules/assists/without-users/+page'
import AssistsSummaryPage from '~/pages/modules/assists/summary/+page'
import AssistsDatabasesPage from '~/pages/modules/assists/databases/+page'
import AssistsMyPage from '~/pages/modules/assists/my/+page'
import EventsRegister from '~/pages/modules/events/register/+page'
import EventsRecordsPage from '~/pages/modules/events/records/+page'
import EventsReportFilesPage from '~/pages/modules/events/report-files/+page'
import AttentionsLayout from '~/pages/modules/attentions/+layout'
import AttentionsPage from '~/pages/modules/attentions/+page'
import AttentionsRegisterPage from '~/pages/modules/attentions/register/+page'
import AttentionsPositionsPage from '~/pages/modules/attentions/positions/+page'
import AttentionsServicesPage from '~/pages/modules/attentions/services/+page'
import AttentionsReportFilesPage from '~/pages/modules/attentions/report-files/+page'
import AttentionsTicketsPage from '~/pages/modules/attentions/tickets/+page'
import AssistsWithUsersPage from '~/pages/modules/assists/with-users/+page'
import AssistsPage from '~/pages/modules/assists/+page'
import UsersSlugAssistsPage from '~/pages/modules/users/slug/assists/+page'
import AttentionsBusinessUnitsPage from '~/pages/modules/attentions/business-units/+page'
import AttentionsAnswerTickets from '~/pages/modules/attentions/answer-tickets/page'
import AttentionsSlugAnswerTicket from '~/pages/modules/attentions/answer-tickets/slug/page'
import AttentionsShiftScreen from '~/pages/modules/attentions/shift-screen/+page'
import DisabledUsersPage from '~/pages/modules/users/disabled/+page'

export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />} path="/login">
        <Route index element={<LoginPage />} />
      </Route>

      <Route
        element={
          <AuthProvider>
            <AuthMiddleware>
              <RootLayout />
            </AuthMiddleware>
          </AuthProvider>
        }
      >
        <Route index element={<HomePage />} />

        <Route path="m" element={<ModuleLayout />}>
          <Route index element={<ModulePage />} />
          <Route path="users">
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
                <Route
                  path="organization"
                  element={<UsersEditOrganizationPage />}
                />
                <Route
                  path="properties"
                  element={<UsersEditPropertiesPage />}
                />

                <Route path="schedules" element={<UsersEditSchedulesPage />} />
              </Route>
              <Route path=":slug" element={<UsersSlugLayout />}>
                <Route index element={<UsersSlugPage />} />
                <Route
                  path="organization"
                  element={<UsersSlugOrganizationPage />}
                />
                <Route
                  path="properties"
                  element={<UsersSlugPropertiesPage />}
                />
                <Route path="schedules" element={<UsersSlugSchedulesPage />} />
                <Route path="assists" element={<UsersSlugAssistsPage />} />
                <Route path="history" element={<UsersSlugHistoryPage />} />
              </Route>
              <Route path="*" element={<UsersPage />} />
            </Route>
          </Route>

          <Route path="edas" element={<EdasLayout />}>
            <Route index element={<EdasPage />} />
            <Route path="collaborators" element={<CollaboratorsPage />} />
          </Route>
          <Route
            path="assists"
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
          <Route
            path="events"
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
            <Route
              path="register"
              element={
                <Protected has="events:records:register" navigate="/m/events">
                  <EventsRegister />
                </Protected>
              }
            />
            <Route
              path="records"
              element={
                <Protected has="events:records:view" navigate="/m/events">
                  <EventsRecordsPage />
                </Protected>
              }
            />
            <Route
              path="report-files"
              element={
                <Protected
                  has="events:records:reportFiles"
                  navigate="/m/events"
                >
                  <EventsReportFilesPage />
                </Protected>
              }
            />
          </Route>
          <Route
            path="attentions"
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
                <Protected
                  has="attentions:tickets:create"
                  navigate="/m/attentions"
                >
                  <AttentionsRegisterPage />
                </Protected>
              }
            />
            <Route path="answer-tickets">
              <Route
                index
                element={
                  <Protected
                    has="attentions:answerTicket"
                    navigate="/m/attentions"
                  >
                    <AttentionsAnswerTickets />
                  </Protected>
                }
              />
              <Route
                path=":slug"
                element={
                  <Protected
                    has="attentions:answerTicket"
                    navigate="/m/attentions"
                  >
                    <AttentionsSlugAnswerTicket />
                  </Protected>
                }
              />
            </Route>
            <Route
              path="shift-screen"
              element={
                <Protected
                  has="attentions:shiftScreen"
                  navigate="/m/attentions"
                >
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
                <Protected
                  has="attentions:businessUnits"
                  navigate="/m/attentions"
                >
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
                <Protected
                  has="attentions:reportFiles"
                  navigate="/m/attentions"
                >
                  <AttentionsReportFilesPage />
                </Protected>
              }
            />
          </Route>
        </Route>

        <Route element={<RootSlugLayout />}>
          <Route path=":slug" element={<UsersSlugLayout />}>
            <Route index element={<UsersSlugPage />} />
            <Route
              path="organization"
              element={<UsersSlugOrganizationPage />}
            />
            <Route path="properties" element={<UsersSlugPropertiesPage />} />
            <Route path="schedules" element={<UsersSlugSchedulesPage />} />
            <Route path="assists" element={<UsersSlugAssistsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFounPage />} />
    </Routes>
  )
}
