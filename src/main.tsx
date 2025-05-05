import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import ThemeProvider from '@/providers/theme'
import TanstackProvider from './providers/tanstack'
import UiProvider from './providers/ui'
import MainRoutes from './pages/routes'
import FluentUIProvider from './providers/fluentui'

createRoot(document.body).render(
  <ThemeProvider>
    <FluentUIProvider>
      <UiProvider>
        <BrowserRouter>
          <TanstackProvider>
            <MainRoutes />
          </TanstackProvider>
        </BrowserRouter>
      </UiProvider>
    </FluentUIProvider>
  </ThemeProvider>
)
