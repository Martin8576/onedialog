import { createHashRouter as createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { Layout, theme as antdTheme } from 'antd'
import Navbar from './designsystem/sharedComponents/Navbar'
import Dashboard from './pages/Dashboard'
import Dialogs from './pages/Dialogs/Dialogs'
import Appointments from './pages/Appointments'
import Tasks from './pages/Tasks'
import BrandAI from './pages/BrandAI'
import Contacts from './pages/Contacts/Contacts'
import Reviews from './pages/Reviews'
import BrandNews from './pages/BrandNews'
import Shop from './pages/Shop'
import Newsletter from './pages/Marketing/Newsletter'
import Werbemassnahmen from './pages/Marketing/Werbemassnahmen'
import Touchpoints from './pages/Marketing/Touchpoints'
import Analytics from './pages/Analytics'
import Automations from './pages/Automation/Automations'
import AutomationDetail from './pages/Automation/AutomationDetail'
import Journeys from './pages/Automation/Journeys'
import Campaigns from './pages/Automation/Campaigns'
import ContactEvents from './pages/ContactEvents/ContactEvents'
import ContactEventWizard from './pages/ContactEvents/ContactEventWizard'
import ContactEventDetail from './pages/ContactEvents/ContactEventDetail'
import Settings from './pages/Settings'
import SettingsAccount from './pages/Settings/Account'
import SettingsTeamsChannels from './pages/Settings/TeamsChannels'
import SettingsUsers from './pages/Settings/Users'
import SettingsQuickReplies from './pages/Settings/QuickReplies'
import SettingsBots from './pages/Settings/Bots'
import SettingsPhoneAssistants from './pages/Settings/PhoneAssistants'
import SettingsAudiences from './pages/Settings/Audiences'
import SettingsImportExport from './pages/Settings/ImportExport'
import Help from './pages/Help'
import Profile from './pages/Profile'
import Placeholder from './pages/Placeholder'
import ReleaseNewsList from './pages/News/ReleaseNewsList'
import ReleaseNewsEditor from './pages/News/ReleaseNewsEditor'

function AppShell() {
  const { token } = antdTheme.useToken()

  return (
    <Layout hasSider style={{ height: '100%', overflow: 'hidden', background: token.colorGrey6 }}>
      <Navbar />
      <Layout style={{ overflow: 'hidden', background: 'transparent' }}>
        <Layout.Content
          style={{
            display: 'flex',
            flexDirection: 'column',
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
      { index: true, element: <Navigate to="/news/releases" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'dialogs', element: <Dialogs /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'brand-ai', element: <BrandAI /> },
      { path: 'contacts', element: <Contacts /> },
      { path: 'contacts/mine', element: <Contacts /> },
      { path: 'contacts/team', element: <Contacts /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'brand-news', element: <BrandNews /> },
      { path: 'shop', element: <Shop /> },
      { path: 'marketing', element: <Navigate to="/marketing/newsletter" replace /> },
      { path: 'marketing/werbemassnahmen', element: <Werbemassnahmen /> },
      { path: 'marketing/newsletter', element: <Newsletter /> },
      { path: 'marketing/touchpoints', element: <Touchpoints /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'automation', element: <Navigate to="/automation/automations" replace /> },
      { path: 'automation/automations', element: <Automations /> },
      { path: 'automation/automations/new', element: <AutomationDetail /> },
      { path: 'automation/automations/:id', element: <AutomationDetail /> },
      { path: 'automation/journeys', element: <Journeys /> },
      { path: 'automation/campaigns', element: <Campaigns /> },
      { path: 'automation/contact-events', element: <ContactEvents /> },
      { path: 'automation/contact-events/new', element: <ContactEventWizard /> },
      { path: 'automation/contact-events/:id', element: <ContactEventDetail /> },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          { index: true, element: <Navigate to="account" replace /> },
          { path: 'account', element: <SettingsAccount /> },
          { path: 'teams-channels', element: <SettingsTeamsChannels /> },
          { path: 'users', element: <SettingsUsers /> },
          { path: 'quick-replies', element: <SettingsQuickReplies /> },
          { path: 'bots', element: <SettingsBots /> },
          { path: 'phone-assistants', element: <SettingsPhoneAssistants /> },
          { path: 'audiences', element: <SettingsAudiences /> },
          { path: 'import-export', element: <SettingsImportExport /> },
        ],
      },
      { path: 'dealers', element: <Placeholder title="Händler" /> },
      { path: 'brand-info', element: <Placeholder title="Brand-Info" /> },
      { path: 'analytics/general', element: <Placeholder title="Analytics – Allgemein" /> },
      { path: 'analytics/automations', element: <Placeholder title="Analytics – Automationen" /> },
      { path: 'analytics/newsletter', element: <Placeholder title="Analytics – Newsletter" /> },
      { path: 'documents', element: <Placeholder title="Dokumente" /> },
      { path: 'whatsapp-templates', element: <Placeholder title="WhatsApp-Vorlagen" /> },
      { path: 'configuration/customer-types', element: <Placeholder title="Kundenarten" /> },
      { path: 'configuration/products', element: <Placeholder title="Produkte" /> },
      { path: 'configuration/services', element: <Placeholder title="Leistungen" /> },
      { path: 'brand-gpt/prompt-suggestions', element: <Placeholder title="Prompt-Vorschläge" /> },
      { path: 'brand-gpt/documents', element: <Placeholder title="Marken-GPT – Dokumente" /> },
      { path: 'brand-gpt/links', element: <Placeholder title="Links" /> },
      { path: 'brand-gpt/settings', element: <Placeholder title="Marken-GPT – Einstellungen" /> },
      { path: 'brand-gpt/system-prompt', element: <Placeholder title="system-Prompt" /> },
      { path: 'brand-gpt/writing-tools', element: <Placeholder title="Writing-Tools" /> },
      { path: 'feedback', element: <Placeholder title="Feedback" /> },
      { path: 'billing', element: <Placeholder title="Abrechnung" /> },
      { path: 'brands', element: <Placeholder title="Marken" /> },
      { path: 'news/releases', element: <ReleaseNewsList /> },
      { path: 'news/releases/new', element: <ReleaseNewsEditor /> },
      { path: 'news/releases/:id', element: <ReleaseNewsList /> },
      { path: 'news/releases/:id/edit', element: <ReleaseNewsEditor /> },
      { path: 'news/incidents', element: <Placeholder title="Störungsmeldung" /> },
      { path: 'usage', element: <Placeholder title="Nutzungsstatistik" /> },
      { path: 'help', element: <Help /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
