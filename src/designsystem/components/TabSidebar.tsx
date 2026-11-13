import { useEffect, useRef, useState } from 'react'
import type React from 'react'
import { Drawer, Tabs, Button, Typography, Flex, theme, Tooltip } from 'antd'
import type { TabsProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/pro-light-svg-icons'

const { Text } = Typography

export interface TabSidebarHeaderAction {
  key: string
  tooltip: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export interface TabSidebarTab {
  key: string
  label: string
  content: React.ReactNode
}

export interface TabSidebarProps {
  open: boolean
  onClose: () => void
  /** Plain string renders as bold title text; pass a React node to add badges or custom layout. */
  title: React.ReactNode
  headerActions?: TabSidebarHeaderAction[]
  footer?: React.ReactNode
  tabs: TabSidebarTab[]
  defaultActiveTab?: string
  getContainer?: () => HTMLElement
  width?: number
  resetTabOnClose?: boolean
}

export default function TabSidebar({
  open,
  onClose,
  title,
  headerActions = [],
  footer,
  tabs,
  defaultActiveTab,
  getContainer,
  width = 560,
  resetTabOnClose = false,
}: TabSidebarProps) {
  const { token } = theme.useToken()
  const firstTabKey = tabs[0]?.key ?? ''
  const resolvedDefault = defaultActiveTab ?? firstTabKey
  const [activeTab, setActiveTab] = useState(resolvedDefault)
  const prevOpen = useRef(open)

  useEffect(() => {
    const wasOpen = prevOpen.current
    if (open && !wasOpen) {
      setActiveTab(resolvedDefault)
    }
    if (!open && wasOpen && resetTabOnClose) {
      setActiveTab(resolvedDefault)
    }
    prevOpen.current = open
  }, [open, resolvedDefault, resetTabOnClose])

  const tabItems: TabsProps['items'] = tabs.map(tab => ({
    key: tab.key,
    label: tab.label,
  }))

  const activeContent = tabs.find(tab => tab.key === activeTab)?.content

  const titleNode = typeof title === 'string' || typeof title === 'number' ? (
    <Text strong style={{ fontSize: token.fontSizeLG }} ellipsis>{title}</Text>
  ) : title

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      closable={false}
      title={null}
      mask={false}
      getContainer={getContainer}
      rootStyle={{ position: 'absolute' }}
      footer={footer}
      styles={{
        wrapper: { width },
        body: {
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: token.colorBgLayout,
        },
        footer: footer
          ? {
              padding: token.padding,
              borderTop: `1px solid ${token.colorBorder}`,
              background: token.colorBgLayout,
            }
          : undefined,
      }}
    >
      <div style={{ padding: `${token.paddingSM}px ${token.paddingSM}px 0 ${token.paddingSM}px`, borderBottom: `1px solid ${token.colorBorder}` }}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={token.marginXS} style={{ minWidth: 0 }}>
            <Tooltip title="Schließen">
              <Button
                variant="text"
                color="default"
                onClick={onClose}
                icon={<FontAwesomeIcon icon={faXmark} />}
              />
            </Tooltip>
            {titleNode}
          </Flex>
          {headerActions.length > 0 && (
            <Flex align="center" style={{ flexShrink: 0 }}>
              {headerActions.map(action => (
                <Tooltip key={action.key} title={action.tooltip}>
                  <Button
                    variant="text"
                    color="default"
                    icon={action.icon}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  />
                </Tooltip>
              ))}
            </Flex>
          )}
        </Flex>
        {tabItems.length > 0 && (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ marginBottom: 0, paddingLeft: token.paddingSM }}
            tabBarStyle={{ margin: 0 }}
            items={tabItems}
          />
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeContent}
      </div>
    </Drawer>
  )
}
