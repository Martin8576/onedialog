import { useState, useRef, useMemo } from 'react'
import { Flex, Segmented, Tag, theme, message } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/pro-light-svg-icons'
import { Header } from '../../designsystem/sharedComponents'
import { ListItem } from '../../designsystem/components'
import { phoneAssistants as initialAssistants, type PhoneAssistant } from '../../data/phoneAssistants'
import PhoneAssistantSidebar from './PhoneAssistantSidebar'
import CreatePhoneAssistantModal from './CreatePhoneAssistantModal'

type StatusFilter = 'all' | 'active' | 'inactive'

export default function PhoneAssistants() {
  const { token } = theme.useToken()
  const containerRef = useRef<HTMLDivElement>(null)
  const [assistants, setAssistants] = useState<PhoneAssistant[]>(initialAssistants)
  const [selectedAssistant, setSelectedAssistant] = useState<PhoneAssistant | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editingAssistant, setEditingAssistant] = useState<PhoneAssistant | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredAssistants = useMemo(() => {
    if (statusFilter === 'active') return assistants.filter(a => a.status === 'active')
    if (statusFilter === 'inactive') return assistants.filter(a => a.status === 'inactive')
    return assistants
  }, [assistants, statusFilter])

  function handleDelete(id: string) {
    setAssistants(prev => prev.filter(a => a.id !== id))
    if (selectedAssistant?.id === id) setSelectedAssistant(null)
    message.success('Assistent gelöscht')
  }

  function handleUpdate(updated: PhoneAssistant) {
    setAssistants(prev => prev.map(a => a.id === updated.id ? updated : a))
    setSelectedAssistant(updated)
  }

  function handleEdit(assistant: PhoneAssistant) {
    setEditingAssistant(assistant)
  }

  function handleModalClose() {
    setCreateModalOpen(false)
    setEditingAssistant(null)
  }

  function handleCreate(assistant: PhoneAssistant) {
    setAssistants(prev => [assistant, ...prev])
  }

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Header
        title="KI Telefon Assistent"
        tabs={
          <Segmented
            value={statusFilter}
            options={[
              { label: 'Alle', value: 'all' },
              { label: 'Aktive', value: 'active' },
              { label: 'Inaktive', value: 'inactive' },
            ]}
            onChange={value => setStatusFilter(value as StatusFilter)}
          />
        }
        addButton
        addButtonText="Assistent hinzufügen"
        onAdd={() => setCreateModalOpen(true)}
      />

      <Flex
        ref={containerRef}
        style={{ width: '100%', minHeight: 0, padding: token.paddingLG, position: 'relative', overflow: 'hidden', height: '100%' }}
      >
          <Flex vertical gap={token.marginSM} style={{flex: 1, maxWidth: 1024}}>
            {filteredAssistants.map(assistant => (
              <ListItem
                key={assistant.id}
                state={selectedAssistant?.id === assistant.id ? 'active' : 'default'}
                onClick={() =>
                  setSelectedAssistant(prev => prev?.id === assistant.id ? null : assistant)
                }
                title={assistant.name}
                description={`${assistant.team} (${assistant.phoneNumber})`}
                tags={(
                  <>
                    <Tag icon={<FontAwesomeIcon icon={faPhone} />}>
                      {assistant.answeredCalls.toLocaleString('de-DE')}
                    </Tag>
                    <Tag color={assistant.status === 'active' ? 'success' : 'default'}>
                      {assistant.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Tag>
                  </>
                )}
                arrow
              />
            ))}
          </Flex>

        <PhoneAssistantSidebar
          assistant={selectedAssistant}
          open={!!selectedAssistant}
          onClose={() => setSelectedAssistant(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onEdit={handleEdit}
          getContainer={() => containerRef.current!}
        />
      </Flex>

      <CreatePhoneAssistantModal
        open={createModalOpen || !!editingAssistant}
        assistant={editingAssistant}
        onClose={handleModalClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </Flex>
  )
}
