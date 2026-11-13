import type React from 'react'
import { Typography, Flex, theme } from 'antd'

const { Text } = Typography

export type WidgetBackground = 'white' | 'grey'

export interface WidgetProps {
  title?: string
  icon?: React.ReactNode
  extra?: React.ReactNode
  content?: React.ReactNode
  background?: WidgetBackground
}

export default function Widget({
  title,
  icon,
  extra,
  content,
  background = 'white',
}: WidgetProps) {
  const { token } = theme.useToken()

  const backgroundColor = background === 'grey' ? token.colorGrey6 : token.colorBgContainer
  const showHeader = title || icon || extra

  return (
    <Flex
      vertical
      style={{
        background: backgroundColor,
        borderRadius: token.borderRadius,
        padding: token.paddingXS,
      }}
    >
      {showHeader && (
        <Flex
          align="center"
          justify="space-between"
          gap={token.marginSM}
          style={{ padding: token.paddingXS, height: token.controlHeightLG }}
        >
          <Flex align="center" gap={token.marginXS} style={{ minWidth: 0 }}>
            {icon && (
              <Flex align="center" style={{ flexShrink: 0, color: token.colorTextSecondary }}>
                {icon}
              </Flex>
            )}
            {title && (
              <Text strong ellipsis style={{ minWidth: 0 }}>
                {title}
              </Text>
            )}
          </Flex>
          {extra && (
            <Flex align="center" gap={token.marginXS} wrap="wrap" style={{ flexShrink: 0 }}>
              {extra}
            </Flex>
          )}
        </Flex>
      )}

      {content}
    </Flex>
  )
}
