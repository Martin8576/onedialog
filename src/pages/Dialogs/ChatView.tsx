import { useRef, useEffect } from 'react'
import {
  Avatar, Button, Flex, Input, Select, Typography, theme, Tooltip,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPen, faPhone, faBoxArchive, faUserPlus, faCircleCheck,
  faEllipsisVertical, faFaceSmile, faWandMagicSparkles,
  faDiagramProject, faFileLines, faPaperclip, faPaperPlane,
  faNoteSticky, faStar, faWifi, faLocationDot,
} from '@fortawesome/pro-light-svg-icons'
import { ChannelIcon } from '../../designsystem/components'
import { type Dialog, type ChatMessage } from '../../data/dialogs'

const { Text } = Typography

function DateDivider({ date }: { date: string }) {
  const { token } = theme.useToken()
  return (
    <Flex justify="center" style={{ padding: `${token.paddingSM}px 0` }}>
      <Text
        style={{
          fontSize: token.fontSizeSM,
          color: token.colorTextLightSolid,
          background: token.colorGrey70,
          padding: `${token.paddingXXS}px ${token.paddingSM}px`,
          borderRadius: token.borderRadiusLG,
        }}
      >
        {date}
      </Text>
    </Flex>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const { token } = theme.useToken()

  if (message.type === 'date_divider') {
    return <DateDivider date={message.date!} />
  }

  if (message.type === 'button') {
    return (
      <Flex justify="center" style={{ padding: `${token.paddingXS}px 0` }}>
        <Button style={{ background: token.colorBgContainer, borderColor: token.colorBorder }}>
          {message.buttonLabel}
        </Button>
      </Flex>
    )
  }

  if (message.type === 'internal_note') {
    return (
      <Flex justify="center" style={{ padding: `${token.paddingXS}px ${token.paddingLG}px` }}>
        <Flex
          gap={token.marginSM}
          align="flex-start"
          style={{
            background: token.colorWarningBg,
            borderRadius: token.borderRadius,
            padding: token.padding,
            maxWidth: '80%',
            width: '100%',
          }}
        >
          <FontAwesomeIcon icon={faNoteSticky} style={{ color: token.colorWarning, marginTop: 2 }} />
          <Flex vertical gap={token.marginXXS} style={{ flex: 1 }}>
            <Text strong style={{ fontSize: token.fontSizeSM }}>Interne Notiz</Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Text>
            {message.time && (
              <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{message.time}</Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    )
  }

  if (message.type === 'template') {
    return (
      <Flex justify="flex-end" style={{ padding: `${token.paddingXS}px ${token.paddingLG}px` }}>
        <Flex vertical style={{ maxWidth: '70%' }} gap={token.marginXXS}>
          <Flex
            vertical
            gap={token.marginXS}
            style={{
              background: token.colorBgContainer,
              borderRadius: token.borderRadius,
              padding: token.padding,
              border: `2px solid #25D366`,
            }}
          >
            <Text strong style={{ fontSize: token.fontSizeSM, color: '#25D366' }}>
              {message.templateLabel}
            </Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{message.content}</Text>
          </Flex>
          <MessageMeta message={message} align="right" />
        </Flex>
      </Flex>
    )
  }

  if (message.type === 'review') {
    return (
      <Flex justify="flex-start" style={{ padding: `${token.paddingXS}px ${token.paddingLG}px` }}>
        <Flex
          vertical
          gap={token.marginXS}
          style={{
            background: token.colorPrimaryBg,
            borderRadius: token.borderRadius,
            padding: token.padding,
            maxWidth: '70%',
          }}
        >
          <Flex gap={token.marginXXS}>
            {Array.from({ length: message.rating ?? 5 }).map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} style={{ color: token.colorWarning }} />
            ))}
          </Flex>
          <Text>{message.reviewText}</Text>
          {message.time && (
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{message.time}</Text>
          )}
        </Flex>
      </Flex>
    )
  }

  const isOutgoing = message.type === 'outgoing'

  return (
    <Flex
      justify={isOutgoing ? 'flex-end' : 'flex-start'}
      style={{ padding: `${token.paddingXS}px ${token.paddingLG}px` }}
    >
      <Flex vertical style={{ maxWidth: '70%' }} gap={token.marginXXS}>
        <div
          style={{
            background: isOutgoing ? token.colorGrey80 : token.colorBgContainer,
            color: isOutgoing ? token.colorTextLightSolid : token.colorText,
            borderRadius: token.borderRadius,
            padding: token.padding,
            whiteSpace: 'pre-wrap',
          }}
        >
          <Text style={{ color: isOutgoing ? token.colorTextLightSolid : undefined, whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Text>
        </div>
        {isOutgoing && <MessageMeta message={message} align="right" />}
        {!isOutgoing && message.time && (
          <Text type="secondary" style={{ fontSize: token.fontSizeSM, paddingLeft: token.paddingXXS }}>
            {message.time}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

function MessageMeta({ message, align }: { message: ChatMessage; align: 'left' | 'right' }) {
  const { token } = theme.useToken()
  return (
    <Flex
      align="center"
      gap={token.marginXXS}
      justify={align === 'right' ? 'flex-end' : 'flex-start'}
      style={{ paddingRight: align === 'right' ? token.paddingXXS : 0 }}
    >
      {message.readStatus && (
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{message.readStatus}</Text>
      )}
      {message.channel === 'whatsapp' && (
        <ChannelIcon channel="whatsapp" size={token.fontSizeSM} />
      )}
      {message.agentName && (
        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{message.agentName}</Text>
      )}
      {message.agentImg && <Avatar src={message.agentImg} size={16} />}
    </Flex>
  )
}

export default function ChatView({ dialog }: { dialog: Dialog | null }) {
  const { token } = theme.useToken()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dialog?.id])

  if (!dialog) {
    return (
      <Flex
        align="center"
        justify="center"
        style={{ flex: 1, background: token.colorGrey, height: '100%' }}
      >
        <Text style={{ color: token.colorTextLightSolid }}>Wählen Sie einen Vorgang aus</Text>
      </Flex>
    )
  }

  return (
    <Flex vertical style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
      {/* Sticky header */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: `${token.paddingSM}px ${token.paddingLG}px`,
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={token.marginSM}>
          {dialog.contactImg
            ? <Avatar src={dialog.contactImg} size={36} />
            : <Avatar size={36}>{dialog.contactFirstName[0]}</Avatar>
          }
          <Flex vertical gap={0}>
            <Flex align="center" gap={token.marginXS}>
              <Text strong>{dialog.title}</Text>
              <Tooltip title="Bearbeiten">
                <Button
                  variant="text"
                  color="default"
                  size="small"
                  icon={<FontAwesomeIcon icon={faPen} style={{ fontSize: token.fontSizeSM }} />}
                />
              </Tooltip>
            </Flex>
            <Flex align="center" gap={token.marginSM}>
              <Flex align="center" gap={token.marginXXS}>
                <FontAwesomeIcon icon={faWifi} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{dialog.product}</Text>
              </Flex>
              <Flex align="center" gap={token.marginXXS}>
                <FontAwesomeIcon icon={faLocationDot} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{dialog.team}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex align="center" gap={token.marginXXS}>
          <Tooltip title="Anrufen">
            <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faPhone} />} />
          </Tooltip>
          <Tooltip title="Archivieren">
            <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faBoxArchive} />} />
          </Tooltip>
          <Tooltip title="Teilnehmer hinzufügen">
            <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faUserPlus} />} />
          </Tooltip>
          <Tooltip title="Als erledigt markieren">
            <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faCircleCheck} />} />
          </Tooltip>
          <Button variant="text" color="default" icon={<FontAwesomeIcon icon={faEllipsisVertical} />} />
        </Flex>
      </Flex>

      {/* Scrollable messages */}
      <div style={{ flex: 1, overflowY: 'auto', background: token.colorGrey }}>
        {dialog.messages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky footer */}
      <Flex
        vertical
        gap={token.marginXS}
        style={{
          padding: `${token.paddingSM}px ${token.paddingLG}px`,
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={token.marginSM}>
          <Select
            defaultValue="whatsapp"
            size="small"
            style={{ width: 130 }}
            options={[{ value: 'whatsapp', label: 'WhatsApp' }]}
          />
          <Tooltip title="Emoji">
            <Button variant="text" color="default" size="small" icon={<FontAwesomeIcon icon={faFaceSmile} />} />
          </Tooltip>
          <Tooltip title="KI-Assistent">
            <Button variant="text" color="default" size="small" icon={<FontAwesomeIcon icon={faWandMagicSparkles} />} />
          </Tooltip>
          <Tooltip title="Automation">
            <Button variant="text" color="default" size="small" icon={<FontAwesomeIcon icon={faDiagramProject} />} />
          </Tooltip>
          <Tooltip title="Vorlagen">
            <Button variant="text" color="default" size="small" icon={<FontAwesomeIcon icon={faFileLines} />} />
          </Tooltip>
          <Tooltip title="Dokument">
            <Button variant="text" color="default" size="small" icon={<FontAwesomeIcon icon={faFileLines} />} />
          </Tooltip>
          <Tooltip title="Anhang">
            <Button variant="text" color="default" size="small" icon={<FontAwesomeIcon icon={faPaperclip} />} />
          </Tooltip>
        </Flex>
        <Flex align="flex-end" gap={token.marginSM}>
          <Input.TextArea
            placeholder="Nachricht schreiben"
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ flex: 1 }}
            maxLength={1024}
          />
          <Flex vertical align="flex-end" gap={token.marginXXS}>
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>0/1024</Text>
            <Tooltip title="Senden">
              <Button
                type="primary"
                icon={<FontAwesomeIcon icon={faPaperPlane} />}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
