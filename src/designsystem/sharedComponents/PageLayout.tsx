import React from 'react'
import Header, { type HeaderProps } from './Header'

export interface PageLayoutProps extends HeaderProps {
  children?: React.ReactNode
  noPadding?: boolean
  bodyStyle?: React.CSSProperties
}

export default function PageLayout({ children, noPadding, bodyStyle, ...headerProps }: PageLayoutProps) {
  return (
    <>
      <Header {...headerProps} />
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </>
  )
}
