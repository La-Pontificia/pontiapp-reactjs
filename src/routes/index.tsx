import { Route, Routes } from 'react-router'
import MaintenancePage from '~/pages/maintenance/+page'

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="*" element={<MaintenancePage />} />
    </Routes>
  )
}
