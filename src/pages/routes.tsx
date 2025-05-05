import { Outlet, Route, Routes } from 'react-router'
import RootLayout from '@/pages/+layout'
import HomePage from '@/pages/+page'
import LoginPage from '@/pages/login/+page'
import AuthMiddleware from '@/middlewares/auth'
import { AuthProvider } from '@/store/auth'
import NotFounPage from '@/pages/not-fount'
import SlugRoutes from '@/pages/slug/routes'
import ModulesRoutes from '@/pages/modules/routes'
// import DocsLayout from './docs/+layout'
// import DocsPage from './docs/+page'
// import SlugDocsPage from './docs/slug/+page'
import CreatePasswordPage from './create-password/+page'
import SearchPage from './search/+page'

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <AuthProvider>
            <AuthMiddleware>
              <Outlet />
            </AuthMiddleware>
          </AuthProvider>
        }
      >
        <Route path="/create-password" element={<CreatePasswordPage />} />
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="m/*" element={<ModulesRoutes />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<SlugRoutes />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFounPage />} />
    </Routes>
  )
}
