import React from 'react'
import { Button, Input, Flex, Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus, faMagnifyingGlass } from '@fortawesome/pro-light-svg-icons'
import { useNavigate } from 'react-router-dom'

export interface HeaderProps {
  // Left
  backButton?: boolean
  onBack?: () => void
  title?: string
  tabs?: React.ReactNode
  tabItems?: TabsProps['items']
  activeTab?: string
  onTabChange?: (key: string) => void

  // Right
  search?: boolean
  searchWidth?: number
  secondaryButtons?: React.ReactNode
  addButton?: boolean
  addButtonText?: string
  onAdd?: () => void
}

export default function Header({
  backButton,
  onBack,
  title,
  tabs,
  tabItems,
  activeTab,
  onTabChange,
  search,
  searchWidth = 200,
  secondaryButtons,
  addButton,
  addButtonText,
  onAdd,
}: HeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        height: 56,
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <Flex align="center" gap={12} style={{height: '100%'}}>
        {backButton && (
          <Button
            icon={<FontAwesomeIcon icon={faArrowLeft} />}
            onClick={handleBack}
            style={{ flexShrink: 0 }}
          />
        )}

        {title && (
          <span style={{ fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>
            {title}
          </span>
        )}

        {tabs}

        {tabItems && (
          <Tabs
            activeKey={activeTab}
            onChange={onTabChange}
            style={{ marginBottom: 0, height: '100%' }}
            tabBarStyle={{ margin: 0, height: '100%', border: 'none' }}
            items={tabItems}
          />
        )}
      </Flex>

      {/* Right */}
      <Flex align="center" gap={8}>
        {search && (
          <Input
            prefix={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#bfbfbf' }} />}
            placeholder="Suche"
            style={{ width: searchWidth }}
          />
        )}

        {secondaryButtons}

        {addButton && (
          <Button
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={onAdd}
          >
            {addButtonText}
          </Button>
        )}
      </Flex>
    </Flex>
  )
}
