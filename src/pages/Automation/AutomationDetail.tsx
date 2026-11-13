import { useId, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Dropdown, Flex, Select, Tooltip, Typography, theme, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft, faCircleCheck, faEllipsisVertical,
  faCopy, faBoxArchive, faTrash,
} from '@fortawesome/pro-light-svg-icons'
import { ReactFlow, Background, Controls, useEdgesState, useNodesState, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { TabSidebar, Widget, WidgetItem, VersionTag, buildVersionHistory } from '../../designsystem/components'
import { getAutomationById, createBlankAutomation, type AutomationNode } from '../../data/automations'
import { nodeTypes, type FlowNodeData } from './flowNodeTypes'

const { Text } = Typography

function toFlowNode(node: AutomationNode): Node<FlowNodeData> {
  return {
    id: node.id,
    type: node.type,
    position: node.position,
    data: { nodeType: node.type, title: node.title, lines: node.lines },
  }
}

export default function AutomationDetail() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isCreate = !id
  const generatedId = useId()
  const automation = useMemo(
    () => (isCreate ? createBlankAutomation(`auto-${generatedId}`) : getAutomationById(id!)),
    [id, isCreate, generatedId],
  )

  const [nodes, , onNodesChange] = useNodesState<Node<FlowNodeData>>(
    (automation?.nodes ?? []).map(toFlowNode),
  )
  const [edges, , onEdgesChange] = useEdgesState<Edge>(automation?.edges ?? [])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  if (!automation) {
    return (
      <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
        <Text type="secondary">Automatisierung nicht gefunden.</Text>
      </Flex>
    )
  }

  const selectedNode = automation.nodes.find(n => n.id === selectedNodeId)

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Flex
        align="center"
        justify="space-between"
        style={{
          minHeight: 60,
          padding: `0 ${token.paddingLG}px`,
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
              onClick={() => navigate('/automation/automations')}
            />
          </Tooltip>
          <Text strong style={{ fontSize: token.fontSizeHeading5 }}>
            {automation.name || 'Neue Automatisierung'}
          </Text>
          {!isCreate && (
            <VersionTag
              major={automation.versionMajor}
              minor={automation.versionMinor}
              status={automation.status}
              versions={buildVersionHistory({ major: automation.versionMajor, minor: automation.versionMinor, status: automation.status })}
            />
          )}
          {!isCreate && (
            <Flex align="center" gap={token.marginXXS} style={{ color: token.colorSuccess }}>
              <FontAwesomeIcon icon={faCircleCheck} />
              <Text style={{ color: token.colorSuccess }}>Gespeichert</Text>
            </Flex>
          )}
        </Flex>

        <Flex align="center" gap={token.marginXS}>
          <Select value={automation.configuration} style={{ width: 180 }} options={[{ value: automation.configuration, label: automation.configuration }]} />
          {!isCreate && (
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
          )}
          <Button onClick={() => message.info('Testen ist in diesem Prototyp nicht verfügbar.')}>Testen</Button>
          <Button onClick={() => setSettingsOpen(true)}>Einstellungen</Button>
          <Button type="primary" onClick={() => message.success('Automatisierung wurde veröffentlicht')}>
            Veröffentlichen
          </Button>
        </Flex>
      </Flex>

      <Flex ref={containerRef} style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color={token.colorBorderSecondary} gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>

        <TabSidebar
          open={!!selectedNode}
          onClose={() => setSelectedNodeId(null)}
          getContainer={() => containerRef.current!}
          title={selectedNode?.title ?? ''}
          tabs={[
            {
              key: 'details',
              label: 'Details',
              content: (
                <Flex vertical style={{ padding: token.paddingLG }}>
                  <Widget
                    title="Konfiguration"
                    content={
                      <Flex vertical>
                        {selectedNode?.lines.map((line, i) => (
                          <WidgetItem key={i} value={line} />
                        ))}
                      </Flex>
                    }
                  />
                </Flex>
              ),
            },
          ]}
        />

        <TabSidebar
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          getContainer={() => containerRef.current!}
          title="Einstellungen"
          tabs={[
            {
              key: 'informationen',
              label: 'Informationen',
              content: (
                <Flex vertical style={{ padding: token.paddingLG }}>
                  <Widget
                    title="Informationen"
                    content={
                      <Flex vertical>
                        <WidgetItem label="Name" value={automation.name || '–'} />
                        <WidgetItem label="Konfiguration" value={automation.configuration} />
                      </Flex>
                    }
                  />
                </Flex>
              ),
            },
            {
              key: 'einstellungen',
              label: 'Einstellungen',
              content: (
                <Flex vertical style={{ padding: token.paddingLG }}>
                  <Widget title="Einstellungen" content={<WidgetItem value="Keine weiteren Einstellungen" />} />
                </Flex>
              ),
            },
            {
              key: 'empfaenger',
              label: 'Empfänger',
              content: (
                <Flex vertical style={{ padding: token.paddingLG }}>
                  <Widget title="Empfänger" content={<WidgetItem value="Alle Kontakte" />} />
                </Flex>
              ),
            },
            {
              key: 'analytics',
              label: 'Analytics',
              content: (
                <Flex vertical style={{ padding: token.paddingLG }}>
                  <Widget title="Analytics" content={<WidgetItem value="Keine Daten in diesem Prototyp" />} />
                </Flex>
              ),
            },
          ]}
        />
      </Flex>
    </Flex>
  )
}
