import { useMemo, useState } from 'react'
import { Flex, Segmented, Tag, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShop, faUsers } from '@fortawesome/pro-light-svg-icons'
import { Header } from '../../designsystem/sharedComponents'
import { ListItem } from '../../designsystem/components'
import { contactEvents, type ContactEventStatus } from '../../data/contactEvents'

const STATUS_LABELS: Record<ContactEventStatus, string> = {
  live: 'Live',
  draft: 'Entwurf',
  archived: 'Archiviert',
}

export default function ContactEvents() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [status, setStatus] = useState<ContactEventStatus>('live')

  const filteredEvents = useMemo(
    () => contactEvents.filter(e => e.status === status),
    [status],
  )

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Header
        title="Kontakt-Events"
        tabs={
          <Segmented
            value={status}
            options={(['live', 'draft', 'archived'] as ContactEventStatus[]).map(s => ({
              label: STATUS_LABELS[s],
              value: s,
            }))}
            onChange={value => setStatus(value as ContactEventStatus)}
          />
        }
        addButton
        addButtonText="Kontakt-Event hinzufügen"
        onAdd={() => navigate('/automation/contact-events/new')}
      />

      <Flex style={{ width: '100%', minHeight: 0, padding: token.paddingLG, overflow: 'auto', height: '100%' }}>
        <Flex vertical gap={token.marginSM} style={{ flex: 1, maxWidth: 1024 }}>
          {filteredEvents.map(event => (
            <ListItem
              key={event.id}
              onClick={() => navigate(`/automation/contact-events/${event.id}`)}
              avatar={event.image}
              title={event.name}
              description={event.description}
              tags={
                <>
                  <Tag icon={<FontAwesomeIcon icon={faShop} />}>{event.stats.handlerCount}</Tag>
                  <Tag icon={<FontAwesomeIcon icon={faUsers} />}>
                    {event.stats.contactCount.toLocaleString('de-DE')}
                  </Tag>
                </>
              }
              arrow
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
