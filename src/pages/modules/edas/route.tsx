import EdasLayout from './+layout'
import EdasPage from './+page'
import { Route, Routes } from 'react-router'
import CollaboratorsPage from './collaborators/+page'
import SlugCollaboratorsLayout from './collaborators/slug/+layout'
import SlugCollaboratorPage from './collaborators/slug/+page'

export default function EdasRoutes() {
  return (
    <Routes>
      <Route element={<EdasLayout />}>
        <Route index element={<EdasPage />} />
        <Route path="collaborators">
          <Route index element={<CollaboratorsPage />} />
          <Route path=":slug" element={<SlugCollaboratorsLayout />}>
            <Route index element={<SlugCollaboratorPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
