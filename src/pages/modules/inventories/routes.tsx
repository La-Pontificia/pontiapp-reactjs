import { Navigate, Route, Routes } from 'react-router'
import ProtectedModule from '~/protected/module'
import InventoriesLayout from './+layout'
import PharmacyRoutes from './pharmacy/routes'

export default function InventoriesRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedModule navigate="/" has="inventories">
            <InventoriesLayout />
          </ProtectedModule>
        }
      >
        <Route
          index
          element={<Navigate to="/m/inventories/pharmacy/items" />}
        />
        <Route path="pharmacy/*" element={<PharmacyRoutes />} />
      </Route>
    </Routes>
  )
}
