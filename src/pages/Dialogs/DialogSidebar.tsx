import { useState } from 'react'
import {
  Avatar, Button, Flex, Tag, Typography, theme, Tooltip, Badge,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft, faChevronRight,
  faCircleInfo, faUser, faClockRotateLeft,
  faSquareCheck, faFile, faComment,
  faWifi, faTv, faCloud, faMobile, faPhone,
  faTag, faPlus, faXmark, faLocationDot,
  faDownload, faMagnifyingGlass,
} from '@fortawesome/pro-light-svg-icons'
import { ChannelIcon } from '../../designsystem/components'
import { type Dialog } from '../../data/dialogs'

const { Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productIcons: Record<string, any> = {
  Internet: faWifi,
  TV: faTv,
  Cloud: faCloud,
  Mobilfunk: faMobile,
  Festnetz: faPhone,
}

function CardHeader({
  icon,
  title,
  action,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  title: string
  action?: React.ReactNode
}) {
  const { token } = theme.useToken()
  return (
    <Flex align="center" justify="space-between" style={{ marginBottom: token.marginSM }}>
      <Flex align="center" gap={token.marginXS}>
        <FontAwesomeIcon icon={icon} style={{ color: token.colorTextSecondary, fontSize: token.fontSize }} />
        <Text strong>{title}</Text>
      </Flex>
      {action}
    </Flex>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div style={{ marginBottom: token.marginXS }}>
      <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block', marginBottom: token.marginXXS }}>
        {label}
      </Text>
      {children}
    </div>
  )
}

function SidebarCard({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div
      style={{
        background: token.colorBgContainer,
        borderRadius: token.borderRadius,
        padding: token.padding,
        marginBottom: token.marginSM,
      }}
    >
      {children}
    </div>
  )
}

function ExpandedContent({ dialog }: { dialog: Dialog }) {
  const { token } = theme.useToken()
  const [showCompleted, setShowCompleted] = useState(false)

  return (
    <div style={{ padding: token.paddingSM, overflowY: 'auto', flex: 1 }}>
      {/* Vorgang */}
      <SidebarCard>
        <CardHeader icon={faCircleInfo} title="Vorgang" />
        <InfoRow label="Name"><Text>{dialog.title}</Text></InfoRow>
        <InfoRow label="Produkt">
          <Flex align="center" gap={token.marginXS}>
            <FontAwesomeIcon
              icon={productIcons[dialog.product] ?? faMobile}
              style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}
            />
            <Text>{dialog.product}</Text>
          </Flex>
        </InfoRow>
        <InfoRow label="Kundenart">
          <Flex align="center" gap={token.marginXS}>
            <FontAwesomeIcon icon={faUser} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
            <Text>{dialog.customerType}</Text>
          </Flex>
        </InfoRow>
        {dialog.labels.length > 0 && (
          <InfoRow label="Labels">
            <Flex gap={token.marginXXS} wrap="wrap" align="center">
              {dialog.labels.map(l => (
                <Tag
                  key={l}
                  closable
                  closeIcon={<FontAwesomeIcon icon={faXmark} style={{ fontSize: 10 }} />}
                  style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}
                >
                  {l}
                </Tag>
              ))}
              <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faPlus} />} />
            </Flex>
          </InfoRow>
        )}
        <InfoRow label="Eingehender Kanal">
          <Flex align="center" gap={token.marginXS}>
            <ChannelIcon channel="whatsapp" size={token.fontSizeSM} />
            <Text>{dialog.incomingChannel}</Text>
          </Flex>
        </InfoRow>
        <InfoRow label="Eingehendes Team">
          <Flex align="center" gap={token.marginXS}>
            <FontAwesomeIcon icon={faLocationDot} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
            <Text>{dialog.team}</Text>
          </Flex>
        </InfoRow>
        <InfoRow label="Besitzer des Vorgangs">
          <Flex align="center" gap={token.marginXS}>
            <Avatar src={dialog.ownerImg} size={20} />
            <Text>{dialog.owner}</Text>
          </Flex>
        </InfoRow>
      </SidebarCard>

      {/* Kunde */}
      <SidebarCard>
        <CardHeader icon={faUser} title="Kunde" />
        <Flex justify="space-between" align="flex-start" gap={token.marginSM} style={{ marginBottom: token.marginSM }}>
          <Text strong style={{ fontSize: token.fontSizeLG }}>
            {dialog.contactFirstName} {dialog.contactLastName}
          </Text>
          {dialog.contactImg && (
            <Avatar src={dialog.contactImg} shape="square" size={56} style={{ borderRadius: token.borderRadius, flexShrink: 0 }} />
          )}
        </Flex>
        {dialog.birthDate && (
          <InfoRow label="Geburtsdatum">
            <Text>{dialog.birthDate}{dialog.birthDateNote ? ` (${dialog.birthDateNote})` : ''}</Text>
          </InfoRow>
        )}
        {dialog.address && (
          <InfoRow label="Adresse"><Text>{dialog.address}</Text></InfoRow>
        )}
        {dialog.contactPerson && (
          <InfoRow label="Ansprechpartner">
            <Flex align="center" gap={token.marginXS}>
              {dialog.contactPersonImg && <Avatar src={dialog.contactPersonImg} size={20} />}
              <Text>{dialog.contactPerson}</Text>
            </Flex>
          </InfoRow>
        )}
        {(dialog.contactLabels ?? []).length > 0 && (
          <InfoRow label="Label">
            <Flex gap={token.marginXXS} wrap="wrap" align="center">
              {(dialog.contactLabels ?? []).map(l => (
                <Tag
                  key={l}
                  icon={<FontAwesomeIcon icon={faTag} style={{ marginRight: token.marginXXS }} />}
                  closable
                  closeIcon={<FontAwesomeIcon icon={faXmark} style={{ fontSize: 10 }} />}
                  style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}
                >
                  {l}
                </Tag>
              ))}
              <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faPlus} />} />
            </Flex>
          </InfoRow>
        )}
        {(dialog.contactTags ?? []).length > 0 && (
          <InfoRow label="Tags">
            <Flex gap={token.marginXXS} wrap="wrap">
              {(dialog.contactTags ?? []).map(t => (
                <Tag key={t} style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}>
                  {t}
                </Tag>
              ))}
            </Flex>
          </InfoRow>
        )}
        <Button type="link" style={{ padding: 0, height: 'auto' }}>
          Mehr Informationen <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: token.fontSizeSM }} />
        </Button>
      </SidebarCard>

      {/* Letzte Aktionen */}
      {dialog.actions.length > 0 && (
        <SidebarCard>
          <CardHeader
            icon={faClockRotateLeft}
            title="Letzte Aktionen"
            action={
              <Tooltip title="Aktion hinzufügen">
                <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faPlus} />} />
              </Tooltip>
            }
          />
          <Flex vertical gap={token.marginSM}>
            {dialog.actions.map((action, i) => (
              <div key={i}>
                <Text strong style={{ fontSize: token.fontSizeSM, display: 'block' }}>{action.date}</Text>
                <Text style={{ display: 'block' }}>{action.title}</Text>
                {action.subtitle && (
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block' }}>
                    {action.subtitle}
                  </Text>
                )}
              </div>
            ))}
          </Flex>
          <Button type="link" style={{ padding: 0, height: 'auto', marginTop: token.marginSM }}>
            Mehr Informationen <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: token.fontSizeSM }} />
          </Button>
        </SidebarCard>
      )}

      {/* Aufgaben */}
      {dialog.tasks.length > 0 && (
        <SidebarCard>
          <CardHeader
            icon={faSquareCheck}
            title={`${dialog.tasks.length} Aufgaben`}
            action={
              <Tooltip title="Aufgabe hinzufügen">
                <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faPlus} />} />
              </Tooltip>
            }
          />
          <Flex vertical gap={token.marginSM}>
            {dialog.tasks.map(task => (
              <Flex key={task.id} justify="space-between" align="center" gap={token.marginSM}>
                <Text style={{ flex: 1 }}>{task.title}</Text>
                <Flex align="center" gap={token.marginXS} style={{ flexShrink: 0 }}>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{task.dueDate}</Text>
                  <Avatar src={task.assigneeImg} size={20} />
                </Flex>
              </Flex>
            ))}
          </Flex>
        </SidebarCard>
      )}

      {/* Dokumente */}
      {dialog.documents.length > 0 && (
        <SidebarCard>
          <CardHeader
            icon={faFile}
            title={`${dialog.documents.length} Dokumente`}
            action={
              <Tooltip title="Alle herunterladen">
                <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faDownload} />} />
              </Tooltip>
            }
          />
          <Flex vertical gap={token.marginSM}>
            {dialog.documents.map(doc => (
              <Flex key={doc.id} align="center" gap={token.marginSM}>
                <div
                  style={{
                    width: 36,
                    height: 44,
                    background: token.colorGrey10,
                    borderRadius: token.borderRadiusSM,
                    flexShrink: 0,
                  }}
                />
                <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                  <Text ellipsis>{doc.title}</Text>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{doc.subtitle}</Text>
                </Flex>
                <Tooltip title="Anzeigen">
                  <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
                </Tooltip>
              </Flex>
            ))}
          </Flex>
        </SidebarCard>
      )}

      {/* Weitere Vorgänge */}
      {dialog.relatedDialogs.length > 0 && (
        <SidebarCard>
          <CardHeader
            icon={faSquareCheck}
            title={`${dialog.relatedDialogs.length} weitere Vorgänge`}
          />
          <Flex vertical gap={token.marginSM}>
            {dialog.relatedDialogs.map(rd => (
              <Flex key={rd.id} align="center" gap={token.marginSM}>
                <FontAwesomeIcon
                  icon={productIcons[rd.product] ?? faMobile}
                  style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}
                />
                <Text style={{ flex: 1 }} ellipsis>{rd.title}</Text>
                <Avatar src={rd.assigneeImg} size={20} />
              </Flex>
            ))}
          </Flex>
          {dialog.completedDialogsCount > 0 && (
            <Button
              type="link"
              style={{ padding: 0, height: 'auto', marginTop: token.marginSM }}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {dialog.completedDialogsCount} erledigter Vorgang
              <FontAwesomeIcon
                icon={faChevronRight}
                style={{
                  fontSize: token.fontSizeSM,
                  transform: showCompleted ? 'rotate(90deg)' : 'rotate(0deg)',
                  marginLeft: token.marginXXS,
                }}
              />
            </Button>
          )}
        </SidebarCard>
      )}
    </div>
  )
}

