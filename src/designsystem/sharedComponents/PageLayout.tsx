import React from 'react'
import Header, { type HeaderProps } from './Header'
import { Flex } from 'antd'

export interface PageLayoutProps extends HeaderProps {
  children?: React.ReactNode
  noPadding?: boolean
  bodyStyle?: React.CSSProperties
}

export default function PageLayout({ children, noPadding, bodyStyle, ...headerProps }: PageLayoutProps) {
  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Header {...headerProps} />
      <Flex
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          ...bodyStyle,
        }}
      >
        {children}
      </Flex>
    </Flex>
  )
}
