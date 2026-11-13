import { useState } from 'react'
import type React from 'react'
import { Avatar, Switch, Typography, Flex, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faGripLines } from '@fortawesome/pro-light-svg-icons'

const { Text } = Typography

export type ListItemState = 'default' | 'hover' | 'active' | 'disabled'

export interface ListItemProps {
  state?: ListItemState
  onClick?: () => void
  draggable?: boolean
  icon?: React.ReactNode
  switch?: boolean
  switchChecked?: boolean
  onSwitchChange?: (checked: boolean) => void
  avatar?: React.ReactNode | string
  title: string
  titleIcon?: React.ReactNode
  description?: string
  descriptionTags?: React.ReactNode
  tags?: React.ReactNode
  actions?: React.ReactNode
  arrow?: boolean
}

export default function ListItem({
  state = 'default',
  onClick,
  draggable = false,
  icon,
  switch: showSwitch = false,
  switchChecked,
  onSwitchChange,
  avatar,
  title,
  titleIcon,
  description,
  descriptionTags,
  tags,
  actions,
  arrow = false,
}: ListItemProps) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)

  const isDisabled = state === 'disabled'
  const isActive = state === 'active'
  const isHovered = !isDisabled && !isActive && (state === 'hover' || hovered)

  const background = isDisabled
    ? token.colorGrey10
    : isActive
      ? token.colorPrimaryBg
      : token.colorBgContainer

  const titleColor = isDisabled
    ? token.colorTextSecondary
    : isActive
      ? token.colorPrimary
      : token.colorText

  const arrowColor = isDisabled
    ? token.colorTextSecondary
    : isActive
      ? token.colorPrimary
      : token.colorTextSecondary

  function handleClick() {
    if (isDisabled || !onClick) return
    onClick()
  }

  function renderAvatar() {
    if (!avatar) return null
    if (typeof avatar === 'string') {
      return <Avatar src={avatar} size="large" shape="square" style={{ borderRadius: token.borderRadius, flexShrink: 0 }} />
    }
    return avatar
  }

  return (
    <Flex
      align="center"
      gap={token.margin}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `${token.paddingSM}px ${token.padding}px`,
        background,
        borderRadius: token.borderRadius,
        boxShadow: isHovered ? token.boxShadow : 'none',
        cursor: isDisabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        transition: `box-shadow ${token.motionDurationMid}, background ${token.motionDurationMid}`,
      }}
    >
      {draggable && (
        <FontAwesomeIcon
          icon={faGripLines}
          style={{ color: token.colorTextSecondary, flexShrink: 0, cursor: 'grab' }}
          onClick={e => e.stopPropagation()}
        />
      )}

      {showSwitch && (
        <Switch
          checked={switchChecked}
          onChange={onSwitchChange}
          disabled={isDisabled}
          onClick={(_, e) => e.stopPropagation()}
        />
      )}

      {renderAvatar()}

      {icon && (
        <Flex align="center" style={{ flexShrink: 0, color: isDisabled ? token.colorTextSecondary : token.colorText }}>
          {icon}
        </Flex>
      )}

      <Flex vertical style={{ flex: 1, minWidth: 0 }}>
        <Flex align="center" gap={token.marginXS} style={{ minWidth: 0 }}>
          <Text
            ellipsis
          >
            {title}
          </Text>
          {titleIcon && (
            <Flex align="center" style={{ flexShrink: 0, color: titleColor }}>
              {titleIcon}
            </Flex>
          )}
        </Flex>
        {(description || descriptionTags) && (
          <Flex align="center" gap={token.marginXS} wrap="wrap" style={{ minWidth: 0 }}>
            {description && (
              <Text
                type="secondary"
                strong
                style={{ fontSize: token.fontSizeSM }}
              >
                {description}
              </Text>
            )}
            {descriptionTags}
          </Flex>
        )}
      </Flex>

      {tags && (
        <Flex align="center" gap={token.marginXS} wrap="wrap" style={{ flexShrink: 0 }}>
          {tags}
        </Flex>
      )}

      {actions && (
        <Flex align="center" gap={token.marginXS} style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          {actions}
        </Flex>
      )}

      {arrow && (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ color: arrowColor, flexShrink: 0, fontSize: token.fontSizeSM }}
        />
      )}
    </Flex>
  )
}
