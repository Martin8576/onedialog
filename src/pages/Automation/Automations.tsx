import { useMemo, useState } from 'react'
import { Flex, Segmented, Tag, theme } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartNetwork } from '@fortawesome/pro-light-svg-icons'
import { Header } from '../../designsystem/sharedComponents'
import { ListItem } from '../../designsystem/components'
import { automations, type AutomationStatus } from '../../data/automations'

const STATUS_LABELS: Record<AutomationStatus, string> = {
  live: 'Live',
  draft: 'Entwurf',
  archived: 'Archiviert',
}

export default function Automations() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [status, setStatus] = useState<AutomationStatus>('live')

  const filtered = useMemo(() => automations.filter(a => a.status === status), [status])

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Header
        title="Automationen"
        tabs={
          <Segmented
            value={status}
            options={(['live', 'draft', 'archived'] as AutomationStatus[]).map(s => ({
              label: STATUS_LABELS[s],
              value: s,
            }))}
            onChange={value => setStatus(value as AutomationStatus)}
          />
        }
        addButton
        addButtonText="Automation hinzufügen"
        onAdd={() => navigate('/automation/automations/new')}
      />

      <Flex style={{ width: '100%', minHeight: 0, padding: token.paddingLG, overflow: 'auto', height: '100%' }}>
        <Flex vertical gap={token.marginSM} style={{ flex: 1, maxWidth: 1024 }}>
          {filtered.map(automation => (
            <ListItem
              key={automation.id}
              onClick={() => navigate(`/automation/automations/${automation.id}`)}
              icon={<FontAwesomeIcon icon={faChartNetwork} />}
              title={automation.name}
              description={`${automation.nodes.length} Knoten`}
              tags={<Tag color={automation.status === 'live' ? 'success' : 'default'}>{STATUS_LABELS[automation.status]}</Tag>}
              arrow
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}
