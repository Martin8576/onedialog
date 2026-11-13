import type { AutomationNodeType } from '../../data/automations'
import FlowNode from './FlowNode'

export type FlowNodeData = {
  nodeType: AutomationNodeType
  title: string
  lines: string[]
}

export const nodeTypes = {
  start: FlowNode,
  condition: FlowNode,
  message: FlowNode,
  action: FlowNode,
}
