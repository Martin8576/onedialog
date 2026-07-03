import { useState } from 'react'
import { Avatar, Tag, Tabs, Button, Typography, Flex, theme, Drawer, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faMerge, faPen, faTrash,
  faUser, faCircleInfo, faClockRotateLeft, faSliders,
  faToggleOn, faTags, faTag, faPhone, faCopy,
  faCheck, faPlus, faEnvelope,
} from '@fortawesome/pro-light-svg-icons'
import { faWhatsapp, faFacebook } from '@fortawesome/free-brands-svg-icons'
import { type Contact } from '../../data/contacts'
import { getUserByName } from '../../data/users'

const { Text } = Typography

// ─── shared primitives ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionHeader({ icon, label }: { icon: any; label: string }) {
  const { token } = theme.useToken()
  return (
    <Flex align="center" gap={8} style={{ marginBottom: token.marginSM }}>
      <FontAwesomeIcon icon={icon} style={{ color: token.colorTextSecondary, fontSize: token.fontSize }} />
      <Text strong>{label}</Text>
    </Flex>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div style={{ marginBottom: token.marginXS }}>
      <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block', marginBottom: 2 }}>{label}</Text>
      <div>{children}</div>
    </div>
  )
}

// ─── tab content ──────────────────────────────────────────────────────────────

