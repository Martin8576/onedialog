import { useState } from 'react'
import { Layout, Menu, Badge, Divider, Button, ConfigProvider, Flex } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMessageLines,
  faCalendar,
  faSquareCheck,
  faSparkles,
  faAddressCard,
  faStar,
  faMegaphone,
  faShop,
  faRocketLaunch,
  faChartLine,
  faChartNetwork,
  faSliders,
  faCircleQuestion,
  faArrowRightFromBracket,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-light-svg-icons'
import logo from '../../assets/logo.png'
import userAvatar from '../../assets/users/marc_lobinger.jpg'
import theme from '../theme'

const { Sider } = Layout

const EXPANDED_WIDTH = 280
const COLLAPSED_WIDTH = 64

const primaryColor = theme.token!.colorPrimary

type NavItem = {
  key: string
  label: string
  icon: React.ReactNode
  badge?: number
  imageIcon?: boolean
}

const LogoIcon = () => (
  <img src={logo} alt="oneDialog" style={{ width: 30, height: 30, objectFit: 'cover', display: 'block', borderRadius: 5 }} />
)

const ProfileIcon = () => (
  <img src={userAvatar} alt="Marc Lobinger" style={{ width: 30, height: 30, objectFit: 'cover', display: 'block', borderRadius: 5 }} />
)

const primaryItems: NavItem[] = [
  { key: '/dashboard', label: 'Dashboard', icon: <LogoIcon />, imageIcon: true },
  { key: '/dialogs', label: 'Dialoge', icon: <FontAwesomeIcon icon={faMessageLines}  />, badge: 5 },
  { key: '/appointments', label: 'Termine', icon: <FontAwesomeIcon icon={faCalendar}  /> },
  { key: '/tasks', label: 'Aufgaben', icon: <FontAwesomeIcon icon={faSquareCheck}  /> },
  { key: '/brand-ai', label: 'Marken-KI', icon: <FontAwesomeIcon icon={faSparkles}  /> },
  { key: '/contacts', label: 'Kontakte', icon: <FontAwesomeIcon icon={faAddressCard}  /> },
  { key: '/reviews', label: 'Bewertungen', icon: <FontAwesomeIcon icon={faStar}  /> },
  { key: '/brand-news', label: 'Marken-News', icon: <FontAwesomeIcon icon={faMegaphone}  /> },
]

const adminItems: NavItem[] = [
  { key: '/shop', label: 'Shop', icon: <FontAwesomeIcon icon={faShop}  /> },
  { key: '/marketing', label: 'Marketing', icon: <FontAwesomeIcon icon={faRocketLaunch}  /> },
  { key: '/analytics', label: 'Analytics', icon: <FontAwesomeIcon icon={faChartLine}  /> },
  { key: '/automation', label: 'Automatisierung', icon: <FontAwesomeIcon icon={faChartNetwork}  /> },
  { key: '/settings', label: 'Einstellungen', icon: <FontAwesomeIcon icon={faSliders}  /> },
]

const metaItems: NavItem[] = [
  { key: '/help', label: 'Hilfe', icon: <FontAwesomeIcon icon={faCircleQuestion}  /> },
  { key: '/profile', label: 'Marc Lobinger', icon: <ProfileIcon />, imageIcon: true },
  { key: '/logout', label: 'Abmelden', icon: <FontAwesomeIcon icon={faArrowRightFromBracket} /> },
]

const toMenuItems = (items: NavItem[]) =>
  items.map(({ key, label, icon, badge }) => ({
    key,
    label,
    style: { display: 'flex', alignItems: 'center'},
    icon: badge ? (
      <Badge
        count={badge}
        size="small"
        color={primaryColor}
        offset={[0, 3]}
        style={{ borderRadius: 4, fontSize: 11, fontWeight: 900, lineHeight: 1.4 }}
      >
        <Flex align="center" justify="center" style={{ width: 30, height: 30 }}>{icon}</Flex>
      </Badge>
    ) : (
      <Flex align="center" justify="center" style={{ width: 30, height: 30 }}>{icon}</Flex>
    ),
  }))

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={EXPANDED_WIDTH}
      collapsedWidth={COLLAPSED_WIDTH}
      style={{
        background: '#fff',
        padding: '6px 8px',
        borderRight: '1px solid #f0f0f0',
        position: 'relative',
        height: '100%',
      }}
    >
      <Flex vertical
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                iconSize: 16,
                collapsedIconSize: 16,
                iconMarginInlineEnd: 10,
                activeBarBorderWidth: 0,
                itemPaddingInline: 6,
              },
            },
          }}
        >
          {/* Primary nav — Dashboard uses logo.png as icon */}
          <Menu
            selectedKeys={[location.pathname]}
            inlineCollapsed={collapsed}
            items={toMenuItems(primaryItems)}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 'none' }}
          />

          <Divider style={{ margin: '4px 0' }} />

          {/* Admin nav */}
          <Menu
            selectedKeys={[location.pathname]}
            inlineCollapsed={collapsed}
            items={toMenuItems(adminItems)}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 'none' }}
          />

          <div style={{ flex: 1 }} />

          {/* Meta nav*/}
          <Menu
            selectedKeys={[location.pathname]}
            inlineCollapsed={collapsed}
            items={toMenuItems(metaItems)}
            onClick={({ key }) => navigate(key)}
            style={{ border: 'none', flex: 'none' }}
          />
        </ConfigProvider>
      </Flex>

      {/* Collapse toggle — floating circle on the right edge */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        size="small"
        style={{
          position: 'absolute',
          right: -12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: 'none',
          fontSize: 10,
          zIndex: 10,
        }}
      >
        <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />
      </Button>
    </Sider>
  )
}
