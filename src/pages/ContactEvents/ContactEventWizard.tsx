import { useState } from 'react'
import type React from 'react'
import { Form, Input, Select, InputNumber, Segmented, DatePicker, Switch, Upload, Button, Flex, Tooltip, Typography, theme, message } from 'antd'
import type { UploadFile } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faPen, faXmark, faPlus, faCircleInfo } from '@fortawesome/pro-light-svg-icons'
import { Header } from '../../designsystem/sharedComponents'
import { WizardModalFooter, GreyButton } from '../../designsystem/components'
import {
  contactEvents,
  buildHandlers,
  contactFieldOptions,
  conditionFieldOptions,
  conditionOperatorOptions,
  vorgangOptions,
  sichtbarkeitOptions,
  vorgangStatusOptions,
  assigneeOptions,
  errorHandlingOptions,
  audienceOptions,
  type ContactEvent,
  type ContactEventCondition,
} from '../../data/contactEvents'
import MessagePreview from './MessagePreview'

const { Text, Title } = Typography
const { RangePicker } = DatePicker

const WIZARD_STEPS = [
  { title: 'Informationen' },
  { title: 'Nachricht' },
  { title: 'Einstellungen' },
  { title: 'Aktionen' },
]

type FormValues = {
  name: string
  description?: string
  timeframe: 'unlimited' | 'range'
  contactField: string
  offsetDirection: 'before' | 'after'
  offsetDays: number
  audienceId?: string
  vorgang: string
  sichtbarkeit: string
  status: string
  assignee: string
  errorHandling: string
}

function Card({
  title, description, extra, children,
}: {
  title: string
  description?: string
  extra?: React.ReactNode
  children: React.ReactNode
}) {
  const { token } = theme.useToken()
  return (
    <Flex
      vertical
      style={{
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: token.paddingLG,
      }}
    >
      <Flex align="center" justify="space-between">
        <Title level={5} style={{ margin: 0 }}>{title}</Title>
        {extra}
      </Flex>
      {description && <Text type="secondary" style={{ marginBottom: token.marginSM }}>{description}</Text>}
      <Flex vertical gap={token.margin} style={{ marginTop: token.marginSM }}>
        {children}
      </Flex>
    </Flex>
  )
}

function FieldLabel({ label, help }: { label: string; help: string }) {
  const { token } = theme.useToken()
  return (
    <Flex align="center" gap={token.marginXXS}>
      <Text>{label}</Text>
      <Tooltip title={help}>
        <FontAwesomeIcon
          icon={faCircleInfo}
          style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM, cursor: 'help' }}
        />
      </Tooltip>
    </Flex>
  )
}

