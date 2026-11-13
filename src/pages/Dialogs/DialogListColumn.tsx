import { useState } from 'react'
import { Avatar, Button, Collapse, Dropdown, Flex, Typography, theme, Tooltip } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFilter, faGear, faChevronDown,
  faMobile, faWifi, faTv, faCloud, faPhone,
  faImage, faVideo,
} from '@fortawesome/pro-light-svg-icons'
import { ChannelIcon, isChannelIconChannel } from '../../designsystem/components'
import {
  type Dialog,
  type TimeGroup,
  TIME_GROUP_LABELS,
  TIME_GROUP_ORDER,
  groupDialogsByTime,
} from '../../data/dialogs'

const { Text } = Typography

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productIcons: Record<string, any> = {
  Mobilfunk: faMobile,
  Internet: faWifi,
  TV: faTv,
  Cloud: faCloud,
  Festnetz: faPhone,
}

function DialogCard({
  dialog,
  selected,
  onSelect,
}: {
  dialog: Dialog
  selected: boolean
  onSelect: () => void
}) {
  const { token } = theme.useToken()

  return (
    <Flex
      onClick={onSelect}
      gap={token.marginSM}
      align="flex-start"
      style={{
        padding: `${token.paddingSM}px ${token.padding}px`,
        cursor: 'pointer',
        background: selected
          ? token.colorPrimaryBg
          : dialog.actionNeeded
            ? token.colorErrorBg
            : 'transparent',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      {dialog.contactImg
        ? <Avatar src={dialog.contactImg} size={40} style={{ flexShrink: 0 }} />
        : <Avatar size={40} style={{ flexShrink: 0, background: token.colorGrey30 }}>
            {dialog.contactFirstName[0]}{dialog.contactLastName[0]}
          </Avatar>
      }
      <Flex vertical style={{ flex: 1, minWidth: 0 }} gap={token.marginXXS}>
        <Flex justify="space-between" align="center" gap={token.marginXS}>
          <Text strong ellipsis style={{ flex: 1 }}>
            {dialog.contactFirstName} {dialog.contactLastName}
          </Text>
          <Text type="secondary" style={{ fontSize: token.fontSizeSM, flexShrink: 0 }}>
            {dialog.lastMessageTime}
          </Text>
        </Flex>
        <Flex align="center" gap={token.marginXXS}>
          <FontAwesomeIcon
            icon={productIcons[dialog.product] ?? faMobile}
            style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM, flexShrink: 0 }}
          />
          <Text type="secondary" ellipsis style={{ fontSize: token.fontSizeSM, flex: 1 }}>
            {dialog.hasPhotos
              ? `${dialog.photoCount} Fotos`
              : dialog.hasVideo
                ? 'Video'
                : dialog.lastMessage}
          </Text>
          {dialog.hasPhotos && (
            <FontAwesomeIcon icon={faImage} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
          )}
          {dialog.hasVideo && (
            <FontAwesomeIcon icon={faVideo} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
          )}
          {isChannelIconChannel(dialog.channel) ? (
            <ChannelIcon channel={dialog.channel} size={token.fontSizeSM} />
          ) : (
            <FontAwesomeIcon icon={faPhone} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM, flexShrink: 0 }} />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default function DialogListColumn({
  dialogs,
  selectedId,
  onSelect,
}: {
  dialogs: Dialog[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const { token } = theme.useToken()
  const groups = groupDialogsByTime(dialogs)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<TimeGroup, boolean>>({
    action_needed: false,
    last_24h: false,
    older: false,
  })

  const collapseItems = TIME_GROUP_ORDER.map(groupKey => ({
    key: groupKey,
    label: (
      <Flex align="center" gap={token.marginXS}>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            fontSize: token.fontSizeSM,
            color: token.colorTextSecondary,
            transform: collapsedGroups[groupKey] ? 'rotate(-90deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
        <Text strong style={{ fontSize: token.fontSizeSM }}>
          {TIME_GROUP_LABELS[groupKey]} ({groups[groupKey].length})
        </Text>
      </Flex>
    ),
    children: (
      <div>
        {groups[groupKey].map(d => (
          <DialogCard
            key={d.id}
            dialog={d}
            selected={d.id === selectedId}
            onSelect={() => onSelect(d.id)}
          />
        ))}
      </div>
    ),
    style: { border: 'none', background: 'transparent' },
  }))

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        overflow: 'hidden',
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: `${token.paddingSM}px ${token.padding}px`,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Text strong>{dialogs.length} Vorgänge</Text>
        <Flex gap={token.marginXXS}>
          <Dropdown menu={{ items: [{ key: 'all', label: 'Alle Vorgänge' }, { key: 'open', label: 'Offene Vorgänge' }] }}>
            <Button size="small" icon={<FontAwesomeIcon icon={faFilter} />}>
              Filter
            </Button>
          </Dropdown>
          <Tooltip title="Einstellungen">
            <Button size="small" variant="text" color="default" icon={<FontAwesomeIcon icon={faGear} />} />
          </Tooltip>
        </Flex>
      </Flex>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Collapse
          ghost
          activeKey={TIME_GROUP_ORDER.filter(k => !collapsedGroups[k])}
          onChange={(keys) => {
            const active = keys as TimeGroup[]
            setCollapsedGroups({
              action_needed: !active.includes('action_needed'),
              last_24h: !active.includes('last_24h'),
              older: !active.includes('older'),
            })
          }}
          items={collapseItems}
          expandIcon={() => null}
        />
      </div>
    </Flex>
  )
}
