import { useState } from 'react'
import type React from 'react'
import { Avatar, Typography, Flex, theme } from 'antd'

const { Text } = Typography

export interface WidgetItemProps {
  label?: string
  value?: string
  iconLeft?: React.ReactNode
  action?: React.ReactNode
  avatar?: React.ReactNode | string
  tags?: React.ReactNode
}

export default function WidgetItem({
  label,
  value,
  iconLeft,
  action,
  avatar,
  tags,
}: WidgetItemProps) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)

  function renderAvatar() {
    if (!avatar) return null
    if (typeof avatar === 'string') {
      return (
        <Avatar
          src={avatar}
          shape="square"
          size="small"
          style={{ borderRadius: token.borderRadius, flexShrink: 0 }}
        />
      )
    }
    return avatar
  }

  return (
    <Flex
      align="center"
      gap={token.marginMD}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `${token.paddingXXS}px ${token.paddingXS}px`,
        background: hovered ? token.colorBgLayout : 'transparent',
        borderRadius: token.borderRadius,
        transition: `background ${token.motionDurationMid}`,
      }}
    >
      {iconLeft && (
        <Flex align="center" style={{ flexShrink: 0, color: token.colorTextSecondary }}>
          {iconLeft}
        </Flex>
      )}

      <Flex style={{ flex: 1, minWidth: 0 }}>
        {label && (
          <Text strong style={{ fontSize: token.fontSizeSM }}>
            {label}
          </Text>
        )}

        {(avatar || value) && (
          <Flex align="center" gap={token.marginXS} style={{ minWidth: 0 }}>
            {renderAvatar()}
            {value && (
              <Text style={{ minWidth: 0 }}>
                {value}
              </Text>
            )}
          </Flex>
        )}

        {tags && (
          <Flex align="center" gap={token.marginXS} wrap="wrap">
            {tags}
          </Flex>
        )}
      </Flex>

      {action && (
        <Flex align="center" style={{ flexShrink: 0 }}>
          {action}
        </Flex>
      )}
    </Flex>
  )
}
