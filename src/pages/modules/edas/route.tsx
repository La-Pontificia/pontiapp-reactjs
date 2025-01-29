import EdasLayout from './+layout'
import { Navigate, Route, Routes } from 'react-router'
import SlugEdaLayout from './slug/+layout'
import SlugEdaPage from './slug/+page'
import SlugCollaboratorEdaSlugLayout from './slug/slug/+layout'
import SlugCollaboratorEdaSlugPage from './slug/slug/+page'
import SlugCollaboratorEdaSlugObjetivesPage from './slug/slug/objectives/+page'
import SlugCollaboratorSlugEdaEvaluationSlugPage from './slug/slug/evaluations/slug/+page'
import CollaboratorsPage from './collaborators/+page'
import MyEdas from './my/+page'
export default function EdasRoutes() {
  return (
    <Routes>
      <Route element={<EdasLayout />}>
        <Route index element={<MyEdas />} />
        <Route path="collaborators">
          <Route index element={<CollaboratorsPage />} />
        </Route>
        <Route path=":slug" element={<SlugEdaLayout />}>
          <Route index element={<SlugEdaPage />} />
          <Route path=":slugYear" element={<SlugCollaboratorEdaSlugLayout />}>
            <Route index element={<SlugCollaboratorEdaSlugPage />} />
            <Route
              path="objetives"
              element={<SlugCollaboratorEdaSlugObjetivesPage />}
            />
            <Route path="evaluations">
              <Route index element={<Navigate to="/m/edas" />} />
              <Route
                path=":slugEvaluation"
                element={<SlugCollaboratorSlugEdaEvaluationSlugPage />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
