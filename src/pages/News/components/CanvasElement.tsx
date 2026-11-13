import { useState } from 'react'
import type React from 'react'
import { Flex, Popover, Tooltip, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone, faEyeSlash, faGripLines, faPen, faTrash } from '@fortawesome/pro-light-svg-icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { elementVisibility, isVisibilityRestricted, type ContentElement } from '../../../data/news/types'
import { ContentElementView, type PreviewDevice } from './NewsRenderer'
import VisibilityPopoverContent from './VisibilityPopoverContent'
import { elementMeta } from './meta'

const { Text } = Typography

function ToolbarButton({ title, icon, background, onClick, ...rest }: {
  title: string
  icon: React.ComponentProps<typeof FontAwesomeIcon>['icon']
  background: string
  onClick?: () => void
} & React.HTMLAttributes<HTMLButtonElement>) {
  const { token } = theme.useToken()
  const buttonProps = rest
  return (
    <Tooltip title={title}>
      <button
        type="button"
        aria-label={title}
        onClick={e => {
          e.stopPropagation()
          onClick?.()
        }}
        {...buttonProps}
        style={{
          width: 24,
          height: 24,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          padding: 0,
          background,
          color: token.colorWhite,
          fontSize: token.fontSizeSM - 2,
          cursor: 'pointer',
          ...buttonProps.style,
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </Tooltip>
  )
}

export interface CanvasElementProps {
  element: ContentElement
  device: PreviewDevice
  selected: boolean
  /** Show a drop indicator line above this element (palette drag). */
  dropIndicator?: 'before' | 'after'
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

/** A content element inside the editor canvas: draggable as a whole, click opens the edit panel. */
export default function CanvasElement({
  element,
  device,
  selected,
  dropIndicator,
  onEdit,
  onDuplicate,
  onDelete,
}: CanvasElementProps) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: element.id,
    data: { from: 'canvas' },
  })

  const active = (hovered || selected) && !isDragging
  const visibility = elementVisibility(element)
  const restricted = !!visibility && isVisibilityRestricted(visibility)
  const meta = elementMeta[element.type]

  const indicator = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        background: token.colorPrimary,
        borderRadius: 1,
        ...(dropIndicator === 'before' ? { top: -token.marginXXS } : { bottom: -token.marginXXS }),
      }}
    />
  )

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onEdit}
      style={{
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        padding: token.paddingXS,
        borderRadius: active ? `${token.borderRadius}px` : token.borderRadius,
        outline: active ? `${token.lineWidth}px solid ${token.colorPrimary}` : `${token.lineWidth}px solid transparent`,
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: active ? 1 : undefined,
      }}
    >
      {dropIndicator && indicator}

      {active && (
        <>
          {/* Top left: name, visibility hint, delete */}
          <Flex
            align="center"
            style={{
              position: 'absolute',
              left: token.paddingXS,
              bottom: '100%',
              borderRadius: `${token.borderRadius}px ${token.borderRadius}px 0 0`,
              overflow: 'hidden',
              gap: 1,
            }}
          >
            <Flex
              align="center"
              gap={token.marginXXS}
              style={{ height: 24, padding: `0 ${token.paddingXS}px`, background: token.colorPrimary }}
            >
              <Text style={{ color: token.colorWhite, fontSize: token.fontSizeSM - 2 }}>{meta.label}</Text>
              {restricted && (
                <Popover content={<VisibilityPopoverContent visibility={visibility!} />} placement="topLeft">
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    style={{ color: token.colorWhite, fontSize: token.fontSizeSM - 2, cursor: 'help' }}
                  />
                </Popover>
              )}
            </Flex>
            <ToolbarButton title="Löschen" icon={faTrash} background={token.colorError} onClick={onDelete} />
          </Flex>

          {/* Top right: duplicate, drag, edit */}
          <Flex
            align="center"
            style={{
              position: 'absolute',
              right: token.paddingXS,
              bottom: '100%',
              gap: 1,
              background: token.colorPrimaryBorder,
              borderRadius: `${token.borderRadius}px ${token.borderRadius}px 0 0`,
              overflow: 'hidden',
            }}
          >
            <ToolbarButton title="Duplizieren" icon={faClone} background={token.colorPrimary} onClick={onDuplicate} />
            {/* The whole element is draggable; the grip is the visual hint. */}
            <ToolbarButton title="Verschieben" icon={faGripLines} background={token.colorPrimary} style={{ cursor: 'grab' }} />
            <ToolbarButton title="Bearbeiten" icon={faPen} background={token.colorPrimary} onClick={onEdit} />
          </Flex>
        </>
      )}

      {/* Content is not interactive inside the editor (links, buttons, videos). */}
      <div style={{ pointerEvents: 'none' }}>
        <ContentElementView element={element} device={device} />
      </div>
    </div>
  )
}
