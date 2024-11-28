import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import MainRoutes from '@/routes'
import FluentUIProvider from '@/providers/fluentui'
import ThemeProvider from '@/providers/theme'
import TanstackProvider from './providers/tanstack'
import UiProvider from './providers/ui'
import { AuthProvider } from './store/auth'

createRoot(document.getElementById('app')!).render(
  <AuthProvider>
    <UiProvider>
      <ThemeProvider>
        <FluentUIProvider>
          <BrowserRouter>
            <TanstackProvider>
              <MainRoutes />
            </TanstackProvider>
          </BrowserRouter>
        </FluentUIProvider>
      </ThemeProvider>
    </UiProvider>
  </AuthProvider>
)