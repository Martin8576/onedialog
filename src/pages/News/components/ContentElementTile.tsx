import { useState } from 'react'
import { Flex, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDraggable } from '@dnd-kit/core'
import type { ContentElementType } from '../../../data/news/types'
import { elementMeta } from './meta'

const { Text } = Typography

export type ContentElementTileState = 'default' | 'hover' | 'dragging'

/** Visual tile (no drag logic) – also used inside the DragOverlay. */
export function ContentElementTileView({ type, state = 'default' }: { type: ContentElementType; state?: ContentElementTileState }) {
  const { token } = theme.useToken()
  const meta = elementMeta[type]
  const background =
    state === 'dragging' ? token.colorGrey20 : state === 'hover' ? token.colorGrey6 : token.colorBgContainer

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={token.marginSM}
      style={{
        height: 80,
        paddingTop: token.paddingXS,
        background,
        border: `${token.lineWidth}px solid ${token.colorGrey16}`,
        borderRadius: token.borderRadius,
        cursor: state === 'dragging' ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: `background ${token.motionDurationMid}`,
      }}
    >
      <FontAwesomeIcon icon={meta.icon} style={{ fontSize: 20, color: token.colorText }} />
      <Text style={{ fontSize: token.fontSizeSM }}>{meta.label}</Text>
    </Flex>
  )
}

export interface ContentElementTileProps {
  type: ContentElementType
  /** Click adds the element at the end of the content. */
  onAdd: (type: ContentElementType) => void
}

/** Draggable palette tile for a content element type. */
export default function ContentElementTile({ type, onAdd }: ContentElementTileProps) {
  const [hovered, setHovered] = useState(false)
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { from: 'palette', type },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onAdd(type)}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <ContentElementTileView type={type} state={isDragging ? 'dragging' : hovered ? 'hover' : 'default'} />
    </div>
  )
}
