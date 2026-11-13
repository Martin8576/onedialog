import { useState } from 'react'
import type React from 'react'
import { Button, Flex, Tabs, Tooltip, Typography, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faXmark } from '@fortawesome/pro-light-svg-icons'
import { isVisibilityRestricted, type ContentElement, type ContentElementType, type ReleaseNews } from '../../../data/news/types'
import ContentElementTile from './ContentElementTile'
import ElementContentForm from './ElementContentForm'
import NewsSettingsForm from './NewsSettingsForm'
import VisibilityForm from './VisibilityForm'
import { elementGroups, elementMeta, newsTypeMeta } from './meta'

const { Text } = Typography

function Panel({ title, onClose, tabs, activeTab, onTabChange }: {
  title: string
  onClose?: () => void
  /** A single entry renders without a tab bar. */
  tabs: { key: string; label: React.ReactNode; children: React.ReactNode }[]
  activeTab: string
  onTabChange: (key: string) => void
}) {
  const { token } = theme.useToken()
  const content = (tabs.find(t => t.key === activeTab) ?? tabs[0])?.children
  const showTabs = tabs.length > 1

  return (
    <Flex
      vertical
      style={{
        height: '100%',
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        overflow: 'hidden',
      }}
    >
      <Flex
        align="center"
        gap={token.marginXS}
        style={{ padding: `${token.padding}px ${token.padding}px ${token.paddingXS}px`, minHeight: 48 }}
      >
        <Text strong style={{ flex: 1, fontSize: token.fontSizeSM }}>{title}</Text>
        {onClose && (
          <Tooltip title="Schließen">
            <Button
              size="small"
              variant="text"
              color="default"
              icon={<FontAwesomeIcon icon={faXmark} />}
              onClick={onClose}
            />
          </Tooltip>
        )}
      </Flex>
      {showTabs ? (
        <Tabs
          size="small"
          activeKey={activeTab}
          onChange={onTabChange}
          items={tabs.map(t => ({ key: t.key, label: t.label }))}
          tabBarStyle={{ margin: 0, padding: `0 ${token.padding}px` }}
        />
      ) : null}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: token.padding,
          // Without a tab bar the content follows the header directly.
          paddingTop: showTabs ? token.padding : 0,
        }}
      >
        {content}
      </div>
    </Flex>
  )
}

export interface EditorSidebarProps {
  news: ReleaseNews
  onNewsChange: (news: ReleaseNews) => void
  /** Element currently being edited – switches the panel into edit mode. */
  editingElement?: ContentElement
  onElementChange: (element: ContentElement) => void
  onCloseElement: () => void
  onAddElement: (type: ContentElementType) => void
}

/** Left panel of the editor: element palette & settings, or the edit form of one element. */
export default function EditorSidebar({
  news,
  onNewsChange,
  editingElement,
  onElementChange,
  onCloseElement,
  onAddElement,
}: EditorSidebarProps) {
  const { token } = theme.useToken()
  const [defaultTab, setDefaultTab] = useState('content')
  const [elementTab, setElementTab] = useState('content')

  if (editingElement) {
    const contentTab = {
      key: 'content',
      label: 'Inhalt',
      children: <ElementContentForm element={editingElement} onChange={onElementChange} />,
    }
    // Only content blocks have visibility settings (and therefore a tab bar).
    const tabs =
      editingElement.type === 'contentBlock'
        ? [
            contentTab,
            {
              key: 'visibility',
              label: (
                <Flex align="center" gap={token.marginXXS}>
                  Sichtbarkeit
                  {isVisibilityRestricted(editingElement.visibility) && <FontAwesomeIcon icon={faEyeSlash} />}
                </Flex>
              ),
              children: (
                <VisibilityForm
                  value={editingElement.visibility}
                  onChange={visibility => onElementChange({ ...editingElement, visibility })}
                />
              ),
            },
          ]
        : [contentTab]

    return (
      <Panel
        key={editingElement.id}
        title={elementMeta[editingElement.type].label}
        onClose={() => {
          setElementTab('content')
          onCloseElement()
        }}
        activeTab={elementTab}
        onTabChange={setElementTab}
        tabs={tabs}
      />
    )
  }

  return (
    <Panel
      title={newsTypeMeta[news.type].label}
      activeTab={defaultTab}
      onTabChange={setDefaultTab}
      tabs={[
        {
          key: 'content',
          label: 'Inhalte',
          children: (
            <Flex vertical gap={token.margin}>
              {elementGroups.map(group => (
                <Flex key={group.label} vertical gap={token.marginSM}>
                  <Text style={{ fontSize: token.fontSizeSM - 1 }}>{group.label}</Text>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: token.margin }}>
                    {group.types.map(type => (
                      <ContentElementTile key={type} type={type} onAdd={onAddElement} />
                    ))}
                  </div>
                </Flex>
              ))}
            </Flex>
          ),
        },
        {
          key: 'settings',
          label: 'Einstellungen',
          children: <NewsSettingsForm news={news} onChange={onNewsChange} />,
        },
      ]}
    />
  )
}
