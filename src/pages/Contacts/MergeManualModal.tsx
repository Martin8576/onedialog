import type React from 'react'
import { useState } from 'react'
import {
  Modal, Button, Flex, Typography, Input, InputNumber, Switch, Tag, Select, theme, message,
} from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faCircleInfo, faLocationDot, faCalendar,
} from '@fortawesome/pro-light-svg-icons'
import type { Contact } from '../../data/contacts'
import { users } from '../../data/users'

const { Text } = Typography

type FieldType = 'text' | 'number' | 'switch' | 'date' | 'tags' | 'select' | 'optinswitch'
type FieldDef = { key: keyof Contact; label: string; type: FieldType; options?: string[] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SectionDef = { key: string; icon: any; title: string; fields: FieldDef[] }

const SECTIONS: SectionDef[] = [
  {
    key: 'kunde', icon: faUser, title: 'Kunde',
    fields: [
      { key: 'firstName', label: 'Vorname', type: 'text' },
      { key: 'lastName', label: 'Nachname', type: 'text' },
      { key: 'birthDate', label: 'Geburtstag', type: 'date' },
      { key: 'assignee', label: 'Ansprechpartner', type: 'select', options: users.map(u => u.name) },
    ],
  },
  {
    key: 'attributes', icon: faCircleInfo, title: 'Kontakt-Attribute',
    fields: [
      { key: 'company', label: 'Firma', type: 'text' },
      { key: 'contracts', label: 'Verträge', type: 'number' },
      { key: 'isVip', label: 'VIP-Kunde', type: 'switch' },
      { key: 'optIn', label: 'Opt-In', type: 'optinswitch' },
      { key: 'labels', label: 'Labels', type: 'tags' },
      { key: 'leadQualification', label: 'Lead-Qualifizierung', type: 'tags' },
    ],
  },
  {
    key: 'adresse', icon: faLocationDot, title: 'Adresse',
    fields: [{ key: 'address', label: 'Adresse', type: 'text' }],
  },
]

function channelLabel(c: Contact): string {
  const map: Record<string, string> = {
    whatsapp: 'WhatsApp', facebook: 'Facebook', email: 'E-Mail', phone: 'Telefon',
  }
  return c.channels[0] ? (map[c.channels[0]] ?? '') : ''
}

type Side = 0 | 1
type MergedValues = Record<string, unknown>
type Props = { open: boolean; contacts: [Contact, Contact]; onClose: () => void }

function isEmpty(type: FieldType, v: unknown): boolean {
  if (type === 'switch' || type === 'optinswitch') return false
  if (v == null || v === '') return true
  if (Array.isArray(v) && (v as unknown[]).length === 0) return true
  return false
}

function hasConflict(field: FieldDef, a: Contact, b: Contact): boolean {
  if (field.type === 'tags') return false
  const va = a[field.key], vb = b[field.key]
  if (isEmpty(field.type, va) || isEmpty(field.type, vb)) return false
  return JSON.stringify(va) !== JSON.stringify(vb)
}

function initSels(contacts: [Contact, Contact]): Record<string, Side> {
  const init: Record<string, Side> = {}
  init['img'] = (!contacts[0].img && contacts[1].img ? 1 : 0) as Side
  SECTIONS.forEach(s => s.fields.forEach(f => {
    if (f.type === 'tags') { init[f.key as string] = 0; return }
    const v0 = contacts[0][f.key]
    init[f.key as string] = (!isEmpty(f.type, v0) ? 0 : isEmpty(f.type, contacts[1][f.key]) ? 0 : 1) as Side
  }))
  return init
}

function initMerged(contacts: [Contact, Contact]): MergedValues {
  const init: MergedValues = {}
  SECTIONS.forEach(s => s.fields.forEach(f => {
    if (f.type === 'tags') {
      const all = contacts.flatMap(c => (c[f.key] as string[]) ?? [])
      init[f.key as string] = [...new Set(all)]
      return
    }
    for (const c of contacts) {
      const v = c[f.key]
      if (!isEmpty(f.type, v)) { init[f.key as string] = v; return }
    }
    init[f.key as string] = f.type === 'number' ? 0 : f.type === 'switch' ? false : f.type === 'optinswitch' ? 'unknown' : ''
  }))
  return init
}

function HoverRow({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: token.borderRadius,
        padding: token.paddingXS,
        background: hovered ? token.colorFillAlter : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </div>
  )
}

// Clickable read-only cell used in the two source contact columns
function ClickableCell({ field, value, selected, onClick, inactive }: {
  field: FieldDef
  value: unknown
  selected: boolean
  onClick?: () => void
  inactive?: boolean
}) {
  const { token } = theme.useToken()
  const [hovered, setHovered] = useState(false)

  let content: React.ReactNode
  if (field.type === 'switch') {
    content = <Switch checked={!!value} size="small" disabled style={{ pointerEvents: 'none' }} />
  } else if (field.type === 'optinswitch') {
    content = <Switch checked={value === 'yes'} size="small" disabled style={{ pointerEvents: 'none' }} />
  } else if (field.type === 'tags') {
    const tags = (value as string[]) ?? []
    content = tags.length > 0
      ? <Flex gap={4} wrap="wrap">{tags.map(t => <Tag key={t} style={{ margin: 0 }}>{t}</Tag>)}</Flex>
      : <Text type="secondary">–</Text>
  } else {
    const str = value != null && value !== '' ? String(value) : '–'
    content = <Text style={{ color: value != null && value !== '' ? undefined : token.colorTextDisabled }}>{str}</Text>
  }

  return (
    <Flex
      align="center"
      gap={token.marginXS}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '4px 10px',
        borderRadius: token.borderRadius,
        background: !inactive && selected ? token.colorPrimaryBg : hovered && !inactive ? token.colorFillAlter : 'transparent',
        cursor: onClick && !inactive ? 'pointer' : 'default',
        opacity: inactive ? 0.45 : 1,
        transition: 'background 0.15s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>{content}</div>
    </Flex>
  )
}

function MergedFieldInput({ field, mergedValues, onChange }: {
  field: FieldDef
  mergedValues: MergedValues
  onChange: (key: string, value: unknown) => void
}) {
  const { token } = theme.useToken()
  const value = mergedValues[field.key as string]
  if (field.type === 'switch') {
    return (
      <Flex align="center"
        style={{ minHeight: 32, padding: '4px 11px', border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius, background: token.colorBgContainer }}>
        <Switch checked={!!value} size="small" onChange={checked => onChange(field.key as string, checked)} />
      </Flex>
    )
  }
  if (field.type === 'optinswitch') {
    return (
      <Flex align="center"
        style={{ minHeight: 32, padding: '4px 11px', border: `1px solid ${token.colorBorder}`, borderRadius: token.borderRadius, background: token.colorBgContainer }}>
        <Switch checked={value === 'yes'} size="small" onChange={checked => onChange(field.key as string, checked ? 'yes' : 'no')} />
      </Flex>
    )
  }
  if (field.type === 'select') {
    return (
      <Select
        value={value as string}
        onChange={v => onChange(field.key as string, v)}
        style={{ width: '100%' }}
        options={field.options?.map(o => ({ value: o, label: o }))}
      />
    )
  }
  if (field.type === 'tags') {
    return (
      <Select
        mode="tags"
        value={(value as string[]) ?? []}
        onChange={v => onChange(field.key as string, v)}
        style={{ width: '100%' }}
        suffixIcon={null}
        options={field.options?.map(o => ({ value: o, label: o })) ?? []}
      />
    )
  }
  if (field.type === 'number') {
    return <InputNumber value={value as number ?? 0} onChange={v => onChange(field.key as string, v)} style={{ width: '100%' }} />
  }
  if (field.type === 'date') {
    return (
      <Input
        value={String(value ?? '')}
        onChange={e => onChange(field.key as string, e.target.value)}
        suffix={<FontAwesomeIcon icon={faCalendar} style={{ color: token.colorTextDisabled }} />}
      />
    )
  }
  return <Input value={String(value ?? '')} onChange={e => onChange(field.key as string, e.target.value)} />
}

function ContactCard({ contact }: {
  contact: Contact
  side: Side
  sels: Record<string, Side>
  onPick: (key: string, side: Side) => void
}) {
  const { token } = theme.useToken()
  const creationAction = contact.actions.find(a => a.type === 'Kontakt erstellt')

  return (
    <Flex
      vertical
      gap={token.marginSM}
      style={{
        flex: 1,
        padding: token.padding,
        borderRadius: token.borderRadiusLG,
        background: token.colorFillAlter,
      }}
    >
      <Flex align="center" gap={token.marginSM}>
        <Flex vertical style={{ flex: 1 }}>
          <Text strong style={{ fontSize: token.fontSizeSM }}>{contact.firstName} {contact.lastName}</Text>
          <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{channelLabel(contact)}</Text>
          {creationAction && (
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              Erstellt {creationAction.date}{creationAction.actor ? ` von ${creationAction.actor}` : ''}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default function MergeManualModal({ open, contacts, onClose }: Props) {
  const { token } = theme.useToken()
  const [a, b] = contacts
  const [sels, setSels] = useState<Record<string, Side>>(() => initSels(contacts))
  const [mergedValues, setMergedValues] = useState<MergedValues>(() => initMerged(contacts))
  const [tagSels, setTagSels] = useState<Record<string, [boolean, boolean]>>(() => {
    const init: Record<string, [boolean, boolean]> = {}
    SECTIONS.forEach(s => s.fields.forEach(f => {
      if (f.type === 'tags') init[f.key as string] = [true, true]
    }))
    return init
  })

  function pick(key: string, side: Side) {
    setSels(prev => ({ ...prev, [key]: side }))
    setMergedValues(prev => ({ ...prev, [key]: contacts[side][key as keyof Contact] }))
  }

  function toggleTagSel(key: string, side: Side) {
    setTagSels(prev => {
      const cur = prev[key] ?? ([true, true] as [boolean, boolean])
      const next: [boolean, boolean] = side === 0 ? [!cur[0], cur[1]] : [cur[0], !cur[1]]
      const tags0 = next[0] ? ((contacts[0][key as keyof Contact] as string[]) ?? []) : []
      const tags1 = next[1] ? ((contacts[1][key as keyof Contact] as string[]) ?? []) : []
      setMergedValues(prev2 => ({ ...prev2, [key]: [...new Set([...tags0, ...tags1])] }))
      return { ...prev, [key]: next }
    })
  }

  function setMerged(key: string, value: unknown) {
    setMergedValues(prev => ({ ...prev, [key]: value }))
  }

  const LABEL_W = 148

  return (
    <Modal
      open={open}
      title="Prüfen Sie die zusammengeführten Kontaktinformationen"
      onCancel={onClose}
      width={1200}
      destroyOnClose
      maskClosable={false}
      centered
      styles={{
        container: { height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', padding: 0 },
        header: { padding: token.padding, margin: 0 },
        body: { overflowY: 'auto', flex: 1 },
        footer: { padding: token.padding, margin: 0 }
      }}
      footer={
        <Flex justify="flex-end" gap={token.marginXS}>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button type="primary" onClick={() => { void message.success('Kontakte erfolgreich zusammengeführt.'); onClose() }}>Kontakt speichern</Button>
        </Flex>
      }
    >
      <Flex vertical style={{ height: '90vh' }}>
        {/* Contact header cards row */}
        <Flex gap={token.marginMD} style={{ padding: `${token.paddingMD}px ${token.paddingLG}px`, flexShrink: 0 }}>
          <div style={{ width: LABEL_W, flexShrink: 0 }} />
          <ContactCard contact={a} side={0} sels={sels} onPick={pick} />
          <ContactCard contact={b} side={1} sels={sels} onPick={pick} />
          <Flex align="center" justify="center"
          style={{
            flex: 1,
            padding: token.padding,
            borderRadius: token.borderRadiusLG,
            background: token.colorPrimaryBg,
          }}
          >
            <Text strong>Neuer Kontakt</Text>
          </Flex>
        </Flex>

        {/* Scrollable field rows */}
        <div style={{ flex: 1, padding: `0 ${token.paddingLG}px ${token.paddingLG}px` }}>
          {SECTIONS.map(section => (
            <div key={section.key} style={{ marginBottom: token.marginLG }}>
              {/* Section divider */}
              <Flex align="center" gap={token.marginXS} style={{ marginBottom: token.marginSM, paddingBottom: token.paddingXS, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
                <FontAwesomeIcon icon={section.icon} style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }} />
                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{section.title}</Text>
              </Flex>

              {/* Image row — only in the Kunde section */}
              {section.key === 'kunde' && (
                <HoverRow>
                <Flex align="flex-start" gap={token.marginLG} >
                  <Flex vertical style={{ width: LABEL_W, flexShrink: 0, paddingTop: token.paddingXS }}>
                    <Text strong style={{ fontSize: token.fontSizeSM }}>Avatar</Text>
                  </Flex>
                  {([0, 1] as Side[]).map(side => {
                    const contact = side === 0 ? a : b
                    const selected = sels['img'] === side
                    return (
                      <div
                        key={side}
                        onClick={() => pick('img', side)}
                        style={{
                          flex: 1, overflow: 'hidden',
                        }}
                      >
                        {contact.img ? (
                          <img src={contact.img} alt="" style={{ width: '120px', aspectRatio: '4/3', objectFit: 'cover', display: 'block', borderRadius: token.borderRadius, border: `1px solid ${selected ? token.colorPrimary : token.colorBorder}`,
                          cursor: 'pointer',
                          transition: 'border-color 0.15s', }} />
                        ) : (
                          <Flex align="center" justify="center" style={{ width: '120px', aspectRatio: '4/3', background: token.colorFillAlter, borderRadius: token.borderRadius, border: `1px solid ${selected ? token.colorPrimary : token.colorBorder}`,
                          cursor: 'pointer',
                          transition: 'border-color 0.15s', }}>
                            <Text type="secondary">Kein Bild</Text>
                          </Flex>
                        )}
                        {selected && (
                          <Flex align="center" justify="center"
                            style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: token.colorPrimary }}>
                          </Flex>
                        )}
                      </div>
                    )
                  })}
                  {/* Merged image */}
                  <div style={{ flex: 1, borderRadius: token.borderRadius, overflow: 'hidden' }}>
                    {contacts[sels['img'] ?? 0]?.img ? (
                      <img src={contacts[sels['img'] ?? 0].img!} alt="" style={{ width: '120px', aspectRatio: '4/3', objectFit: 'cover', borderRadius: token.borderRadius, display: 'block', border: `1px solid ${token.colorBorder}` }} />
                    ) : (
                      <Flex align="center" justify="center" style={{ width: '120px', aspectRatio: '4/3', background: token.colorFillAlter }}>
                        <Text type="secondary">Kein Bild</Text>
                      </Flex>
                    )}
                  </div>
                </Flex>
                </HoverRow>
              )}
              {/* Field rows */}
              <Flex vertical>
                {section.fields.map(field => {
                  const isTags = field.type === 'tags'
                  const conflict = hasConflict(field, a, b)
                  const leftSel = sels[field.key as string] === 0
                  const rightSel = sels[field.key as string] === 1

                  return (
                    <HoverRow key={field.key as string}>
                    <Flex align="flex-start" gap={token.marginLG}>
                      {/* Label */}
                      <Flex vertical style={{ width: LABEL_W, flexShrink: 0, paddingTop: 6 }}>
                        <Text strong style={{ fontSize: token.fontSizeSM }}>{field.label}</Text>
                      </Flex>
                      {/* Contact 1 */}
                      <ClickableCell
                        field={field}
                        value={a[field.key]}
                        selected={isTags ? (tagSels[field.key as string]?.[0] ?? true) : leftSel}
                        inactive={!isTags && !conflict}
                        onClick={isTags ? () => toggleTagSel(field.key as string, 0) : (!conflict ? undefined : () => pick(field.key as string, 0))}
                      />
                      {/* Contact 2 */}
                      <ClickableCell
                        field={field}
                        value={b[field.key]}
                        selected={isTags ? (tagSels[field.key as string]?.[1] ?? true) : rightSel}
                        inactive={!isTags && !conflict}
                        onClick={isTags ? () => toggleTagSel(field.key as string, 1) : (!conflict ? undefined : () => pick(field.key as string, 1))}
                      />
                      {/* Merged editable */}
                      <div style={{ flex: 1 }}>
                        <MergedFieldInput field={field} mergedValues={mergedValues} onChange={setMerged} />
                      </div>
                    </Flex>
                    </HoverRow>
                  )
                })}
              </Flex>
            </div>
          ))}
        </div>
      </Flex>
    </Modal>
  )
}
