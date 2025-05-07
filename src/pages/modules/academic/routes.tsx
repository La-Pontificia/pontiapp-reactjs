import { Route, Routes } from 'react-router'
import ProtectedModule from '@/protected/module'
import AcademicLayout from './+layout'
import ProgramPage from './programs/+page'
import Protected from '@/protected/auth'
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
import CyclesPage from './programs/[slug]/cycles/+page'

import SectionPeriodsPage from './sections/+page'
import SectionSlugLayout from './sections/[slug]/+layout'
import SectionProgramSlugLayout from './sections/[slug]/[slug]/+layout'
import SectionProgramsPage from './sections/[slug]/+page'
import SectionsPage from './sections/[slug]/[slug]/sections/+page'
import SectionCoursesPage from './sections/[slug]/[slug]/sections/[slug]/courses/+page'
import SectionProgramSectionSlugLayout from './sections/[slug]/[slug]/sections/[slug]/+layout'

import SchedulesSlugLayout from './schedules/[slug]/+layout'
import ScheduleProgramsPage from './schedules/[slug]/+page'
import ScheduleProgramSlugLayout from './schedules/[slug]/[slug]/+layout'
import SchedulesProgramSchedulesPage from './schedules/[slug]/[slug]/+page'
import AreasPage from './areas/+page'
import AcademicReportFilesPage from './report-files/+page'
import AcademicTeacherSchedulesPage from './teacher-schedules/+page'

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
            <ProtectedModule has="academic" navigate="/">
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
            <Route index element={<ScheduleProgramsPage />} />
            <Route path=":programId" element={<ScheduleProgramSlugLayout />}>
              <Route index element={<SchedulesProgramSchedulesPage />} />
            </Route>
          </Route>
        </Route>
        <Route
          path="tt"
          element={
            <Protected has="academic:trakingTeachers" navigate="/">
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
        <Route
          path="teacher-schedules"
          element={
            <Protected has="academic:teacherSchedules" navigate="/m/academic">
              <AcademicTeacherSchedulesPage />
            </Protected>
          }
        />

        <Route path="programs">
          <Route
            index
            element={
              <ProtectedModule has="academic:programs" navigate="/m/academic">
                <ProgramPage />
              </ProtectedModule>
            }
          />
          <Route path=":programId" element={<LayoutSlugPrograms />}>
            <Route
              path="cycles"
              element={
                <Protected has="academic:cycles" navigate="/m/academic">
                  <CyclesPage />
                </Protected>
              }
            />
            <Route path="plans">
              <Route
                index
                element={
                  <Protected has="academic:plans" navigate="/m/academic">
                    <PlansPage />
                  </Protected>
                }
              />
              <Route
                path=":planId"
                element={
                  <Protected has="academic:plans" navigate="/m/academic">
                    <LayoutSlugPlan />
                  </Protected>
                }
              >
                <Route path="courses" element={<PlansCoursesPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route
          path="periods"
          element={
            <Protected has="academic:periods" navigate="/m/academic">
              <PeriodsPage />
            </Protected>
          }
        />
        <Route
          path="courses"
          element={
            <Protected has="academic:courses" navigate="/m/academic">
              <CoursesPage />
            </Protected>
          }
        />

        <Route path="classrooms">
          <Route
            index
            element={
              <Protected
                has="academic:pavilionsClassrooms"
                navigate="/m/academic"
              >
                <ClassroomsPeriodsPage />
              </Protected>
            }
          />
          <Route path=":periodId" element={<ClassroomSlugLayout />}>
            <Route path="pavilions">
              <Route index element={<PavilionsPage />} />
              <Route path=":pavilionId" element={<PavilionSlugLayout />}>
                <Route path="classrooms" element={<ClassroomsPage />}></Route>
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="sections">
          <Route
            index
            element={
              <ProtectedModule has="academic:sections" navigate="/m/academic">
                <SectionPeriodsPage />
              </ProtectedModule>
            }
          />
          <Route
            path=":periodId"
            element={
              <Protected has="academic:sections" navigate="/m/academic">
                <SectionSlugLayout />
              </Protected>
            }
          >
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
        <Route
          path="areas"
          element={
            <Protected has="academic:areas" navigate="/m/academic">
              <AreasPage />
            </Protected>
          }
        />
      </Route>
    </Routes>
  )
}
