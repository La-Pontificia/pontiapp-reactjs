import { Route, Routes } from 'react-router'
import RootSlugLayout from './+page'
import UsersSlugLayout from '../modules/users/slug/+layout'
import UsersSlugPage from '../modules/users/slug/+page'
import UsersSlugOrganizationPage from '../modules/users/slug/organization/+page'
import UsersSlugPropertiesPage from '../modules/users/slug/properties/+page'
import UsersSlugSchedulesPage from '../modules/users/slug/schedules/+page'
import UsersSlugAssistsPage from '../modules/users/slug/assists/+page'

export default function SlugRoutes() {
  return (
    <Routes>
      <Route element={<RootSlugLayout />}>
        <Route path=":slug" element={<UsersSlugLayout />}>
          <Route index element={<UsersSlugPage />} />
          <Route path="organization" element={<UsersSlugOrganizationPage />} />
          <Route path="properties" element={<UsersSlugPropertiesPage />} />
          <Route path="schedules" element={<UsersSlugSchedulesPage />} />
          <Route path="assists" element={<UsersSlugAssistsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
