import { Route, Routes } from 'react-router'
import RootLayout from '~/pages/+layout'
import HomePage from '~/pages/+page'
import LandingLayout from '~/layouts/landing'
import LoginPage from '~/pages/login/+page'
import AuthMiddleware from '~/middlewares/auth'
import { AuthProvider } from '~/store/auth'
import NotFounPage from '~/pages/not-fount'
import SlugRoutes from '~/pages/slug/routes'
import ModulesRoutes from '~/pages/modules/routes'

export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />} path="/login">
        <Route index element={<LoginPage />} />
      </Route>

      <Route
        element={
          <AuthProvider>
            <AuthMiddleware>
              <RootLayout />
            </AuthMiddleware>
          </AuthProvider>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="m/*" element={<ModulesRoutes />} />
        <Route path="*" element={<SlugRoutes />} />
      </Route>
      <Route path="*" element={<NotFounPage />} />
    </Routes>
  )
}
