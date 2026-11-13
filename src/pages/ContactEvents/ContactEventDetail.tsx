import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Dropdown, Flex, Modal, Select, Table, Tooltip, Typography, theme, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft, faCircleCheck, faEllipsisVertical,
  faCopy, faBoxArchive, faTrash, faShop, faUsers, faClock,
} from '@fortawesome/pro-light-svg-icons'
import { TabSidebar, Widget, WidgetItem, VersionTag, buildVersionHistory } from '../../designsystem/components'
import { getContactEventById } from '../../data/contactEvents'
import MessagePreview from './MessagePreview'
import ContactEventEditTabs from './ContactEventEditTabs'

const DEFAULT_CONFIGURATION = 'Default-Konfiguration'

const { Text, Title } = Typography

function changeLabel(percent: number): string {
  if (percent === 0) return ''
  return percent > 0 ? `+${percent}%` : `${percent}%`
}

export default function ContactEventDetail() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const containerRef = useRef<HTMLDivElement>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [handlersModalOpen, setHandlersModalOpen] = useState(false)

  const event = id ? getContactEventById(id) : undefined

  if (!event) {
    return (
      <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
        <Text type="secondary">Kunden-Event nicht gefunden.</Text>
      </Flex>
    )
  }

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Flex
        align="center"
        justify="space-between"
        style={{
          minHeight: 60,
          padding: `0 ${token.padding}px`,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={token.marginSM}>
          <Tooltip title="Zurück">
            <Button
              variant="text"
              color="default"
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
              onClick={() => navigate('/automation/contact-events')}
            />
          </Tooltip>
          <VersionTag
            major={event.versionMajor}
            minor={event.versionMinor}
            status={event.status}
            versions={buildVersionHistory({ major: event.versionMajor, minor: event.versionMinor, status: event.status })}
          />
          <Flex align="center" gap={token.marginXXS} style={{ color: token.colorSuccess }}>
            <FontAwesomeIcon icon={faCircleCheck} />
            <Text style={{ color: token.colorSuccess }}>Gespeichert</Text>
          </Flex>
        </Flex>

        <Flex align="center" gap={token.marginXS}>
          <Select
            value={DEFAULT_CONFIGURATION}
            style={{ width: 200 }}
            options={[{ value: DEFAULT_CONFIGURATION, label: DEFAULT_CONFIGURATION }]}
          />
          <Dropdown
            menu={{
              items: [
                { key: 'duplicate', label: 'Duplizieren', icon: <FontAwesomeIcon icon={faCopy} /> },
                { key: 'archive', label: 'Archivieren', icon: <FontAwesomeIcon icon={faBoxArchive} /> },
                { key: 'delete', label: 'Löschen', icon: <FontAwesomeIcon icon={faTrash} />, danger: true },
              ],
              onClick: ({ key }) => message.info(`"${key}" ist in diesem Prototyp nicht verfügbar.`),
            }}
            trigger={['click']}
          >
            <Button icon={<FontAwesomeIcon icon={faEllipsisVertical} />} />
          </Dropdown>
          <Button onClick={() => message.info('Testen ist in diesem Prototyp nicht verfügbar.')}>Testen</Button>
          <Button onClick={() => setEditOpen(true)}>Bearbeiten</Button>
          <Button type="primary" onClick={() => message.success('Kunden-Event wurde veröffentlicht')}>
            Veröffentlichen
          </Button>
        </Flex>
      </Flex>

      <Flex ref={containerRef} justify="center" style={{ flex: 1, minHeight: 0, overflow: 'auto', position: 'relative', padding: token.paddingLG }}>
        <Flex gap={token.marginLG} style={{ width: '100%', maxWidth: 1024 }}>
          <Flex vertical>
            <Widget
              title="Nachricht"
              content={
                <Flex vertical gap={token.marginXS} style={{ padding: token.paddingXS }}>
                  <Text type="secondary">Diese Nachricht wird an den Kunden verschickt.</Text>
                  <MessagePreview message={event.message} image={event.image} />
                </Flex>
              }
            />
          </Flex>

          <Flex vertical gap={token.marginSM} flex={1} style={{ flexShrink: 0 }}>
            <Widget
              title="Händler"
              icon={<FontAwesomeIcon icon={faShop} />}
              extra={
                <Text
                  onClick={() => setHandlersModalOpen(true)}
                  style={{ color: token.colorPrimary, cursor: 'pointer', fontSize: token.fontSizeSM }}
                >
                  Händlerliste anzeigen
                </Text>
              }
              content={
                <Flex vertical style={{ padding: `0 ${token.paddingXS}px ${token.paddingXS}px` }}>
                  <Flex align="baseline" gap={token.marginXS}>
                    <Title level={2} style={{ margin: 0 }}>{event.stats.handlerCount}</Title>
                    <Text type="secondary">({event.stats.handlerPercent}%)</Text>
                  </Flex>
                </Flex>
              }
            />

            <Widget
              title="Kontakte"
              icon={<FontAwesomeIcon icon={faUsers} />}
              content={
                <Flex vertical style={{ padding: `0 ${token.paddingXS}px ${token.paddingXS}px` }}>
                  <Flex align="baseline" gap={token.marginXS}>
                    <Title level={2} style={{ margin: 0 }}>{event.stats.contactCount.toLocaleString('de-DE')}</Title>
                    <Text type={event.stats.contactCountChangePercent >= 0 ? 'success' : 'danger'}>
                      {changeLabel(event.stats.contactCountChangePercent)}
                    </Text>
                  </Flex>
                  <WidgetItem label="Dauer pro Session" value={event.stats.durationPerSession} />
                  <WidgetItem label="Sessions pro Kunde" value={String(event.stats.sessionsPerContact)} />
                </Flex>
              }
            />

            <Widget
              title="Sessions"
              icon={<FontAwesomeIcon icon={faClock} />}
              content={
                <Flex vertical style={{ padding: `0 ${token.paddingXS}px ${token.paddingXS}px` }}>
                  <Flex align="baseline" gap={token.marginXS}>
                    <Title level={2} style={{ margin: 0 }}>{event.stats.sessions.toLocaleString('de-DE')}</Title>
                    <Text type={event.stats.sessionsChangePercent >= 0 ? 'success' : 'danger'}>
                      {changeLabel(event.stats.sessionsChangePercent)}
                    </Text>
                  </Flex>
                  <WidgetItem label="Abgeschlossen" value={String(event.stats.sessionsCompleted)} />
                  <WidgetItem label="Aktiv" value={String(event.stats.sessionsActive)} />
                  <WidgetItem label="Fehler" value={String(event.stats.sessionsError)} />
                </Flex>
              }
            />
          </Flex>
        </Flex>

        <TabSidebar
          open={editOpen}
          onClose={() => setEditOpen(false)}
          getContainer={() => containerRef.current!}
          resetTabOnClose
          title={`${event.name} bearbeiten`}
          tabs={[
            { key: 'informationen', label: 'Informationen', content: <ContactEventEditTabs.Informationen event={event} /> },
            { key: 'nachricht', label: 'Nachricht', content: <ContactEventEditTabs.Nachricht event={event} /> },
            { key: 'einstellungen', label: 'Einstellungen', content: <ContactEventEditTabs.Einstellungen event={event} /> },
            { key: 'aktionen', label: 'Aktionen', content: <ContactEventEditTabs.Aktionen event={event} /> },
          ]}
        />
      </Flex>

      <Modal
        open={handlersModalOpen}
        onCancel={() => setHandlersModalOpen(false)}
        title="Händlerliste"
        footer={null}
        width={640}
      >
        <Table
          rowKey="id"
          dataSource={event.handlers}
          pagination={false}
          columns={[
            { title: 'Händler', dataIndex: 'name' },
            { title: 'Stadt', dataIndex: 'city' },
            { title: 'Kontakte', dataIndex: 'contactCount', align: 'right' },
          ]}
        />
      </Modal>
    </Flex>
  )
}
