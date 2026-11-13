import { Avatar, Tag, Button, Typography, Flex, theme } from 'antd'
import { TabSidebar, ChannelIcon } from '../../designsystem/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMerge, faPen, faTrash,
  faUser, faCircleInfo, faClockRotateLeft, faSliders,
  faToggleOn, faTags, faTag, faPhone, faCopy,
  faCheck, faPlus,
} from '@fortawesome/pro-light-svg-icons'
import { type Contact } from '../../data/contacts'
import { getUserByName } from '../../data/users'

const { Text } = Typography

// ─── shared primitives ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SectionHeader({ icon, label }: { icon: any; label: string }) {
  const { token } = theme.useToken()
  return (
    <Flex align="center" gap={token.marginXS} style={{ marginBottom: token.marginSM }}>
      <FontAwesomeIcon icon={icon} style={{ color: token.colorTextSecondary, fontSize: token.fontSize }} />
      <Text strong>{label}</Text>
    </Flex>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div style={{ marginBottom: token.marginXS }}>
      <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block', marginBottom: token.marginXXS }}>{label}</Text>
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
            <Flex gap={token.marginXXS} wrap="wrap">
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
          <Text style={{ display: 'block', marginTop: token.marginXXS }}>{contact.lastAction.title}</Text>
          {contact.lastAction.subtitle && (
            <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block' }}>
              {contact.lastAction.subtitle}
            </Text>
          )}
          <Flex align="center" gap={token.marginXXS} style={{ marginTop: token.marginXS }}>
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
          <Flex align="center" gap={token.marginXS}>
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
              <Flex gap={token.marginXXS} wrap="wrap">
                {contact.labelTags.map(l => (
                  <Tag key={l} icon={<FontAwesomeIcon icon={faTag} style={{ marginRight: token.marginXXS }} />}
                    style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}>
                    {l}
                  </Tag>
                ))}
              </Flex>
            </InfoRow>
          )}
          {contact.tags.length > 0 && (
            <InfoRow label="Tags">
              <Flex gap={token.marginXXS} wrap="wrap">
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
            style={{ padding: `${token.paddingXS + token.marginXXS}px ${token.paddingSM + token.marginXXS}px`, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
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
            style={{ padding: `${token.paddingXS + token.marginXXS}px ${token.paddingSM + token.marginXXS}px`, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
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
          <Flex align="center" gap={token.marginSM} style={{ padding: `${token.paddingXS + token.marginXXS}px ${token.paddingSM + token.marginXXS}px`, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <ChannelIcon channel="whatsapp" size={token.fontSizeXL} />
            <Text>{contact.phone}</Text>
          </Flex>
        )}
        {contact.channels.includes('facebook') && contact.facebookHandle && (
          <Flex align="center" gap={token.marginSM} style={{ padding: `${token.paddingXS + token.marginXXS}px ${token.paddingSM + token.marginXXS}px`, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <ChannelIcon channel="facebook" size={token.fontSizeXL} />
            <Text>{contact.facebookHandle}</Text>
          </Flex>
        )}
        {contact.channels.includes('email') && (
          <Flex align="center" gap={token.marginSM} style={{ padding: `${token.paddingXS + token.marginXXS}px ${token.paddingSM + token.marginXXS}px`, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
            <ChannelIcon channel="email" size={token.fontSizeXL} />
            <Text type="secondary">Keine E-Mail hinterlegt</Text>
          </Flex>
        )}
        {contact.channels.includes('phone') && contact.phone && !contact.channels.includes('whatsapp') && (
          <Flex align="center" gap={token.marginSM} style={{ padding: `${token.paddingXS + token.marginXXS}px ${token.paddingSM + token.marginXXS}px`, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
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
              position: 'absolute', left: token.paddingXL, top: token.paddingMD, bottom: 0,
              width: token.lineWidth, background: token.colorBorderSecondary,
            }} />
          )}
          <Text type="secondary" style={{ fontSize: token.fontSizeSM, minWidth: token.paddingXL, paddingTop: token.marginXXS, flexShrink: 0 }}>
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
  if (!contact) return null

  return (
    <TabSidebar
      open={open}
      onClose={onClose}
      getContainer={getContainer}
      title={`${contact.firstName} ${contact.lastName}`}
      headerActions={[
        { key: 'delete', tooltip: 'Löschen', icon: <FontAwesomeIcon icon={faTrash} /> },
        { key: 'merge', tooltip: 'Zusammenführen', icon: <FontAwesomeIcon icon={faMerge} />, onClick: onMerge },
        { key: 'edit', tooltip: 'Bearbeiten', icon: <FontAwesomeIcon icon={faPen} /> },
      ]}
      footer={<Button type="primary">Nachricht schreiben</Button>}
      defaultActiveTab="information"
      tabs={[
        { key: 'information', label: 'Informationen', content: <TabInformation contact={contact} /> },
        { key: 'cases', label: 'Vorgänge', content: <TabCases contact={contact} /> },
        { key: 'tasks', label: 'Aufgaben', content: <TabTasks contact={contact} /> },
        { key: 'channels', label: 'Kanäle', content: <TabChannels contact={contact} /> },
        { key: 'actions', label: 'Aktionen', content: <TabActions contact={contact} /> },
      ]}
    />
  )
}
