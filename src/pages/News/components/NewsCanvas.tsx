import { Flex, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer } from '@fortawesome/pro-light-svg-icons'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { ContentElement } from '../../../data/news/types'
import CanvasElement from './CanvasElement'
import type { PreviewDevice } from './NewsRenderer'

const { Text } = Typography

export const CANVAS_DROPPABLE_ID = 'news-canvas'

/** Index the palette item would be inserted at (`content.length` = end). */
export type DropIndex = number | null

export interface NewsCanvasProps {
  content: ContentElement[]
  device: PreviewDevice
  selectedId?: string
  dropIndex: DropIndex
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

/** Editable preview: sortable list of content elements and drop target for palette tiles. */
export default function NewsCanvas({ content, device, selectedId, dropIndex, onEdit, onDuplicate, onDelete }: NewsCanvasProps) {
  const { token } = theme.useToken()
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID })

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 240,
        paddingTop: token.paddingLG,
        paddingBottom: token.paddingXL,
      }}
    >
      {content.length === 0 ? (
        <Flex
          vertical
          align="center"
          justify="center"
          gap={token.marginXS}
          style={{
            height: 240,
            border: `${token.lineWidth * 2}px dashed ${isOver ? token.colorPrimary : token.colorGrey30}`,
            borderRadius: token.borderRadiusLG,
            background: isOver ? token.colorPrimaryBg : 'transparent',
            color: token.colorTextTertiary,
          }}
        >
          <FontAwesomeIcon icon={faArrowPointer} style={{ fontSize: token.fontSizeHeading4 }} />
          <Text type="secondary">Inhaltselemente hierher ziehen</Text>
        </Flex>
      ) : (
        <SortableContext items={content.map(el => el.id)} strategy={verticalListSortingStrategy}>
          <Flex vertical gap={token.marginLG}>
            {content.map((el, index) => (
              <CanvasElement
                key={el.id}
                element={el}
                device={device}
                selected={el.id === selectedId}
                dropIndicator={
                  dropIndex === index
                    ? 'before'
                    : dropIndex === content.length && index === content.length - 1
                      ? 'after'
                      : undefined
                }
                onEdit={() => onEdit(el.id)}
                onDuplicate={() => onDuplicate(el.id)}
                onDelete={() => onDelete(el.id)}
              />
            ))}
          </Flex>
        </SortableContext>
      )}
    </div>
  )
}
