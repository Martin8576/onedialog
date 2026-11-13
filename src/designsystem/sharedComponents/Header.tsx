import React from 'react'
import { Button, Input, Flex, Tabs, Tooltip, Typography, theme } from 'antd'
import type { TabsProps } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faPlus, faMagnifyingGlass } from '@fortawesome/pro-light-svg-icons'
import { useNavigate } from 'react-router-dom'
import GreyButton from '../components/GreyButton'

const { Text } = Typography

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
  const { token } = theme.useToken()
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
        minHeight: '60px',
        padding: `0 ${token.paddingSM}px 0 ${token.paddingLG}px`,
        background: token.colorBgContainer,
        borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <Flex align="center" gap={token.marginSM} style={{ height: '100%' }}>
        {backButton && (
          <Tooltip title="Zurück">
            <Button
              variant="text"
              color="default"
              icon={<FontAwesomeIcon icon={faChevronLeft} />}
              onClick={handleBack}
              style={{ flexShrink: 0 }}
            />
          </Tooltip>
        )}

        {title && (
          <Text strong style={{ fontSize: token.fontSizeHeading5, whiteSpace: 'nowrap' }}>
            {title}
          </Text>
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
      <Flex align="center" gap={token.marginXS}>
        {search && (
          <Input
            prefix={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: token.colorTextDisabled }} />}
            placeholder="Suche"
            style={{ width: searchWidth }}
          />
        )}

        {secondaryButtons}

        {addButton && (
          <GreyButton
            iconPlacement="end"
            icon={<FontAwesomeIcon icon={faPlus} />}
            onClick={onAdd}
          >
            {addButtonText}
          </GreyButton>
        )}
      </Flex>
    </Flex>
  )
}