function TabInformation({ contact }: { contact: Contact }) {
  const { token } = theme.useToken()
  const assigneeUser = getUserByName(contact.assignee)

  return (
    <div style={{ padding: `${token.paddingMD}px ${token.paddingLG}px`, display: 'flex', flexDirection: 'column', gap: token.marginSM }}>
      {/* Kunde */}
      <div style={{ background: token.colorBgContainer, borderRadius: token.borderRadius, padding: token.padding }}>
        <SectionHeader icon={faUser} label="Kunde" />
        <Flex justify="space-between" align="flex-start" gap={token.marginSM}>
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: token.fontSizeLG, display: 'block', marginBottom: token.marginXS }}>
              {contact.firstName} {contact.lastName}
            </Text>
            {contact.birthDate && <InfoRow label="Geburtsdatum">{contact.birthDate}</InfoRow>}
            {contact.phone && (
              <InfoRow label="Telefon">
                <Flex align="center" gap={token.marginXS}>
                  <Text>{contact.phone}</Text>
                  <FontAwesomeIcon icon={faPhone} style={{ color: token.colorTextSecondary, cursor: 'pointer' }} />
                </Flex>
              </InfoRow>
            )}
          </div>
          {contact.img && (
            <Avatar src={contact.img} shape="square" size={64} style={{ flexShrink: 0, borderRadius: token.borderRadius }} />
          )}
        </Flex>
      </div>

      {/* Kontakt-Attribute */}
      <div style={{ background: token.colorBgContainer, borderRadius: token.borderRadius, padding: token.padding }}>
        <SectionHeader icon={faCircleInfo} label="Kontakt-Attribute" />
        {contact.company && <InfoRow label="Firma"><Text>{contact.company}</Text></InfoRow>}
        {contact.contracts !== undefined && <InfoRow label="Verträge"><Text>{contact.contracts}</Text></InfoRow>}
        <InfoRow label="VIP-Kunde"><Text>{contact.isVip ? 'Ja' : 'Nein'}</Text></InfoRow>
        {contact.leadQualification.length > 0 && (
          <InfoRow label="Lead-Qualifizierung">
            <Flex gap={4} wrap="wrap">
              {contact.leadQualification.map(l => (
                <Tag key={l} style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}>{l}</Tag>
              ))}
            </Flex>
          </InfoRow>
        )}
      </div>

      {/* Letzte Aktion */}
      {contact.lastAction && (
        <div style={{ background: token.colorBgContainer, borderRadius: token.borderRadius, padding: token.padding }}>
          <SectionHeader icon={faClockRotateLeft} label="Letzte Aktion" />
          <Text strong style={{ fontSize: token.fontSizeSM, display: 'block' }}>{contact.lastAction.date}</Text>
          <Text style={{ display: 'block', marginTop: 2 }}>{contact.lastAction.title}</Text>
          {contact.lastAction.subtitle && (
            <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block' }}>
              {contact.lastAction.subtitle}
            </Text>
          )}
          <Flex align="center" gap={4} style={{ marginTop: token.marginXS }}>
            <FontAwesomeIcon icon={faCheck} style={{ color: token.colorTextTertiary, fontSize: token.fontSizeSM }} />
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              {contact.lastAction.status === 'read' ? 'Gelesen' : 'Ungelesen'}
            </Text>
          </Flex>
        </div>
      )}

      {/* Weitere Informationen */}
      <div style={{ background: token.colorBgContainer, borderRadius: token.borderRadius, padding: token.padding }}>
        <SectionHeader icon={faSliders} label="Weitere Informationen" />
        <InfoRow label="Ansprechpartner">
          <Flex align="center" gap={6}>
            {assigneeUser && <Avatar src={assigneeUser.img} size={20} />}
            <Text>{contact.assignee}</Text>
          </Flex>
        </InfoRow>
        <InfoRow label="Status"><Text>{contact.status}</Text></InfoRow>
        <InfoRow label="Sprache"><Text>{contact.language}</Text></InfoRow>
        <InfoRow label="Adresse">
          <Flex align="flex-start" justify="space-between" gap={token.marginXS}>
            <Text>{contact.address}</Text>
            <FontAwesomeIcon icon={faCopy} style={{ color: token.colorTextTertiary, cursor: 'pointer', flexShrink: 0 }} />
          </Flex>
        </InfoRow>
      </div>

      {/* Opt-In */}
      <div style={{ background: token.colorBgContainer, borderRadius: token.borderRadius, padding: token.padding }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: token.marginSM }}>
          <SectionHeader icon={faToggleOn} label="Opt-In" />
          <FontAwesomeIcon icon={faPen} style={{ color: token.colorTextTertiary, cursor: 'pointer', fontSize: token.fontSizeSM }} />
        </Flex>
        <InfoRow label="Online"><Text>{contact.optInOnline}</Text></InfoRow>
        <InfoRow label="Allgemein">
          <Text>{contact.optIn === 'yes' ? 'Erteilt' : contact.optIn === 'no' ? 'Verweigert' : 'Keine Angabe'}</Text>
        </InfoRow>
      </div>

      {/* Labels und Tags */}
      {(contact.labelTags.length > 0 || contact.tags.length > 0) && (
        <div style={{ background: token.colorBgContainer, borderRadius: token.borderRadius, padding: token.padding }}>
          <SectionHeader icon={faTags} label="Labels und Tags" />
          {contact.labelTags.length > 0 && (
            <InfoRow label="Label">
              <Flex gap={4} wrap="wrap">
                {contact.labelTags.map(l => (
                  <Tag key={l} icon={<FontAwesomeIcon icon={faTag} style={{ marginRight: 4 }} />}
                    style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}>
                    {l}
                  </Tag>
                ))}
              </Flex>
            </InfoRow>
          )}
          {contact.tags.length > 0 && (
            <InfoRow label="Tags">
              <Flex gap={4} wrap="wrap">
                {contact.tags.map(t => (
                  <Tag key={t} style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}>{t}</Tag>
                ))}
              </Flex>
            </InfoRow>
          )}
        </div>
      )}
    </div>
  )
}

