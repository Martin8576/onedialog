import { useState } from 'react'
import { Flex, Typography, Button, Popover, Divider, Tooltip, theme as antdTheme } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faShop,
  faCircleInfo,
  faChartLine,
  faFileLines,
  faMessageLines,
  faBoltLightning,
  faCodeFork,
  faSliders,
  faSparkles,
  faBullseyePointer,
  faSquareList,
  faGear,
  faCreditCard,
  faList,
  faBullhorn,
  faChartUser,
  faUser,
  faCircleQuestion,
  faArrowRightFromBracket,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from '@fortawesome/pro-light-svg-icons'
import logo from '../../assets/logo.png'
import userAvatar from '../../assets/users/marc_lobinger.jpg'

const { Text } = Typography

const EXPANDED_WIDTH = 290
const COLLAPSED_WIDTH = 60
const ROW_HEIGHT = 40
const SUB_ROW_HEIGHT = 32
const ICON_BOX = 30

type NavSubItem = {
  key: string
  label: string
}

type NavItem = {
  key: string
  label: string
  icon: React.ReactNode
  badge?: number
  imageIcon?: boolean
  bold?: boolean
  children?: NavSubItem[]
}

const LogoIcon = () => (
  <img src={logo} alt="oneDialog" style={{ width: ICON_BOX, height: ICON_BOX, objectFit: 'cover', display: 'block', borderRadius: 6 }} />
)

const ProfileIcon = () => (
  <img src={userAvatar} alt="Marc Lobinger" style={{ width: ICON_BOX, height: ICON_BOX, objectFit: 'cover', display: 'block', borderRadius: 6 }} />
)

const brandItems: NavItem[] = [
  { key: '/dashboard', label: 'oneDialog Admin', icon: <LogoIcon />, imageIcon: true, bold: true },
  { key: '/dealers', label: 'Händler', icon: <FontAwesomeIcon icon={faShop} /> },
  { key: '/brand-info', label: 'Brand-Info', icon: <FontAwesomeIcon icon={faCircleInfo} /> },
  {
    key: '/analytics',
    label: 'Analytics',
    icon: <FontAwesomeIcon icon={faChartLine} />,
    children: [
      { key: '/analytics/general', label: 'Allgemein' },
      { key: '/analytics/automations', label: 'Automationen' },
      { key: '/analytics/newsletter', label: 'Newsletter' },
    ],
  },
  { key: '/documents', label: 'Dokumente', icon: <FontAwesomeIcon icon={faFileLines} /> },
  { key: '/whatsapp-templates', label: 'WhatsApp-Vorlagen', icon: <FontAwesomeIcon icon={faMessageLines} /> },
  { key: '/settings/quick-replies', label: 'Schnellantworten', icon: <FontAwesomeIcon icon={faBoltLightning} /> },
  {
    key: '/automation',
    label: 'Automatisierung',
    icon: <FontAwesomeIcon icon={faCodeFork} />,
    children: [
      { key: '/automation/campaigns', label: 'Kampagnen' },
      { key: '/automation/journeys', label: 'Journeys' },
      { key: '/automation/contact-events', label: 'Kontakt-Events' },
      { key: '/automation/automations', label: 'Automationen' },
    ],
  },
  {
    key: '/configuration',
    label: 'Konfiguration',
    icon: <FontAwesomeIcon icon={faSliders} />,
    children: [
      { key: '/configuration/customer-types', label: 'Kundenarten' },
      { key: '/configuration/products', label: 'Produkte' },
      { key: '/configuration/services', label: 'Leistungen' },
    ],
  },
  {
    key: '/brand-gpt',
    label: 'Marken-GPT',
    icon: <FontAwesomeIcon icon={faSparkles} />,
    children: [
      { key: '/brand-gpt/prompt-suggestions', label: 'Prompt-Vorschläge' },
      { key: '/brand-gpt/documents', label: 'Dokumente' },
      { key: '/brand-gpt/links', label: 'Links' },
      { key: '/brand-gpt/settings', label: 'Einstellungen' },
      { key: '/brand-gpt/system-prompt', label: 'system-Prompt' },
      { key: '/brand-gpt/writing-tools', label: 'Writing-Tools' },
    ],
  },
  { key: '/settings/audiences', label: 'Zielgruppen', icon: <FontAwesomeIcon icon={faBullseyePointer} /> },
  { key: '/feedback', label: 'Feedback', icon: <FontAwesomeIcon icon={faSquareList} /> },
  {
    key: '/settings',
    label: 'Einstellungen',
    icon: <FontAwesomeIcon icon={faGear} />,
    children: [
      { key: '/settings/phone-assistants', label: 'KI-Telefonassistent' },
    ],
  },
]

