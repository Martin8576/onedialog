import { useState, useMemo, useRef, useLayoutEffect, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Table, Avatar, Tag, Button, Typography, Flex, Input, Tooltip, Segmented, theme } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck, faCircleXmark, faCircleQuestion,
  faFilter,
  faMagnifyingGlass,
  faPhone,
  faPen, faTrash, faMerge,
} from '@fortawesome/pro-light-svg-icons'
import { ChannelIcon, isChannelIconChannel } from '../../designsystem/components'
import { PageLayout } from '../../designsystem/sharedComponents'
import { contacts, type Contact, type Channel, type OptIn } from '../../data/contacts'
import { getUserByName } from '../../data/users'
import ContactSidebar from './ContactSidebar'
import MergeManualModal from './MergeManualModal'

const { Text } = Typography

// ─── helpers ─────────────────────────────────────────────────────────────────

function OptInIcon({ value }: { value: OptIn }) {
  const { token } = theme.useToken()
  if (value === 'yes') return <FontAwesomeIcon icon={faCircleCheck} style={{ color: token.colorSuccess, fontSize: token.fontSizeLG }} />
  if (value === 'no') return <FontAwesomeIcon icon={faCircleXmark} style={{ color: token.colorError, fontSize: token.fontSizeLG }} />
  return <FontAwesomeIcon icon={faCircleQuestion} style={{ color: token.colorTextDisabled, fontSize: token.fontSizeLG }} />
}

