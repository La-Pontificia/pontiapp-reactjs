import { Route, Routes } from 'react-router'
import Protected from '@/protected/auth'
import PharmacyItemsPage from './items/+page'

export default function PharmacyRoutes() {
  return (
    <Routes>
      <Route
        path="items"
        element={
          <Protected has="inventories:pharmacy:items" navigate="/">
            <PharmacyItemsPage />
          </Protected>
        }
      />
    </Routes>
  )
}