const globalItems: NavItem[] = [
  { key: '/billing', label: 'Abrechnung', icon: <FontAwesomeIcon icon={faCreditCard} /> },
  { key: '/brands', label: 'Marken', icon: <FontAwesomeIcon icon={faList} /> },
  {
    key: '/news',
    label: 'News',
    icon: <FontAwesomeIcon icon={faBullhorn} />,
    children: [
      { key: '/news/releases', label: 'Release-News' },
      { key: '/news/incidents', label: 'Störungsmeldung' },
    ],
  },
  { key: '/usage', label: 'Nutzungsstatistik', icon: <FontAwesomeIcon icon={faChartUser} /> },
]

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const activeParent = [...brandItems, ...globalItems].find(item =>
    item.children?.some(child => location.pathname === child.key || location.pathname.startsWith(`${child.key}/`)),
  )
  const [expandedKeys, setExpandedKeys] = useState<string[]>(activeParent ? [activeParent.key] : [])
  const { token } = antdTheme.useToken()

  const isActive = (key: string) => location.pathname === key || location.pathname.startsWith(`${key}/`)
  const isChildActive = (item: NavItem) => item.children?.some(child => isActive(child.key)) ?? false

  const hoverHandlers = (active: boolean) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) e.currentTarget.style.background = token.colorFillTertiary
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) e.currentTarget.style.background = 'transparent'
    },
  })

  const rowBaseStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: token.marginXS,
    height: ROW_HEIGHT,
    padding: `${token.paddingXXS}px ${token.paddingSM}px ${token.paddingXXS}px ${token.paddingXXS}px`,
    borderRadius: token.borderRadiusLG,
    cursor: 'pointer',
    color: active ? token.colorPrimary : token.colorText,
    background: active ? token.colorPrimaryBg : 'transparent',
    whiteSpace: 'nowrap',
    transition: 'background 0.15s, color 0.15s',
  })

  const iconBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_BOX,
    height: ICON_BOX,
    flexShrink: 0,
    fontSize: token.fontSize,
  }

  const renderBadge = (count: number) => (
    <Flex
      align="center"
      justify="center"
      style={{
        minWidth: 18,
        height: 18,
        padding: `0 ${token.paddingXXS}px`,
        borderRadius: token.borderRadiusSM,
        background: token.colorPrimary,
        color: token.colorWhite,
        fontSize: token.fontSizeSM,
        fontWeight: token.fontWeightStrong,
        lineHeight: 1,
      }}
    >
      {count}
    </Flex>
  )

  const handleRowClick = (item: NavItem) => {
    if (item.children) {
      setExpandedKeys(keys =>
        keys.includes(item.key) ? keys.filter(k => k !== item.key) : [...keys, item.key],
      )
      return
    }
    navigate(item.key)
  }

  const Row = ({ item }: { item: NavItem }) => {
    const active = item.children ? false : isActive(item.key)
    const expanded = expandedKeys.includes(item.key)
    const highlightParent = isChildActive(item)
    // Brand row is always bold; group headers (items with a submenu) only while expanded
    const strong = item.bold || (!!item.children && expanded && !collapsed)

    const content = (
      <div
        onClick={() => handleRowClick(item)}
        style={{
          ...rowBaseStyle(active),
          ...(highlightParent && { color: token.colorPrimary }),
          ...(collapsed && { width: ROW_HEIGHT, padding: 0, justifyContent: 'center' }),
        }}
        {...hoverHandlers(active)}
      >
        <div style={iconBoxStyle}>{item.icon}</div>
        {!collapsed && (
          <>
            <Text
              strong={strong}
              style={{
                flex: 1,
                minWidth: 0,
                color: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.label}
            </Text>
            {item.badge && renderBadge(item.badge)}
            {item.children && (
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{
                  fontSize: token.fontSizeSM,
                  color: token.colorTextTertiary,
                  transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.15s',
                }}
              />
            )}
          </>
        )}
      </div>
    )

    // Collapsed rail: submenus open as a Popover flyout instead of inline expansion.
    if (collapsed) {
      if (item.children) {
        return (
          <Popover
            placement="rightTop"
            trigger="hover"
            arrow={false}
            styles={{ container: { padding: token.paddingXXS } }}
            content={
              <Flex vertical style={{ minWidth: 180 }}>
                {item.children.map(child => (
                  <SubRow key={child.key} item={child} />
                ))}
              </Flex>
            }
          >
            {content}
          </Popover>
        )
      }
      return (
        <Tooltip title={item.label} placement="right">
          {content}
        </Tooltip>
      )
    }

    return (
      <>
        {content}
        {item.children && expanded && (
          <Flex style={{ paddingBottom: token.paddingXS }}>
            {/* Vertical guide line, centered under the parent icon */}
            <Flex justify="center" style={{ width: ICON_BOX, marginLeft: token.paddingXXS, flexShrink: 0 }}>
              <div style={{ width: token.lineWidth, background: token.colorBorderSecondary }} />
            </Flex>
            <Flex vertical style={{ flex: 1, minWidth: 0 }}>
              {item.children.map(child => (
                <SubRow key={child.key} item={child} />
              ))}
            </Flex>
          </Flex>
        )}
      </>
    )
  }

  const TextMenuRow = ({
    label,
    onClick,
    active = false,
    icon,
  }: {
    label: string
    onClick: () => void
    active?: boolean
    icon?: React.ReactNode
  }) => (
    <div
      onClick={onClick}
      style={{
        ...rowBaseStyle(active),
        height: SUB_ROW_HEIGHT,
        padding: `0 ${token.paddingSM}px`,
        borderRadius: token.borderRadius,
      }}
      {...hoverHandlers(active)}
    >
      {icon && <div style={{ ...iconBoxStyle, width: token.fontSizeLG, height: token.fontSizeLG }}>{icon}</div>}
      <Text
        style={{
          flex: 1,
          minWidth: 0,
          color: 'inherit',
          fontSize: token.fontSizeSM,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </Text>
    </div>
  )

  const SubRow = ({ item }: { item: NavSubItem }) => (
    <TextMenuRow label={item.label} onClick={() => navigate(item.key)} active={isActive(item.key)} />
  )

  const renderGroup = (items: NavItem[]) => (
    <Flex vertical align={collapsed ? 'center' : undefined} style={{ width: '100%' }}>
      {items.map(item => (
        <Row key={item.key} item={item} />
      ))}
    </Flex>
  )

  return (
    <div
      style={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        background: token.colorBgContainer,
        borderRight: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
        position: 'relative',
        height: '100%',
        transition: 'width 0.2s',
      }}
    >
      <Flex
        vertical
        align={collapsed ? 'center' : undefined}
        style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: token.paddingSM }}
      >
        <Flex vertical gap={token.paddingXXS} align={collapsed ? 'center' : undefined} style={{ width: '100%', flex: 1 }}>
          {renderGroup(brandItems)}
          <Divider style={{ margin: 0 }} />
          {renderGroup(globalItems)}
        </Flex>

        {/* Account footer */}
        <Popover
          placement="rightBottom"
          trigger="click"
          arrow={false}
          open={accountOpen}
          onOpenChange={setAccountOpen}
          styles={{ container: { padding: token.paddingXXS } }}
          content={
            <Flex vertical style={{ minWidth: 220 }}>
              <Flex align="center" gap={token.marginSM} style={{ padding: token.paddingXS }}>
                <img src={userAvatar} alt="Marc Lobinger" style={{ width: ROW_HEIGHT, height: ROW_HEIGHT, objectFit: 'cover', display: 'block', borderRadius: token.borderRadius }} />
                <Flex vertical>
                  <Text style={{ fontSize: token.fontSizeSM }}>Angemeldet als:</Text>
                  <Text strong>Marc Lobinger</Text>
                </Flex>
              </Flex>

              <Divider style={{ margin: `${token.marginXS}px 0` }} />

              <TextMenuRow
                label="Profil"
                icon={<FontAwesomeIcon icon={faUser} />}
                active={isActive('/profile')}
                onClick={() => {
                  setAccountOpen(false)
                  navigate('/profile')
                }}
              />
              <TextMenuRow
                label="Hilfe"
                icon={<FontAwesomeIcon icon={faCircleQuestion} />}
                active={isActive('/help')}
                onClick={() => {
                  setAccountOpen(false)
                  navigate('/help')
                }}
              />
              <TextMenuRow
                label="Abmelden"
                icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
                onClick={() => {
                  setAccountOpen(false)
                  navigate('/logout')
                }}
              />
            </Flex>
          }
        >
          <Flex
            align="center"
            gap={token.marginXS}
            style={{
              height: ROW_HEIGHT,
              padding: `${token.paddingXXS}px ${token.paddingXS}px ${token.paddingXXS}px ${token.paddingXXS}px`,
              borderRadius: token.borderRadiusLG,
              cursor: 'pointer',
              background: accountOpen ? token.colorFillTertiary : 'transparent',
              justifyContent: collapsed ? 'center' : 'flex-start',
              ...(collapsed && { width: ROW_HEIGHT, padding: 0 }),
            }}
            onMouseEnter={e => {
              if (!accountOpen) e.currentTarget.style.background = token.colorFillTertiary
            }}
            onMouseLeave={e => {
              if (!accountOpen) e.currentTarget.style.background = 'transparent'
            }}
          >
            <ProfileIcon />
            {!collapsed && (
              <Text style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Marc Lobinger
              </Text>
            )}
          </Flex>
        </Popover>
      </Flex>

      {/* Collapse toggle — floating circle on the right edge, vertically centered */}
      <Tooltip title={collapsed ? 'Navigation ausklappen' : 'Navigation einklappen'} placement="right">
        <Button
          onClick={() => setCollapsed(!collapsed)}
          size="small"
          shape="circle"
          style={{
            position: 'absolute',
            right: -11,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 20,
            minWidth: 20,
            height: 20,
            fontSize: token.fontSizeSM - 3,
            zIndex: 10,
          }}
          icon={<FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} />}
        />
      </Tooltip>
    </div>
  )
}
