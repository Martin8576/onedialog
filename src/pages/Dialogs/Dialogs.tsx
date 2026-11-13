import { useMemo, useState } from 'react'
import { Badge, Button, Flex, Input, Select, Space, Splitter, theme } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faCommentDots } from '@fortawesome/pro-light-svg-icons'
import Header from '../../designsystem/sharedComponents/Header'
import {
  type DialogTab,
  dialogs,
  filterDialogs,
  getTabUnreadCounts,
} from '../../data/dialogs'
import DialogListColumn from './DialogListColumn'
import ChatView from './ChatView'
import DialogSidebar from './DialogSidebar'

export default function Dialogs() {
  const { token } = theme.useToken()
  const [activeTab, setActiveTab] = useState<DialogTab>('mine')
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('vorgaenge')
  const [selectedId, setSelectedId] = useState<string>('d1')

  const unreadCounts = useMemo(() => getTabUnreadCounts(), [])

  const filteredDialogs = useMemo(
    () => filterDialogs(activeTab, searchText),
    [activeTab, searchText],
  )

  const selectedDialog = useMemo(
    () => dialogs.find(d => d.id === selectedId) ?? null,
    [selectedId],
  )

  const tabItems = [
    {
      key: 'mine',
      label: (
        <Flex align="center" gap={token.marginXS}>
          Meine
          {unreadCounts.mine > 0 && (
            <Badge
              size="small"
              count={unreadCounts.mine}
              style={{ backgroundColor: token.colorGrey30, color: token.colorText, boxShadow: 'none' }}
            />
          )}
        </Flex>
      ),
    },
    {
      key: 'team',
      label: (
        <Flex align="center" gap={token.marginXS}>
          Team
          {unreadCounts.team > 0 && (
            <Badge
              size="small"
              count={unreadCounts.team}
              style={{ backgroundColor: token.colorGrey30, color: token.colorText, boxShadow: 'none' }}
            />
          )}
        </Flex>
      ),
    },
    {
      key: 'leads',
      label: (
        <Flex align="center" gap={token.marginXS}>
          Leads
          {unreadCounts.leads > 0 && (
            <Badge
              size="small"
              count={unreadCounts.leads}
              style={{ backgroundColor: token.colorGrey30, color: token.colorText, boxShadow: 'none' }}
            />
          )}
        </Flex>
      ),
    },
    { key: 'done', label: 'Erledigt' },
    { key: 'spam', label: 'Spam' },
    { key: 'trash', label: 'Papierkorb' },
  ]

  return (
    <Flex vertical style={{ height: '100%', overflow: 'hidden' }}>
      <Header
        tabItems={tabItems}
        activeTab={activeTab}
        onTabChange={key => setActiveTab(key as DialogTab)}
        secondaryButtons={
          <>
            <Space.Compact>
              <Input
                prefix={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: token.colorTextDisabled }} />}
                placeholder="Suche"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{ width: 240 }}
                allowClear
              />
              <Select
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: 'vorgaenge', label: 'Vorgänge' },
                  { value: 'aufgaben', label: 'Aufgaben' },
                  { value: 'termine', label: 'Termine' },
                ]}
              />
            </Space.Compact>
            <Button type="primary" iconPlacement="end" icon={<FontAwesomeIcon icon={faCommentDots} />}>
              Dialog starten
            </Button>
          </>
        }
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel defaultSize={320} min={240} max={480}>
            <DialogListColumn
              dialogs={filteredDialogs}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </Splitter.Panel>
          <Splitter.Panel>
            <Flex style={{ height: '100%', overflow: 'hidden' }}>
              <ChatView dialog={selectedDialog} />
              <DialogSidebar dialog={selectedDialog} />
            </Flex>
          </Splitter.Panel>
        </Splitter>
      </div>
    </Flex>
  )
}