function TabCases({ contact }: { contact: Contact }) {
  const { token } = theme.useToken()
  const activeCases = contact.cases.filter(c => !c.completed)

  if (activeCases.length === 0 && contact.completedCases === 0) {
    return (
      <Flex vertical align="center" justify="center" style={{ padding: token.paddingXL, gap: token.marginSM }}>
        <Text type="secondary" style={{ textAlign: 'center' }}>
          Bisher wurde kein Vorgang mit dem Kunden erstellt.
        </Text>
        <Button type="primary" size="small" icon={<FontAwesomeIcon icon={faPlus} />}>
          Dialog starten
        </Button>
      </Flex>
    )
  }

  return (
    <div style={{ padding: `${token.paddingMD}px ${token.paddingLG}px` }}>
      <Text strong style={{ display: 'block', marginBottom: token.marginSM }}>
        {activeCases.length} Aktive Vorgänge
      </Text>
      <Flex vertical gap={token.marginXS}>
        {activeCases.map(c => (
          <Flex key={c.id} justify="space-between" align="center"
            style={{ padding: '10px 14px', background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <div>
              <Text strong style={{ display: 'block' }}>{c.title}</Text>
              {c.channel && (
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{c.channel} · {c.assignees.join(', ')}</Text>
              )}
            </div>
            <Button size="small">Nachricht schreiben</Button>
          </Flex>
        ))}
      </Flex>
      {contact.completedCases > 0 && (
        <Text type="secondary" style={{ fontSize: token.fontSizeSM, marginTop: token.marginSM, display: 'block', cursor: 'pointer' }}>
          {contact.completedCases} erledigter Vorgang →
        </Text>
      )}
    </div>
  )
}

function TabTasks({ contact }: { contact: Contact }) {
  const { token } = theme.useToken()
  const activeTasks = contact.tasks.filter(t => !t.completed)

  return (
    <div style={{ padding: `${token.paddingMD}px ${token.paddingLG}px` }}>
      <Text strong style={{ display: 'block', marginBottom: token.marginSM }}>
        {activeTasks.length} Aktive Aufgaben
      </Text>
      <Flex vertical gap={token.marginXS}>
        {activeTasks.map(t => (
          <Flex key={t.id} justify="space-between" align="center"
            style={{ padding: '10px 14px', background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <div>
              <Text strong style={{ display: 'block' }}>{t.title}</Text>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                {[t.dueDate, t.assignee].filter(Boolean).join(' · ')}
              </Text>
            </div>
          </Flex>
        ))}
        {activeTasks.length === 0 && (
          <Text type="secondary">Keine aktiven Aufgaben.</Text>
        )}
      </Flex>
      {contact.completedTasks > 0 && (
        <Text type="secondary" style={{ fontSize: token.fontSizeSM, marginTop: token.marginSM, display: 'block', cursor: 'pointer' }}>
          {contact.completedTasks} erledigte Aufgaben →
        </Text>
      )}
    </div>
  )
}

function TabChannels({ contact }: { contact: Contact }) {
  const { token } = theme.useToken()
  return (
    <div style={{ padding: `${token.paddingMD}px ${token.paddingLG}px` }}>
      <Text strong style={{ display: 'block', marginBottom: token.marginSM }}>Kanäle</Text>
      <Flex vertical gap={token.marginXS}>
        {contact.channels.includes('whatsapp') && contact.phone && (
          <Flex align="center" gap={10} style={{ padding: '10px 14px', background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <FontAwesomeIcon icon={faWhatsapp} style={{ color: '#25D366', fontSize: token.fontSizeXL }} />
            <Text>{contact.phone}</Text>
          </Flex>
        )}
        {contact.channels.includes('facebook') && contact.facebookHandle && (
          <Flex align="center" gap={10} style={{ padding: '10px 14px', background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <FontAwesomeIcon icon={faFacebook} style={{ color: '#1877F2', fontSize: token.fontSizeXL }} />
            <Text>{contact.facebookHandle}</Text>
          </Flex>
        )}
        {contact.channels.includes('email') && (
          <Flex align="center" gap={10} style={{ padding: '10px 14px', background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeXL }} />
            <Text type="secondary">Keine E-Mail hinterlegt</Text>
          </Flex>
        )}
        {contact.channels.includes('phone') && contact.phone && !contact.channels.includes('whatsapp') && (
          <Flex align="center" gap={10} style={{ padding: '10px 14px', background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <FontAwesomeIcon icon={faPhone} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeXL }} />
            <Text>{contact.phone}</Text>
          </Flex>
        )}
      </Flex>
    </div>
  )
}

function TabActions({ contact }: { contact: Contact }) {
  const { token } = theme.useToken()

  if (contact.actions.length === 0) {
    return (
      <Flex vertical align="center" justify="center" style={{ padding: token.paddingXL, gap: token.marginSM }}>
        <Text type="secondary" style={{ textAlign: 'center' }}>
          Noch keine Aktionen vorhanden.
        </Text>
      </Flex>
    )
  }

  return (
    <div style={{ padding: `${token.paddingMD}px ${token.paddingLG}px` }}>
      {contact.actions.map((action, i) => (
        <Flex key={i} gap={token.marginSM} style={{ paddingBottom: token.paddingMD, position: 'relative' }}>
          {i < contact.actions.length - 1 && (
            <div style={{
              position: 'absolute', left: 80, top: 20, bottom: 0,
              width: 1, background: token.colorBorderSecondary,
            }} />
          )}
          <Text type="secondary" style={{ fontSize: token.fontSizeSM, minWidth: 80, paddingTop: 2, flexShrink: 0 }}>
            {action.date}
          </Text>
          <div style={{ flex: 1 }}>
            <Text strong style={{ fontSize: token.fontSizeSM, display: 'block' }}>{action.type}</Text>
            <Text>{action.title}</Text>
            {action.actor && (
              <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block' }}>{action.actor}</Text>
            )}
          </div>
        </Flex>
      ))}
    </div>
  )
}

// ─── sidebar ─────────────────────────────────────────────────────────────────

interface ContactSidebarProps {
  contact: Contact | null
  open: boolean
  onClose: () => void
  onMerge?: () => void
  getContainer?: () => HTMLElement
}

export default function ContactSidebar({ contact, open, onClose, onMerge, getContainer }: ContactSidebarProps) {
  const { token } = theme.useToken()
  const [activeTab, setActiveTab] = useState('information')

  const tabItems = [
    { key: 'information', label: 'Informationen' },
    { key: 'cases', label: 'Vorgänge' },
    { key: 'tasks', label: 'Aufgaben' },
    { key: 'channels', label: 'Kanäle' },
    { key: 'actions', label: 'Aktionen' },
  ]

  function renderContent() {
    if (!contact) return null
    switch (activeTab) {
      case 'information': return <TabInformation contact={contact} />
      case 'cases': return <TabCases contact={contact} />
      case 'tasks': return <TabTasks contact={contact} />
      case 'channels': return <TabChannels contact={contact} />
      case 'actions': return <TabActions contact={contact} />
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      closable={false}
      title={null}
      mask={false}
      getContainer={getContainer}
      rootStyle={{ position: 'absolute' }}
      footer={<Button type="primary">Nachricht schreiben</Button>}
      styles={{
        wrapper: { width: 560 },
        body: {
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: token.colorBgLayout,
        },
        footer: {
          display: 'Flex',
          justifyContent: 'flex-end',
          padding: `${token.paddingSM}px ${token.paddingLG}px`,
          borderTop: `1px solid ${token.colorBorder}`,
          background: token.colorBgLayout,
        },
      }}
    >
      {contact && (
        <>
          {/* Header */}
          <div style={{ padding: `${token.paddingSM}px ${token.paddingSM}px 0 ${token.paddingSM}px`, borderBottom: `1px solid ${token.colorBorder}` }}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={token.marginXS}>
                <Tooltip title="Schließen">
                  <Button variant="text" color="default" onClick={onClose} icon={<FontAwesomeIcon icon={faXmark} />} />
                </Tooltip>
                <Text strong style={{ fontSize: token.fontSizeLG }}>{contact.firstName} {contact.lastName}</Text>
              </Flex>
              <Flex align="center">
                <Tooltip title="Löschen">
                  <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faTrash} />} />
                </Tooltip>
                <Tooltip title="Zusammenführen">
                  <Button variant="text" color="default" onClick={onMerge} icon={<FontAwesomeIcon icon={faMerge} />} />
                </Tooltip>
                <Tooltip title="Bearbeiten">
                  <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faPen} />} />
                </Tooltip>
              </Flex>
            </Flex>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              style={{ marginBottom: 0, paddingLeft: token.paddingSM }}
              tabBarStyle={{ margin: 0 }}
              items={tabItems}
            />
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderContent()}
          </div>
        </>
      )}
    </Drawer>
  )
}
