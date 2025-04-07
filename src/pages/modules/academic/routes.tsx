import { Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import AcademicLayout from './+layout'
import ProgramPage from './programs/+page'
import Protected from '~/protected/auth'
import SchedulesPage from './schedules/+page'
import PeriodsPage from './periods/+page'
import AcademicPage from './+page'
import TeacherTrackingsPage from './tt/+page'
import PlansPage from './programs/[slug]/plans/+page'
import LayoutSlugPrograms from './programs/[slug]/+layout'
import LayoutSlugPlan from './programs/[slug]/plans/[slug]/+layout'
import CoursesPage from './courses/+page'
import ClassroomsPeriodsPage from './classrooms/+page'
import ClassroomSlugLayout from './classrooms/[slug]/+layout'
import PavilionsPage from './classrooms/[slug]/pavilions/+page'
import PavilionSlugLayout from './classrooms/[slug]/pavilions/[slug]/+layout'
import ClassroomsPage from './classrooms/[slug]/pavilions/[slug]/classrooms/+page'
import PlansCoursesPage from './programs/[slug]/plans/[slug]/courses/+page'
import SectionPeriodsPage from './sections/+page'
import SectionSlugLayout from './sections/[slug]/+layout'
import SectionProgramsPage from './sections/[slug]/programs/+page'
import SectionProgramSlugLayout from './sections/[slug]/programs/[slug]/+layout'
import SectionsPage from './sections/[slug]/programs/[slug]/sections/+page'
import CyclesPage from './programs/[slug]/cycles/+page'
import SectionCoursesPage from './sections/[slug]/programs/[slug]/sections/[slug]/courses/+page'
import SectionProgramSectionSlugLayout from './sections/[slug]/programs/[slug]/sections/[slug]/+layout'
import SchedulesSlugLayout from './schedules/[slug]/+layout'
import ScheduleProgramsPage from './schedules/[slug]/programs/+page'
import ScheduleProgramSlugLayout from './schedules/[slug]/programs/[slug]/+layout'
import SchedulesProgramSchedulesPage from './schedules/[slug]/programs/[slug]/+page'
import AreasPage from './areas/+page'
import AcademicReportFilesPage from './report-files/+page'

export default function AcademicRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="academic">
            <AcademicLayout />
          </ProtectedModule>
        }
      >
        <Route
          index
          element={
            <ProtectedModule has="academic" navigate="/academic/schedules">
              <AcademicPage />
            </ProtectedModule>
          }
        />
        <Route path="schedules">
          <Route
            index
            element={
              <Protected has="academic:schedules" navigate="/">
                <SchedulesPage />
              </Protected>
            }
          />
          <Route path=":periodId" element={<SchedulesSlugLayout />}>
            <Route path="programs">
              <Route index element={<ScheduleProgramsPage />} />
              <Route path=":programId" element={<ScheduleProgramSlugLayout />}>
                <Route index element={<SchedulesProgramSchedulesPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path="tt"
          element={
            <Protected has="academic:tt" navigate="/">
              <TeacherTrackingsPage />
            </Protected>
          }
        />
        <Route
          path="report-files"
          element={
            <Protected has="academic:reportFiles" navigate="/m/academic">
              <AcademicReportFilesPage />
            </Protected>
          }
        />

        <Route path="programs">
          <Route
            index
            element={
              <ProtectedModule has="academic:programs" navigate="/">
                <ProgramPage />
              </ProtectedModule>
            }
          />
          <Route path=":programId" element={<LayoutSlugPrograms />}>
            <Route path="cycles" element={<CyclesPage />} />
            <Route path="plans">
              <Route index element={<PlansPage />} />
              <Route path=":planId" element={<LayoutSlugPlan />}>
                <Route path="courses" element={<PlansCoursesPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path="periods"
          element={
            <ProtectedModule has="academic:periods" navigate="/">
              <PeriodsPage />
            </ProtectedModule>
          }
        />
        <Route
          path="courses"
          element={
            <ProtectedModule has="academic:courses" navigate="/">
              <CoursesPage />
            </ProtectedModule>
          }
        />

        <Route path="classrooms">
          <Route
            index
            element={
              <ProtectedModule has="academic:classrooms" navigate="/">
                <ClassroomsPeriodsPage />
              </ProtectedModule>
            }
          />
          <Route
            path=":periodId"
            element={
              <ProtectedModule has="academic:classrooms" navigate="/">
                <ClassroomSlugLayout />
              </ProtectedModule>
            }
          >
            <Route path="pavilions">
              <Route
                index
                element={
                  <ProtectedModule has="academic:pavilions" navigate="/">
                    <PavilionsPage />
                  </ProtectedModule>
                }
              />
              <Route
                path=":pavilionId"
                element={
                  <ProtectedModule has="academic:pavilions" navigate="/">
                    <PavilionSlugLayout />
                  </ProtectedModule>
                }
              >
                <Route
                  path="classrooms"
                  element={
                    <ProtectedModule has="academic:classrooms" navigate="/">
                      <ClassroomsPage />
                    </ProtectedModule>
                  }
                ></Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="sections">
          <Route
            index
            element={
              <ProtectedModule has="academic:sections" navigate="/">
                <SectionPeriodsPage />
              </ProtectedModule>
            }
          />
          <Route path=":periodId" element={<SectionSlugLayout />}>
            <Route path="programs">
              <Route index element={<SectionProgramsPage />} />
              <Route path=":programId" element={<SectionProgramSlugLayout />}>
                <Route path="sections">
                  <Route index element={<SectionsPage />} />
                  <Route
                    path=":sectionId"
                    element={<SectionProgramSectionSlugLayout />}
                  >
                    <Route path="courses" element={<SectionCoursesPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path="areas"
          element={
            <ProtectedModule has="academic:areas" navigate="/">
              <AreasPage />
            </ProtectedModule>
          }
        />
      </Route>
    </Routes>
  )
}
