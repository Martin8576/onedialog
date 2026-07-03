import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Tabs } from 'antd'
import PageLayout from '../designsystem/sharedComponents/PageLayout'

export default function Marketing() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = location.pathname.startsWith('/marketing/werbemittel')
    ? 'werbemittel'
    : 'newsletter'

  return (
    <PageLayout
      title="Marketing"
      tabs={
        <Tabs
          activeKey={activeTab}
          onChange={key => navigate(`/marketing/${key}`)}
          items={[
            { key: 'newsletter', label: 'Newsletter' },
            { key: 'werbemittel', label: 'Werbemittel' },
          ]}
        />
      }
    >
      <Outlet />
    </PageLayout>
  )
}
