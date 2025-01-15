import EdasLayout from './+layout'
import EdasPage from './+page'
import { Route, Routes } from 'react-router'

export default function EdasRoutes() {
  return (
    <Routes>
      <Route element={<EdasLayout />}>
        <Route index element={<EdasPage />} />
      </Route>
    </Routes>
  )
}