export default function ContactEventWizard() {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const [form] = Form.useForm<FormValues>()
  const [step, setStep] = useState(0)
  const [conditions, setConditions] = useState<ContactEventCondition[]>([])
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([])
  const [imageUrl, setImageUrl] = useState<string>()
  const [messageEditable, setMessageEditable] = useState(true)
  const timeframe = Form.useWatch('timeframe', form)

  function handleImageChange(info: { fileList: UploadFile[] }) {
    setImageFiles(info.fileList.slice(-1))
    const file = info.fileList[info.fileList.length - 1]
    setImageUrl(file ? URL.createObjectURL(file.originFileObj ?? (file as unknown as File)) : undefined)
  }

  async function handleNext() {
    if (step < 3) {
      try {
        await form.validateFields()
      } catch {
        message.error('Bitte füllen Sie alle Pflichtfelder aus.')
        return
      }
      setStep(step + 1)
      return
    }

    const values = form.getFieldsValue()
    const newEvent: ContactEvent = {
      id: `ce-${Date.now()}`,
      name: values.name,
      description: values.description ?? '',
      status: 'draft',
      versionMajor: 0,
      versionMinor: 1,
      image: imageUrl ?? '',
      message: {
        greeting: 'Hallo {Vorname}',
        body: 'Ihre individuelle Nachricht erscheint hier.',
        signature: 'Viele Grüße Ihr Team',
        buttons: ['Ja, sehr gerne'],
      },
      trigger: {
        contactField: values.contactField,
        offsetDirection: values.offsetDirection,
        offsetDays: values.offsetDays,
      },
      conditions,
      audienceId: values.audienceId,
      actions: { vorgang: values.vorgang, sichtbarkeit: values.sichtbarkeit, status: values.status },
      assignee: values.assignee,
      errorHandling: values.errorHandling,
      stats: {
        handlerCount: 0,
        handlerPercent: 0,
        contactCount: 0,
        contactCountChangePercent: 0,
        durationPerSession: '0 min',
        durationChangePercent: 0,
        sessionsPerContact: 0,
        sessionsPerContactChangePercent: 0,
        sessions: 0,
        sessionsChangePercent: 0,
        sessionsCompleted: 0,
        sessionsCompletedChangePercent: 0,
        sessionsActive: 0,
        sessionsActiveChangePercent: 0,
        sessionsError: 0,
        sessionsErrorChangePercent: 0,
      },
      handlers: buildHandlers(0),
      createdAt: new Date().toLocaleDateString('de-DE'),
      createdBy: 'Marc Lobinger',
    }
    contactEvents.unshift(newEvent)
    message.success('Kunden-Event wurde erstellt')
    navigate(`/automation/contact-events/${newEvent.id}`)
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  function addCondition() {
    setConditions(prev => [...prev, { field: 'case-created', operator: 'equals', value: '' }])
  }

  function removeCondition(index: number) {
    setConditions(prev => prev.filter((_, i) => i !== index))
  }

  function updateCondition(index: number, patch: Partial<ContactEventCondition>) {
    setConditions(prev => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)))
  }

  return (
    <Flex vertical style={{ height: '100%', minHeight: 0 }}>
      <Header
        backButton
        title="Kunden-Event erstellen"
        secondaryButtons={
          <GreyButton onClick={() => navigate('/automation/contact-events')}>Abbrechen</GreyButton>
        }
      />

      <Flex style={{ flex: 1, overflow: 'auto', padding: token.paddingXL }} justify="center">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          style={{ width: '100%', maxWidth: 620 }}
          initialValues={{
            timeframe: 'unlimited',
            offsetDirection: 'before',
            offsetDays: 3,
            vorgang: 'existing',
            sichtbarkeit: 'none',
            status: 'none',
            assignee: 'none',
            errorHandling: 'none',
          }}
        >
          {step === 0 && (
            <Card title="Informationen" description="Die folgenden Informationen werden dem Händler angezeigt.">
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Bitte geben Sie einen Namen ein' }]}
              >
                <Input showCount maxLength={60} placeholder="z.B. Geburtstagsnachricht" />
              </Form.Item>
              <Form.Item name="description" label="Beschreibung">
                <Input.TextArea showCount maxLength={1024} rows={3} />
              </Form.Item>
              <Flex gap={token.marginXS} align="flex-start">
                <Form.Item name="timeframe" label="Aktionszeitraum" style={{ flex: timeframe === 'range' ? undefined : 1 }}>
                  <Segmented
                    options={[
                      { label: 'Unbeschränkt', value: 'unlimited' },
                      { label: 'Zeitraum wählen', value: 'range' },
                    ]}
                  />
                </Form.Item>
                {timeframe === 'range' && (
                  <Form.Item name="dateRange" label=" " style={{ flex: 1 }}>
                    <RangePicker style={{ width: '100%' }} placeholder={['Startdatum', 'Enddatum']} />
                  </Form.Item>
                )}
              </Flex>
              <Flex vertical gap={token.marginXS}>
                <Text>Bild</Text>
                <Upload
                  listType="picture-card"
                  fileList={imageFiles}
                  maxCount={1}
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                >
                  {imageFiles.length === 0 && (
                    <Flex vertical align="center" gap={token.marginXXS}>
                      <FontAwesomeIcon icon={faCirclePlus} style={{ fontSize: token.fontSizeLG, color: token.colorTextSecondary }} />
                      <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Hochladen</Text>
                    </Flex>
                  )}
                </Upload>
              </Flex>
            </Card>
          )}

          {step === 1 && (
            <Card
              title="Nachricht"
              description="Diese Nachricht wird an den Kunden verschickt."
              extra={
                <Flex align="center" gap={token.marginXS}>
                  <Text>Bearbeitbar</Text>
                  <Switch checked={messageEditable} onChange={setMessageEditable} />
                </Flex>
              }
            >
              <Flex vertical align="center" gap={token.margin}>
                <MessagePreview
                  image={imageUrl}
                  message={{
                    greeting: 'Hallo {Vorname}',
                    body: 'Ihre individuelle Nachricht erscheint hier.',
                    signature: 'Viele Grüße Ihr Team',
                    buttons: ['Ja, sehr gerne'],
                  }}
                />
                <Button icon={<FontAwesomeIcon icon={faPen} />} disabled={!messageEditable}>
                  Nachricht bearbeiten
                </Button>
              </Flex>
            </Card>
          )}

          {step === 2 && (
            <Flex vertical gap={token.margin}>
              <Card title="Auslöser" description="Definieren Sie wann die Automation ausgelöst werden soll.">
                <Form.Item
                  name="contactField"
                  label={<FieldLabel label="Kontakt-Feld" help="Das Kontakt-Feld, dessen Datum den Auslöser bestimmt." />}
                  rules={[{ required: true, message: 'Bitte wählen Sie ein Kontakt-Feld' }]}
                >
                  <Select options={contactFieldOptions} placeholder="Feld wählen" />
                </Form.Item>
                <Flex gap={token.marginXS}>
                  <Form.Item
                    name="offsetDirection"
                    label={<FieldLabel label="Zeitlicher Versatz" help="Wie viele Tage vor oder nach dem Auslöser-Datum die Nachricht verschickt wird." />}
                    style={{ flex: 1 }}
                  >
                    <Select
                      options={[
                        { value: 'before', label: 'Tage vorher' },
                        { value: 'after', label: 'Tage danach' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="offsetDays" label=" " style={{ width: 100 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Flex>
              </Card>

              <Card title="Bedingungen" description="Beschreibung">
                {conditions.map((condition, index) => (
                  <Flex key={index} gap={token.marginXS} align="center">
                    <Select
                      value={condition.field}
                      options={conditionFieldOptions}
                      style={{ flex: 1 }}
                      onChange={value => updateCondition(index, { field: value })}
                    />
                    <Select
                      value={condition.operator}
                      options={conditionOperatorOptions}
                      style={{ width: 130 }}
                      onChange={value => updateCondition(index, { operator: value })}
                    />
                    <Input
                      value={condition.value}
                      style={{ flex: 1 }}
                      onChange={e => updateCondition(index, { value: e.target.value })}
                    />
                    <Tooltip title="Entfernen">
                      <Button
                        variant="text"
                        color="default"
                        icon={<FontAwesomeIcon icon={faXmark} />}
                        onClick={() => removeCondition(index)}
                      />
                    </Tooltip>
                  </Flex>
                ))}
                <Button icon={<FontAwesomeIcon icon={faPlus} />} onClick={addCondition} style={{ alignSelf: 'flex-start' }}>
                  Bedingung hinzufügen
                </Button>
              </Card>

              <Card title="Zielgruppe" description="Dient der Vorbefüllung der Kontaktliste.">
                <Flex gap={token.marginXS}>
                  <Form.Item name="audienceId" style={{ flex: 1, marginBottom: 0 }}>
                    <Select options={audienceOptions} placeholder="Auswählen" allowClear />
                  </Form.Item>
                  <Button onClick={() => message.info('Zielgruppe erstellen ist in diesem Prototyp nicht verfügbar.')}>
                    Zielgruppe erstellen
                  </Button>
                </Flex>
              </Card>
            </Flex>
          )}

          {step === 3 && (
            <Flex vertical gap={token.margin}>
              <Card title="Vorgang" description="Definieren Sie wann die Automation ausgelöst werden soll.">
                <Form.Item name="vorgang" label={<FieldLabel label="Vorgang" help="Ob und welcher Vorgang für den Kunden verwendet wird." />}>
                  <Select options={vorgangOptions} />
                </Form.Item>
                <Form.Item name="sichtbarkeit" label={<FieldLabel label="Sichtbarkeit" help="Ob sich die Sichtbarkeit des Vorgangs ändern soll." />}>
                  <Select options={sichtbarkeitOptions} />
                </Form.Item>
                <Form.Item name="status" label={<FieldLabel label="Status" help="Ob sich der Status des Vorgangs ändern soll." />}>
                  <Select options={vorgangStatusOptions} />
                </Form.Item>
              </Card>

              <Card title="Teammitglied zuweisen" description="Welchem Teammitglied soll der Vorgang zugewiesen werden?">
                <Form.Item name="assignee" style={{ marginBottom: 0 }}>
                  <Select options={assigneeOptions} />
                </Form.Item>
              </Card>

              <Card title="Fehlermanagement" description="Was soll passieren wenn bei der Automation ein Fehler auftritt?">
                <Form.Item name="errorHandling" style={{ marginBottom: 0 }}>
                  <Select options={errorHandlingOptions} />
                </Form.Item>
              </Card>
            </Flex>
          )}
        </Form>
      </Flex>

      <WizardModalFooter
        currentStep={step}
        steps={WIZARD_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={step === 3 ? 'Speichern' : undefined}
        bordered={false}
      />
    </Flex>
  )
}
