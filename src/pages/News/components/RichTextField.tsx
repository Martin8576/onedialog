import { useRef, useState } from 'react'
import type React from 'react'
import { Button, Flex, Input, Popover, Tag, Tooltip, theme } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSmile } from '@fortawesome/pro-light-svg-icons'

import type { RichTextTool } from './richTextTools'

const FORMAT_LABELS: Record<Exclude<RichTextTool, 'emoji'>, string> = {
  bold: 'Fett',
  italic: 'Italic',
  list: 'Liste',
}

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😊', '😍', '🤩', '😎',
  '🤔', '😮', '🙌', '👏', '👍', '👋', '🙏', '💪',
  '🎉', '🥳', '🎁', '🚀', '✨', '🔥', '⭐', '💡',
  '✅', '❗', '❓', '⚠️', '📣', '📢', '📅', '⏰',
  '💬', '📱', '💻', '📈', '📊', '🔒', '🔔', '📝',
  '❤️', '💙', '💚', '🧡', '🚗', '🏠', '☀️', '🌱',
]

export interface RichTextFieldProps {
  value: string
  onChange: (value: string) => void
  /** Hard limit – input beyond it is never possible (typing, pasting, emojis, formatting). */
  maxLength: number
  tools: RichTextTool[]
  /** Headings: no line breaks. */
  singleLine?: boolean
  /** Shows an H1–H3 selector in the toolbar (content block heading). */
  headingLevel?: 1 | 2 | 3
  onHeadingLevelChange?: (level: 1 | 2 | 3) => void
}

/**
 * Text area with a small toolbar. Formatting is stored as a minimal markdown
 * subset (see `markdown.tsx`).
 */
export default function RichTextField({
  value,
  onChange,
  maxLength,
  tools,
  singleLine,
  headingLevel,
  onHeadingLevelChange,
}: RichTextFieldProps) {
  const { token } = theme.useToken()
  const ref = useRef<TextAreaRef>(null)
  const selection = useRef({ start: value.length, end: value.length })
  const [emojiOpen, setEmojiOpen] = useState(false)

  const textArea = () => ref.current?.resizableTextArea?.textArea
  const fits = (next: string) => next.length <= maxLength

  const emit = (next: string) => {
    const clean = singleLine ? next.replace(/\n/g, ' ') : next
    onChange(clean.slice(0, maxLength))
  }

  const rememberSelection = () => {
    const el = textArea()
    if (el) selection.current = { start: el.selectionStart, end: el.selectionEnd }
  }

  const focusRange = (start: number, end: number) =>
    requestAnimationFrame(() => {
      const el = textArea()
      el?.focus()
      el?.setSelectionRange(start, end)
    })

  const insertEmoji = (emoji: string) => {
    const { start, end } = selection.current
    const next = value.slice(0, start) + emoji + value.slice(end)
    if (!fits(next)) return
    emit(next)
    const cursor = start + emoji.length
    selection.current = { start: cursor, end: cursor }
    setEmojiOpen(false)
    focusRange(cursor, cursor)
  }

  const applyFormat = (tool: 'bold' | 'italic' | 'list') => {
    rememberSelection()
    const { start, end } = selection.current

    if (tool === 'list') {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      const nextBreak = value.indexOf('\n', end)
      const lineEnd = nextBreak === -1 ? value.length : nextBreak
      const lines = value.slice(lineStart, lineEnd).split('\n')
      const allListed = lines.every(l => l.startsWith('- '))
      const replaced = lines.map(l => (allListed ? l.slice(2) : l.startsWith('- ') ? l : `- ${l}`)).join('\n')
      const next = value.slice(0, lineStart) + replaced + value.slice(lineEnd)
      if (!fits(next)) return
      emit(next)
      focusRange(lineStart, lineStart + replaced.length)
      return
    }

    const marker = tool === 'bold' ? '**' : '*'
    const selected = value.slice(start, end) || (tool === 'bold' ? 'fett' : 'kursiv')
    const next = value.slice(0, start) + marker + selected + marker + value.slice(end)
    if (!fits(next)) return
    emit(next)
    focusRange(start + marker.length, start + marker.length + selected.length)
  }

  const tagStyle: React.CSSProperties = { margin: 0, cursor: 'pointer' }

  return (
    <Flex
      vertical
      style={{
        border: `${token.lineWidth}px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        background: token.colorBgContainer,
      }}
    >
      <Flex wrap gap={token.marginXXS} style={{ padding: `${token.paddingXS}px ${token.paddingXS}px 0` }}>
        {onHeadingLevelChange &&
          ([1, 2, 3] as const).map(level => (
            <Tag.CheckableTag
              key={`h${level}`}
              checked={headingLevel === level}
              onChange={() => onHeadingLevelChange(level)}
              style={{ margin: 0 }}
            >
              H{level}
            </Tag.CheckableTag>
          ))}

        {tools.map(tool =>
          tool === 'emoji' ? (
            <Popover
              key={tool}
              open={emojiOpen}
              onOpenChange={open => {
                if (open) rememberSelection()
                setEmojiOpen(open)
              }}
              trigger="click"
              placement="bottomLeft"
              content={
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: token.marginXXS }}>
                  {EMOJIS.map(emoji => (
                    <Button
                      key={emoji}
                      type="text"
                      size="small"
                      disabled={!fits(value + emoji)}
                      onClick={() => insertEmoji(emoji)}
                      style={{ fontSize: token.fontSizeLG }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              }
            >
              <Tooltip title="Emoji einfügen">
                <Tag bordered={false} onMouseDown={e => e.preventDefault()} style={tagStyle}>
                  <FontAwesomeIcon icon={faFaceSmile} />
                </Tag>
              </Tooltip>
            </Popover>
          ) : (
            <Tag
              key={tool}
              bordered={false}
              onMouseDown={e => e.preventDefault()}
              onClick={() => applyFormat(tool)}
              style={tagStyle}
            >
              {FORMAT_LABELS[tool]}
            </Tag>
          ),
        )}
      </Flex>
      <Input.TextArea
        ref={ref}
        variant="borderless"
        value={value}
        onChange={e => emit(e.target.value)}
        onSelect={rememberSelection}
        onBlur={rememberSelection}
        onPressEnter={singleLine ? e => e.preventDefault() : undefined}
        maxLength={maxLength}
        showCount
        autoSize={singleLine ? { minRows: 2, maxRows: 4 } : { minRows: 4, maxRows: 14 }}
        style={{ paddingBottom: token.paddingLG }}
      />
    </Flex>
  )
}
