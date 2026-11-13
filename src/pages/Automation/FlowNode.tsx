import type { NodeProps } from '@xyflow/react'
import { Handle, Position } from '@xyflow/react'
import { Flex, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay, faCircleQuestion, faMessageLines, faBolt,
} from '@fortawesome/pro-light-svg-icons'
import type { AutomationNodeType } from '../../data/automations'
import type { FlowNodeData } from './flowNodeTypes'

const NODE_ICONS: Record<AutomationNodeType, typeof faPlay> = {
  start: faPlay,
  condition: faCircleQuestion,
  message: faMessageLines,
  action: faBolt,
}

const { Text } = Typography

export default function FlowNode({ data, selected }: NodeProps & { data: FlowNodeData }) {
  const { token } = theme.useToken()

  return (
    <Flex
      vertical
      style={{
        width: 260,
        background: token.colorBgContainer,
        border: `1px solid ${selected ? token.colorPrimary : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: token.paddingSM,
        boxShadow: selected ? token.boxShadow : 'none',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: token.colorTextTertiary }} />
      <Flex align="center" gap={token.marginXS} style={{ marginBottom: token.marginXXS }}>
        <FontAwesomeIcon icon={NODE_ICONS[data.nodeType]} style={{ color: token.colorPrimary, fontSize: token.fontSizeSM }} />
        <Text strong>{data.title}</Text>
      </Flex>
      <Flex vertical>
        {data.lines.map((line, i) => (
          <Text key={i} type="secondary" style={{ fontSize: token.fontSizeSM }}>{line}</Text>
        ))}
      </Flex>
      <Handle type="source" position={Position.Right} style={{ background: token.colorTextTertiary }} />
    </Flex>
  )
}