function ChannelIcons({ channels }: { channels: Channel[] }) {
  const { token } = theme.useToken()

  return (
    <Flex gap={token.marginXXS} align="center">
      {channels.map(c =>
        isChannelIconChannel(c) ? (
          <ChannelIcon key={c} channel={c} size={token.fontSize} />
        ) : (
          <FontAwesomeIcon key={c} icon={faPhone} style={{ color: token.colorTextSecondary, fontSize: token.fontSize }} />
        ),
      )}
    </Flex>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

type TabFilter = 'all' | 'mine' | 'team'

const CONTACT_FILTER_PATHS: Record<TabFilter, string> = {
  mine: '/contacts/mine',
  team: '/contacts/team',
  all: '/contacts',
}

export default function Contacts() {
  const { token } = theme.useToken()
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab: TabFilter =
    location.pathname === '/contacts/mine' ? 'mine' : location.pathname === '/contacts/team' ? 'team' : 'all'
  const containerRef = useRef<HTMLDivElement>(null)
  const tableWrapRef = useRef<HTMLDivElement>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [searchText, setSearchText] = useState('')
  const [tableScrollY, setTableScrollY] = useState(400)
  const [editMode, setEditMode] = useState(false)
  const [mergeManualOpen, setMergeManualOpen] = useState(false)

  const hasSelection = selectedRowKeys.length > 0

  function exitEditMode() {
    setEditMode(false)
    setSelectedRowKeys([])
  }

  const selectedContacts = useMemo(
    () => contacts.filter(c => selectedRowKeys.includes(c.id)),
    [selectedRowKeys],
  )

  const updateScrollY = useCallback(() => {
    const wrap = tableWrapRef.current
    if (!wrap) return
    const theadH = wrap.querySelector<HTMLElement>('.ant-table-header')?.offsetHeight
      ?? wrap.querySelector<HTMLElement>('.ant-table-thead')?.offsetHeight
      ?? 39
    const footerH = wrap.querySelector<HTMLElement>('.ant-table-footer')?.offsetHeight ?? 0
    setTableScrollY(Math.max(100, wrap.clientHeight - token.paddingLG * 2 - theadH - footerH))
  }, [token.paddingLG])

  useLayoutEffect(() => {
    const wrap = tableWrapRef.current
    if (!wrap) return
    const ro = new ResizeObserver(updateScrollY)
    ro.observe(wrap)
    updateScrollY()
    return () => ro.disconnect()
  }, [updateScrollY])

  useEffect(() => {
    requestAnimationFrame(updateScrollY)
  }, [editMode, updateScrollY])

  const filtered = useMemo(() => {
    let list = contacts
    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      list = list.filter(c =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.assignee.toLowerCase().includes(q)
      )
    }
    if (activeTab === 'mine') list = list.filter(c => c.assignee === 'Marc Lobinger')
    if (activeTab === 'team') list = list.filter(c => c.assignee !== 'Marc Lobinger')
    return list
  }, [activeTab, searchText])

  const columns = useMemo((): ColumnsType<Contact> => {
    const base: ColumnsType<Contact> = [
      {
        title: 'Vorname',
        dataIndex: 'firstName',
        sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        render: (firstName, c) => (
          <Flex align="center" gap={token.marginXS}>
            {c.img
              ? <Avatar src={c.img} size={28} style={{ flexShrink: 0 }} />
              : <div style={{ width: token.controlHeightSM + token.marginXXS, flexShrink: 0 }} />
            }
            <Text>{firstName}</Text>
          </Flex>
        ),
      },
      {
        title: 'Nachname',
        dataIndex: 'lastName',
        sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      },
      {
        title: 'Wohnort',
        dataIndex: 'city',
        sorter: (a, b) => a.city.localeCompare(b.city),
        render: (city, c) => `${c.postalCode} ${city}`,
      },
      {
        title: 'Opt-In',
        dataIndex: 'optIn',
        sorter: (a, b) => a.optIn.localeCompare(b.optIn),
        render: (v) => <OptInIcon value={v} />,
        align: 'center' as const,
        width: 80,
      },
    ]

    base.push(
      {
        title: 'Labels',
        dataIndex: 'labels',
        render: (labels: string[]) => {
          const visible = labels.slice(0, 2)
          const rest = labels.length - visible.length
          return (
            <Flex gap={token.marginXXS} wrap="wrap" align="center">
              {visible.map(l => (
                <Tag key={l} style={{ margin: 0, borderRadius: token.borderRadiusSM, fontSize: token.fontSizeSM }}>{l}</Tag>
              ))}
              {rest > 0 && <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>+{rest}</Text>}
            </Flex>
          )
        },
      },
      {
        title: 'Ansprechpartner',
        dataIndex: 'assignee',
        sorter: (a, b) => a.assignee.localeCompare(b.assignee),
        render: (name: string) => {
          const u = getUserByName(name)
          return (
            <Flex align="center" gap={token.marginXS}>
              {u && <Avatar src={u.img} size={20} />}
              <Text>{name}</Text>
            </Flex>
          )
        },
      },
      {
        title: 'Kanäle',
        dataIndex: 'channels',
        render: (ch: Channel[]) => <ChannelIcons channels={ch} />,
        width: 120,
      },
      {
        title: 'Geburtsdatum',
        dataIndex: 'birthDate',
        sorter: (a, b) => (a.birthDate ?? '').localeCompare(b.birthDate ?? ''),
        render: (v?: string) => v ?? '',
      },
    )

    return base
  }, [token])

  return (
    <PageLayout
      title="Kontakte"
      tabs={
        <Segmented
          value={activeTab}
          options={[
            { label: 'Meine', value: 'mine' },
            { label: 'Team', value: 'team' },
            { label: 'Alle', value: 'all' },
          ]}
          onChange={(value) => navigate(CONTACT_FILTER_PATHS[value as TabFilter])}
        />
      }
      bodyStyle={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      secondaryButtons={
        <>
          <Input
            prefix={<FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: token.colorTextDisabled }} />}
            placeholder="Suche"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 360 }}
            allowClear
          />
          <Button icon={<FontAwesomeIcon icon={faFilter} />}>Filter</Button>
          <Button icon={<FontAwesomeIcon icon={faPen} />} onClick={() => setEditMode(true)}>
            Bearbeiten
          </Button>
        </>
      }
      addButton
      addButtonText="Hinzufügen"
      onAdd={() => {}}
    >
      <div ref={containerRef} style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div ref={tableWrapRef} style={{ flex: 1, minHeight: 0, padding: token.paddingLG, boxSizing: 'border-box' }}>
          <Table<Contact>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            size="small"
            pagination={false}
            scroll={{ x: 'max-content', y: tableScrollY }}
            rowSelection={editMode ? {
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            } : undefined}
            onRow={(record) => ({
              onClick: () => setSelectedContact(prev => prev?.id === record.id ? null : record),
              style: { cursor: 'pointer' },
            })}
            rowClassName={(record) =>
              record.id === selectedContact?.id ? 'ant-table-row-selected' : ''
            }
            footer={editMode ? () => (
              <Flex align="center" gap={token.marginSM}>
                <Text strong>{selectedRowKeys.length} ausgewählt</Text>
                <Tooltip title={selectedRowKeys.length < 2 ? 'Bitte wählen Sie 2 Kontakte aus, die sie zusammenführen möchten.' : selectedRowKeys.length > 2 ? 'Nur mit genau 2 Kontakten verfügbar' : undefined}>
                  <Button
                    onClick={() => setMergeManualOpen(true)}
                    disabled={selectedRowKeys.length !== 2}
                    icon={<FontAwesomeIcon icon={faMerge} />}
                  >
                    Kontakte zusammenführen
                  </Button>
                </Tooltip>
                <Button danger icon={<FontAwesomeIcon icon={faTrash} />} disabled={!hasSelection}>Löschen</Button>
                <Flex gap={token.marginXS} style={{ marginLeft: 'auto' }}>  
                  <Button onClick={exitEditMode}>Abbrechen</Button>
                </Flex>
              </Flex>
            ) : undefined}
          />
        </div>
        <ContactSidebar
          contact={selectedContact}
          open={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          onMerge={() => {
            if (selectedContact) {
              setEditMode(true)
              setSelectedRowKeys([selectedContact.id])
            }
          }}
          getContainer={() => containerRef.current!}
        />
      </div>

      {selectedContacts.length === 2 && (
        <MergeManualModal
          open={mergeManualOpen}
          contacts={selectedContacts as [Contact, Contact]}
          onClose={() => setMergeManualOpen(false)}
        />
      )}
    </PageLayout>
  )
}
