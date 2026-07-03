import { createHashRouter as createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import Navbar from './designsystem/sharedComponents/Navbar'
import Dashboard from './pages/Dashboard'
import Dialogs from './pages/Dialogs'
import Appointments from './pages/Appointments'
import Tasks from './pages/Tasks'
import BrandAI from './pages/BrandAI'
import Contacts from './pages/Contacts/Contacts'
import Reviews from './pages/Reviews'
import BrandNews from './pages/BrandNews'
import Shop from './pages/Shop'
import Marketing from './pages/Marketing'
import Newsletter from './pages/Marketing/Newsletter'
import Werbemittel from './pages/Marketing/Werbemittel'
import Analytics from './pages/Analytics'
import Automation from './pages/Automation'
import Settings from './pages/Settings'
import Help from './pages/Help'

function AppShell() {
  return (
    <Layout style={{ height: '100%', overflow: 'hidden' }}>
      <Navbar />
      <Layout style={{ overflow: 'hidden' }}>
        <Layout.Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#fafafa',
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/contacts" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'dialogs', element: <Dialogs /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'brand-ai', element: <BrandAI /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'brand-news', element: <BrandNews /> },
      { path: 'shop', element: <Shop /> },
      {
        path: 'marketing',
        element: <Marketing />,
        children: [
          { index: true, element: <Navigate to="newsletter" replace /> },
          { path: 'newsletter', element: <Newsletter /> },
          { path: 'werbemittel', element: <Werbemittel /> },
        ],
      },
      { path: 'analytics', element: <Analytics /> },
      { path: 'automation', element: <Automation /> },
      { path: 'settings', element: <Settings /> },
      { path: 'help', element: <Help /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
