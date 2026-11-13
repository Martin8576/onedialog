import { Button, Typography, Flex, Tag, theme } from 'antd'
import { TabSidebar, Widget, WidgetItem } from '../../designsystem/components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen, faTrash, faGlobe, faChartLine, faListCheck,
  faCircleInfo, faWandMagicSparkles, faClipboardList,
} from '@fortawesome/pro-light-svg-icons'
import {
  type PhoneAssistant, type WebsiteKnowledgeSource,
  capabilityOptions,
} from '../../data/phoneAssistants'

const { Text } = Typography

function websiteStatusLabel(status: WebsiteKnowledgeSource['status']): string {
  if (status === 'pending') return 'Ausstehend'
  if (status === 'crawling') return 'Wird verarbeitet'
  return 'Fertig'
}

function websiteStatusColor(status: WebsiteKnowledgeSource['status']): string {
  if (status === 'done') return 'success'
  if (status === 'crawling') return 'processing'
  return 'default'
}

function getInternalProcessingTags(internal?: PhoneAssistant['internalProcessing']): string[] {
  if (!internal) return []
  return [
    internal.createCaseEnabled ? 'Vorgang erstellen' : null,
    internal.scheduleAppointmentEnabled ? 'Termin vereinbaren' : null,
    internal.createTaskEnabled ? 'Aufgabe erstellen' : null,
  ].filter((item): item is string => item !== null)
}

function TabSettings({ assistant }: { assistant: PhoneAssistant }) {
  const { token } = theme.useToken()
  const internalTags = getInternalProcessingTags(assistant.internalProcessing)

  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Informationen"
        icon={<FontAwesomeIcon icon={faCircleInfo} />}
        content={(
          <Flex vertical>
            <WidgetItem label="Name" value={assistant.name} />
            <WidgetItem
              label="Nummer und Team"
              value={`${assistant.phoneNumber} (${assistant.team})`}
            />
          </Flex>
        )}
      />

      <Widget
        title="Assistent"
        icon={<FontAwesomeIcon icon={faWandMagicSparkles} />}
        content={(
          <Flex vertical>
            <WidgetItem label="Ansprache" value={assistant.addressing === 'du' ? 'Du' : 'Sie'} />
            <WidgetItem label="Stimme" value={assistant.voice} />
            <WidgetItem label="Sprache" value={assistant.language} />
            <WidgetItem label="Einstiegsnachricht" value={assistant.greetingMessage} />
            {assistant.additionalPrompt && (
              <WidgetItem label="Anweisungen an den Assistenten" value={assistant.additionalPrompt} />
            )}
          </Flex>
        )}
      />

      <Widget
        title="Interne Bearbeitung"
        icon={<FontAwesomeIcon icon={faClipboardList} />}
        content={
          internalTags.length === 0 ? (
            <Text type="secondary">Keine interne Bearbeitung aktiv</Text>
          ) : (
            <WidgetItem
              tags={internalTags.map(item => (
                <Tag key={item} style={{ margin: 0 }}>{item}</Tag>
              ))}
            />
          )
        }
      />
    </Flex>
  )
}

function TabKnowledge({ assistant }: { assistant: PhoneAssistant }) {
  const { token } = theme.useToken()
  const activeCapabilities = capabilityOptions.filter(c => assistant.capabilities.includes(c.value))
  const website = assistant.knowledgeSources.find((s): s is WebsiteKnowledgeSource => s.type === 'website')

  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Fähigkeiten"
        icon={<FontAwesomeIcon icon={faListCheck} />}
        content={
          activeCapabilities.length === 0 ? (
            <Text type="secondary">Keine Fähigkeiten aktiviert</Text>
          ) : (
            <WidgetItem
              tags={activeCapabilities.map(cap => (
                <Tag key={cap.value} style={{ margin: 0 }}>{cap.label}</Tag>
              ))}
            />
          )
        }
      />

      <Widget
        title="Wissen"
        icon={<FontAwesomeIcon icon={faGlobe} />}
        content={
          website ? (
            <WidgetItem
              value={website.url}
              action={(
                <Tag color={websiteStatusColor(website.status)}>
                  {websiteStatusLabel(website.status)}
                </Tag>
              )}
            />
          ) : (
            <Text type="secondary">Keine Website hinterlegt</Text>
          )
        }
      />
    </Flex>
  )
}

function TabStatistics({ assistant }: { assistant: PhoneAssistant }) {
  const { token } = theme.useToken()
  return (
    <Flex vertical style={{ padding: token.paddingLG, gap: token.margin }}>
      <Widget
        title="Statistik"
        icon={<FontAwesomeIcon icon={faChartLine} />}
        content={(
          <Flex vertical gap={token.marginSM}>
            <WidgetItem
              label="Status"
              tags={(
                <Tag color={assistant.status === 'active' ? 'success' : 'default'}>
                  {assistant.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </Tag>
              )}
            />
            <WidgetItem
              label="Angenommene Anrufe"
              value={assistant.answeredCalls.toLocaleString('de-DE')}
            />
          </Flex>
        )}
      />
    </Flex>
  )
}

interface PhoneAssistantSidebarProps {
  assistant: PhoneAssistant | null
  open: boolean
  onClose: () => void
  onUpdate: (assistant: PhoneAssistant) => void
  onDelete: (id: string) => void
  onEdit: (assistant: PhoneAssistant) => void
  getContainer?: () => HTMLElement
}

export default function PhoneAssistantSidebar({
  assistant,
  open,
  onClose,
  onUpdate,
  onDelete,
  onEdit,
  getContainer,
}: PhoneAssistantSidebarProps) {
  const { token } = theme.useToken()
  if (!assistant) return null

  const isActive = assistant.status === 'active'

  function handleClose() {
    onClose()
  }

  function handleToggleStatus() {
    if (!assistant) return
    onUpdate({
      ...assistant,
      status: assistant.status === 'active' ? 'inactive' : 'active',
    })
  }

  return (
    <TabSidebar
      open={open}
      onClose={handleClose}
      getContainer={getContainer}
      resetTabOnClose
      defaultActiveTab="settings"
      title={(
        <Flex align="center" gap={token.marginXS} style={{ minWidth: 0 }}>
          <Text strong style={{ fontSize: token.fontSizeLG }} ellipsis>{assistant.name}</Text>
          <Tag color={assistant.status === 'active' ? 'success' : 'default'}>
            {assistant.status === 'active' ? 'Aktiv' : 'Inaktiv'}
          </Tag>
        </Flex>
      )}
      headerActions={[
        {
          key: 'delete',
          tooltip: 'Löschen',
          icon: <FontAwesomeIcon icon={faTrash} />,
          onClick: () => { onDelete(assistant.id); handleClose() },
        },
        {
          key: 'edit',
          tooltip: 'Bearbeiten',
          icon: <FontAwesomeIcon icon={faPen} />,
          onClick: () => onEdit(assistant),
        },
      ]}
      footer={(
        <Flex justify="flex-end">
          <Button
            type={isActive ? 'default' : 'primary'}
            onClick={handleToggleStatus}
          >
            {isActive ? 'Deaktivieren' : 'Aktivieren'}
          </Button>
        </Flex>
      )}
      tabs={[
        { key: 'settings', label: 'Einstellungen', content: <TabSettings assistant={assistant} /> },
        { key: 'knowledge', label: 'Fähigkeiten', content: <TabKnowledge assistant={assistant} /> },
        { key: 'statistics', label: 'Statistik', content: <TabStatistics assistant={assistant} /> },
      ]}
    />
  )
}