const COLLAPSED_WIDTH = 48
const EXPANDED_WIDTH = 320

export default function DialogSidebar({ dialog }: { dialog: Dialog | null }) {
  const { token } = theme.useToken()
  const [expanded, setExpanded] = useState(true)

  const width = expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH

  const navItems = [
    { icon: faCircleInfo, label: 'Vorgang', badge: 0 },
    { icon: faUser, label: 'Kunde', badge: 0 },
    { icon: faClockRotateLeft, label: 'Letzte Aktionen', badge: 0 },
    { icon: faSquareCheck, label: 'Aufgaben', badge: dialog?.tasks.length ?? 0 },
    { icon: faFile, label: 'Dokumente', badge: dialog?.documents.length ?? 0 },
    { icon: faComment, label: 'Weitere Vorgänge', badge: dialog?.relatedDialogs.length ?? 0 },
  ]

  return (
    <Flex
      vertical
      style={{
        width,
        flexShrink: 0,
        height: '100%',
        background: token.colorGrey6,
        borderLeft: `1px solid ${token.colorBorderSecondary}`,
        overflow: 'hidden',
        transition: 'width 0.2s ease',
      }}
    >
      <Flex
        align="center"
        justify={expanded ? 'flex-start' : 'center'}
        style={{
          padding: token.paddingSM,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Tooltip title={expanded ? 'Sidebar einklappen' : 'Sidebar ausklappen'}>
          <Button
            variant="text"
            color="default"
            size="small"
            icon={<FontAwesomeIcon icon={expanded ? faChevronRight : faChevronLeft} />}
            onClick={() => setExpanded(!expanded)}
          />
        </Tooltip>
      </Flex>

      {expanded && dialog ? (
        <ExpandedContent dialog={dialog} />
      ) : !expanded ? (
        <Flex vertical align="center" gap={token.marginSM} style={{ paddingTop: token.paddingSM }}>
          {navItems.map((item, i) => {
            const btn = (
              <Button
                variant="text"
                color="default"
                icon={<FontAwesomeIcon icon={item.icon} fixedWidth />}
                style={{ width: 32, height: 32 }}
              />
            )
            return (
              <Tooltip key={i} title={item.label} placement="left">
                {item.badge > 0 ? (
                  <Badge count={item.badge} size="small" offset={[-2, 2]}>{btn}</Badge>
                ) : btn}
              </Tooltip>
            )
          })}
        </Flex>
      ) : null}
    </Flex>
  )
}
