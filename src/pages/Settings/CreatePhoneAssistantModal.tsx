import { useState, useEffect } from 'react'
import type React from 'react'
import {
  Modal, Form, Input, Select, Flex, Typography, Button, Upload, Tag, Alert,
  Tooltip, Space, Checkbox, Radio, theme, message,
} from 'antd'
import type { FormInstance, UploadFile } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faFileArrowUp, faTrash, faPlay, faListCheck, faCircleInfo, faWandMagicSparkles, faClipboardList } from '@fortawesome/pro-light-svg-icons'
import { WizardModalFooter } from '../../designsystem/components'
import { users } from '../../data/users'
import {
  voiceOptions, languageOptions, phoneLineGroups,
  capabilityOptions, getVoiceByValue, getPhoneLineByValue, getPhoneLineValueForAssistant,
  type KnowledgeSource, type PhoneAssistant, type WebsiteKnowledgeSource,
  type Capability, type Addressing, type InternalProcessing,
} from '../../data/phoneAssistants'

const { Text } = Typography

const WIZARD_STEPS = [
  { title: 'Einstellungen' },
  { title: 'Fähigkeiten' },
  { title: 'Testen' },
]

type FormValues = {
  name: string
  addressing: Addressing
  voice: string
  language: string
  phoneLine: string
  greetingMessage: string
  additionalPrompt?: string
  createCaseEnabled: boolean
  createCaseAssignee?: string
  scheduleAppointmentEnabled: boolean
  scheduleAppointmentAssignee?: string
  createTaskEnabled: boolean
  createTaskAssignee?: string
  capabilities: Capability[]
}

const DEFAULT_TEST_PHONE = '+49 170 1234567'

const employeeOptions = users.map(u => ({ value: u.id, label: u.name }))

const DEFAULT_FORM_VALUES: Partial<FormValues> = {
  addressing: 'sie',
  capabilities: [],
  language: 'de',
  voice: 'sophie',
  greetingMessage: 'Guten Tag, hier spricht der KI-Assistent von oneDialog. Wie kann ich Ihnen helfen?',
  createCaseEnabled: false,
  scheduleAppointmentEnabled: false,
  createTaskEnabled: false,
}

type Props = {
  open: boolean
  assistant?: PhoneAssistant | null
  onClose: () => void
  onCreate: (assistant: PhoneAssistant) => void
  onUpdate?: (assistant: PhoneAssistant) => void
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

function FormSection({ icon, title, children }: { icon: typeof faGlobe; title: string; children: React.ReactNode }) {
  const { token } = theme.useToken()
  return (
    <div
      style={{
        marginBottom: token.margin,
        background: token.colorGrey6,
        borderRadius: token.borderRadius,
        padding: token.padding,
        paddingBottom: token.paddingXS,
      }}
    >
      <SectionHeader icon={icon} label={title} />
      {children}
    </div>
  )
}

function InternalProcessingField({
  form,
  enabledName,
  assigneeName,
  label,
}: {
  form: FormInstance<FormValues>
  enabledName: keyof FormValues
  assigneeName: keyof FormValues
  label: string
}) {
  const { token } = theme.useToken()
  const enabled = Form.useWatch(enabledName, form)

  return (
    <Flex >
      <Form.Item name={enabledName} valuePropName="checked" style={{ marginBottom: token.marginXS }}>
        <Checkbox><Text>{label}</Text></Checkbox>
      </Form.Item>
      {enabled && (
        <Form.Item
          name={assigneeName}
          rules={[{ required: true, message: 'Bitte wählen Sie einen Mitarbeiter' }]}
          style={{ marginBottom: 0, paddingLeft: token.paddingLG }}
        >
          <Select size="small" placeholder="Mitarbeiter wählen" options={employeeOptions} />
        </Form.Item>
      )}
    </Flex>
  )
}
function SectionHeader({ icon, label }: { icon: typeof faGlobe; label: string }) {
  const { token } = theme.useToken()
  return (
    <Flex align="center" gap={token.marginXS} style={{ marginBottom: token.marginSM }}>
      <FontAwesomeIcon icon={icon} style={{ color: token.colorTextSecondary, fontSize: token.fontSize }} />
      <Text strong>{label}</Text>
    </Flex>
  )
}

function websiteStatusLabel(status: WebsiteKnowledgeSource['status']): string {
  if (status === 'pending') return 'Ausstehend'
  if (status === 'crawling') return 'Wird verarbeitet'
  return 'Fertig'
}

function websiteStatusColor(status: WebsiteKnowledgeSource['status']): string {
  if (status === 'done') return 'success'
  if (status === 'crawling') return 'processing'
  return 'default'
}

export default function CreatePhoneAssistantModal({ open, assistant, onClose, onCreate, onUpdate }: Props) {
  const { token } = theme.useToken()
  const [form] = Form.useForm<FormValues>()
  const [step, setStep] = useState(0)
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([])
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [testPhone, setTestPhone] = useState(DEFAULT_TEST_PHONE)
  const [testStatus, setTestStatus] = useState<'idle' | 'calling' | 'success'>('idle')
  const isEditMode = !!assistant

  const selectedVoice = Form.useWatch('voice', form)

  function resetState() {
    setStep(0)
    form.resetFields()
    setKnowledgeSources([])
    setWebsiteUrl('')
    setUploadFiles([])
    setTestPhone(DEFAULT_TEST_PHONE)
    setTestStatus('idle')
  }

  useEffect(() => {
    if (!open) return
    if (assistant) {
      const voiceValue = voiceOptions.find(v => v.name === assistant.voice)?.value ?? 'sophie'
      const languageValue = languageOptions.find(l => l.label === assistant.language)?.value ?? 'de'
      const phoneLine = getPhoneLineValueForAssistant(assistant)
      const internal = assistant.internalProcessing
      form.setFieldsValue({
        name: assistant.name,
        addressing: assistant.addressing,
        voice: voiceValue,
        language: languageValue,
        phoneLine,
        greetingMessage: assistant.greetingMessage,
        additionalPrompt: assistant.additionalPrompt,
        capabilities: assistant.capabilities,
        createCaseEnabled: internal?.createCaseEnabled ?? false,
        createCaseAssignee: internal?.createCaseAssignee,
        scheduleAppointmentEnabled: internal?.scheduleAppointmentEnabled ?? false,
        scheduleAppointmentAssignee: internal?.scheduleAppointmentAssignee,
        createTaskEnabled: internal?.createTaskEnabled ?? false,
        createTaskAssignee: internal?.createTaskAssignee,
      })
      setKnowledgeSources(assistant.knowledgeSources)
      setUploadFiles(
        assistant.knowledgeSources
          .filter((s): s is Extract<KnowledgeSource, { type: 'document' }> => s.type === 'document')
          .map((doc, i) => ({
            uid: `${doc.name}-${i}`,
            name: doc.name,
            size: doc.sizeKb * 1024,
            status: 'done' as const,
          })),
      )
      setWebsiteUrl('')
      setTestPhone(DEFAULT_TEST_PHONE)
      setTestStatus('idle')
      setStep(0)
    } else {
      resetState()
    }
  }, [open, assistant, form])

  function buildAssistant(values: FormValues, existing?: PhoneAssistant): PhoneAssistant {
    const voice = getVoiceByValue(values.voice)
    const phoneLine = getPhoneLineByValue(values.phoneLine)
    const languageLabel = languageOptions.find(l => l.value === values.language)?.label ?? values.language
    const internalProcessing: InternalProcessing = {
      createCaseEnabled: values.createCaseEnabled,
      createCaseAssignee: values.createCaseAssignee,
      scheduleAppointmentEnabled: values.scheduleAppointmentEnabled,
      scheduleAppointmentAssignee: values.scheduleAppointmentAssignee,
      createTaskEnabled: values.createTaskEnabled,
      createTaskAssignee: values.createTaskAssignee,
    }

    return {
      id: existing?.id ?? `pa-${Date.now()}`,
      name: values.name,
      status: existing?.status ?? 'inactive',
      phoneNumber: phoneLine?.phoneNumber ?? existing?.phoneNumber ?? '',
      team: phoneLine?.team ?? existing?.team ?? '',
      answeredCalls: existing?.answeredCalls ?? 0,
      voice: voice?.name ?? values.voice,
      language: languageLabel,
      addressing: values.addressing,
      greetingMessage: values.greetingMessage,
      additionalPrompt: values.additionalPrompt,
      capabilities: values.capabilities ?? [],
      knowledgeSources,
      internalProcessing,
    }
  }

  function handleClose() {
    resetState()
    onClose()
  }

  function handlePlayVoice() {
    const voice = getVoiceByValue(selectedVoice)
    if (!voice) return
    message.info(`Sprachprobe: ${voice.name}`)
  }

  function handleCrawlWebsite() {
    const path = websiteUrl.trim().replace(/^https?:\/\//, '')
    if (!path) return
    const url = `https://${path}`
    const newSource: WebsiteKnowledgeSource = { type: 'website', url, status: 'pending' }
    setKnowledgeSources(prev => [...prev, newSource])
    setWebsiteUrl('')

    setTimeout(() => {
      setKnowledgeSources(prev =>
        prev.map(s => s.type === 'website' && s.url === url ? { ...s, status: 'crawling' } : s),
      )
    }, 500)

    setTimeout(() => {
      setKnowledgeSources(prev =>
        prev.map(s => s.type === 'website' && s.url === url ? { ...s, status: 'done' } : s),
      )
    }, 2500)
  }

  function handleRemoveKnowledge(index: number) {
    setKnowledgeSources(prev => prev.filter((_, i) => i !== index))
  }

  function handleUploadChange(info: { fileList: UploadFile[] }) {
    setUploadFiles(info.fileList)
    const docs: KnowledgeSource[] = info.fileList.map(f => ({
      type: 'document' as const,
      name: f.name,
      sizeKb: Math.round((f.size ?? 0) / 1024),
    }))
    setKnowledgeSources(prev => [
      ...prev.filter(s => s.type === 'website'),
      ...docs,
    ])
  }

  function handleTestCall() {
    if (!testPhone.trim()) return
    setTestStatus('calling')
    setTimeout(() => setTestStatus('success'), 3000)
  }

  async function handleNext() {
    if (step === 0) {
      try {
        await form.validateFields()
        setStep(1)
      } catch {
        message.error('Bitte füllen Sie alle Pflichtfelder aus.')
      }
      return
    }
    if (step === 1) {
      setStep(2)
      return
    }

    const values = form.getFieldsValue()
    const result = buildAssistant(values, assistant ?? undefined)

    if (isEditMode && onUpdate) {
      onUpdate(result)
      message.success('Telefonassistent wurde aktualisiert')
    } else {
      onCreate(result)
      message.success('Telefonassistent wurde erstellt')
    }
    handleClose()
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={isEditMode ? 'Telefonassistent bearbeiten' : 'Telefonassistent erstellen'}
      width={720}
      centered
      destroyOnClose
      maskClosable={false}
      footer={
        <WizardModalFooter
          currentStep={step}
          steps={WIZARD_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={isEditMode && step === 2 ? 'Speichern' : undefined}
        />
      }
      styles={{
        container: { height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', padding: 0 },
        header: { padding: token.padding, margin: 0 },
        body: { overflowY: 'auto', flex: 1 },
        footer: { margin: 0 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        initialValues={DEFAULT_FORM_VALUES}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: `0 ${token.padding}px ${token.paddingXXS}px ${token.padding}px`,
          }}
        >
          {step === 0 && (
            <>
              <FormSection icon={faCircleInfo} title="Informationen">
                <Form.Item
                  name="name"
                  label={<FieldLabel label="Name" help="Interner Name zur Identifikation des Assistenten." />}
                  rules={[{ required: true, message: 'Bitte geben Sie einen Namen ein' }]}
                >
                  <Input showCount maxLength={80} placeholder="z.B. Kundenservice Assistent" />
                </Form.Item>

                <Form.Item
                  name="phoneLine"
                  label={<FieldLabel label="Nummer und Team" help="Telefonnummer, über die eingehende Anrufe angenommen werden." />}
                  rules={[{ required: true, message: 'Bitte wählen Sie eine Nummer' }]}
                >
                  <Select placeholder="Nummer wählen">
                    {Object.entries(phoneLineGroups).map(([team, numbers]) => (
                      <Select.OptGroup key={team} label={team}>
                        {numbers.map(n => (
                          <Select.Option key={n.value} value={n.value}>
                            {n.phoneNumber}
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                    ))}
                  </Select>
                </Form.Item>
              </FormSection>

              <FormSection icon={faWandMagicSparkles} title="Assistent">
                <Form.Item
                  name="addressing"
                  label={<FieldLabel label="Ansprache" help="Bestimmt, ob der Assistent Anrufer mit Du oder Sie anspricht." />}
                  rules={[{ required: true, message: 'Bitte wählen Sie eine Ansprache' }]}
                >
                  <Radio.Group>
                    <Radio value="du">Du</Radio>
                    <Radio value="sie">Sie</Radio>
                  </Radio.Group>
                </Form.Item>

                <Flex gap={token.margin}>
                  <Form.Item
                    label={<FieldLabel label="Stimme" help="Wählen Sie die KI-Stimme für Telefongespräche." />}
                    style={{ flex: 1 }}
                  >
                    <Space.Compact style={{ width: '100%' }}>
                      <Form.Item
                        name="voice"
                        noStyle
                        rules={[{ required: true, message: 'Bitte wählen Sie eine Stimme' }]}
                      >
                        <Select
                          placeholder="Stimme wählen"
                          style={{ width: 'calc(100% - 40px)' }}
                          options={voiceOptions.map(v => ({
                            value: v.value,
                            label: v.name,
                          }))}
                          optionRender={option => {
                            const voice = getVoiceByValue(option.value as string)
                            if (!voice) return null
                            return (
                              <Flex vertical gap={0}>
                                <Text>{voice.name}</Text>
                                <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>{voice.description}</Text>
                              </Flex>
                            )
                          }}
                        />
                      </Form.Item>
                      <Tooltip title="Sprachprobe abspielen">
                        <Button
                          icon={<FontAwesomeIcon icon={faPlay} />}
                          onClick={handlePlayVoice}
                          disabled={!selectedVoice}
                        />
                      </Tooltip>
                    </Space.Compact>
                  </Form.Item>

                  <Form.Item
                    name="language"
                    label={<FieldLabel label="Sprache" help="Sprache, in der der Assistent kommuniziert." />}
                    rules={[{ required: true, message: 'Bitte wählen Sie eine Sprache' }]}
                    style={{ flex: 1 }}
                  >
                    <Select placeholder="Sprache wählen" options={languageOptions} />
                  </Form.Item>
                </Flex>

                <Form.Item
                  name="greetingMessage"
                  label={<FieldLabel label="Einstiegsnachricht" help="Die Begrüßung, mit der der Assistent Anrufer begrüßt." />}
                  rules={[{ required: true, message: 'Bitte geben Sie eine Einstiegsnachricht ein' }]}
                >
                  <Input.TextArea showCount maxLength={300} rows={3} placeholder="Guten Tag, hier ist..." />
                </Form.Item>

                <Form.Item
                  name="additionalPrompt"
                  label={<FieldLabel label="Anweisungen an den Assistenten" help="Zusätzliche Anweisungen für das Verhalten des Assistenten." />}
                >
                  <Input.TextArea showCount maxLength={500} rows={3} placeholder="Beantworte Fragen zu..." />
                </Form.Item>
              </FormSection>

              <FormSection icon={faClipboardList} title="Interne Bearbeitung">
                <InternalProcessingField
                  form={form}
                  enabledName="createCaseEnabled"
                  assigneeName="createCaseAssignee"
                  label="Vorgang erstellen"
                />
                <InternalProcessingField
                  form={form}
                  enabledName="scheduleAppointmentEnabled"
                  assigneeName="scheduleAppointmentAssignee"
                  label="Termin vereinbaren"
                />
                <InternalProcessingField
                  form={form}
                  enabledName="createTaskEnabled"
                  assigneeName="createTaskAssignee"
                  label="Aufgabe erstellen"
                />
              </FormSection>
            </>
          )}

        {step === 1 && (
          <Flex vertical gap={token.marginLG}>
            <div style={{ background: token.colorGrey6, borderRadius: token.borderRadius, padding: token.padding }}>
              <SectionHeader icon={faListCheck} label="Fähigkeiten" />
              <Form.Item name="capabilities" style={{ marginBottom: 0 }}>
                <Checkbox.Group style={{ width: '100%' }}>
                  <Flex vertical gap={token.marginSM}>
                    {capabilityOptions.map(cap => (
                      <Checkbox key={cap.value} value={cap.value}>
                        <Text>{cap.label}</Text>
                      </Checkbox>
                    ))}
                  </Flex>
                </Checkbox.Group>
              </Form.Item>
            </div>

            <div style={{ background: token.colorGrey6, borderRadius: token.borderRadius, padding: token.padding }}>
              <SectionHeader icon={faGlobe} label="Wissen" />

              <Text style={{ marginBottom: token.marginXS }}>Website einlesen</Text>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block', marginBottom: token.marginSM }}>
                Fügen Sie eine Webseite hinzu, deren Inhalte der Assistent als Wissensbasis nutzen soll.
              </Text>
              <Flex gap={token.marginXS} style={{ marginBottom: token.marginMD }}>
                <Input
                  addonBefore="https://"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                  onPressEnter={handleCrawlWebsite}
                  style={{ flex: 1 }}
                />
              </Flex>
              {knowledgeSources.filter(s => s.type === 'website').length > 0 && (
                <Flex vertical gap={token.marginXXS} style={{ marginBottom: token.marginLG }}>
                  {knowledgeSources.map((source, i) => {
                    if (source.type !== 'website') return null
                    return (
                      <Flex key={source.url} align="center" justify="space-between" gap={token.marginXS}>
                        <Text ellipsis style={{ flex: 1 }}>{source.url}</Text>
                        <Tag color={websiteStatusColor(source.status)}>{websiteStatusLabel(source.status)}</Tag>
                        <Tooltip title="Entfernen">
                          <Button
                            variant="text"
                            color="default"
                            size="small"
                            icon={<FontAwesomeIcon icon={faTrash} />}
                            onClick={() => handleRemoveKnowledge(i)}
                          />
                        </Tooltip>
                      </Flex>
                    )
                  })}
                </Flex>
              )}

              <Text style={{ marginBottom: token.marginXS }}>Dokumenten-Upload</Text>
              <Text type="secondary" style={{ fontSize: token.fontSizeSM, display: 'block', marginBottom: token.marginSM }}>
                Laden Sie Dokumente hoch, die der Assistent als Wissensbasis verwenden soll.
              </Text>
              <Upload.Dragger
                multiple
                fileList={uploadFiles}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                height={140}
              >
                <Flex vertical align="center" gap={token.marginXS} style={{ padding: token.paddingXS }}>
                  <FontAwesomeIcon icon={faFileArrowUp} style={{ fontSize: token.fontSizeXL, color: token.colorTextSecondary }} />
                  <Text>Dateien hierher ziehen oder klicken zum Hochladen</Text>
                  <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>PDF, DOCX, TXT bis 10 MB</Text>
                </Flex>
              </Upload.Dragger>
            </div>
          </Flex>
        )}

        {step === 2 && (
          <Flex
            vertical
            align="center"
            justify="center"
            gap={token.marginLG}
            style={{
              flex: 1,
              padding: token.paddingXL,
            }}
          >
            <Flex
              vertical
              align="center"
              justify="center"
              gap={token.marginLG}
              style={{
                background: token.colorGrey6,
                borderRadius: token.borderRadius,
                padding: token.paddingXL,
              }}
            >
              <Text style={{ maxWidth: 420, textAlign: 'center' }}>
              Geben Sie Ihre Telefonnummer ein, um einen Testanruf mit dem neuen Assistenten zu starten.
              Der Assistent ruft Sie an und begrüßt Sie mit der konfigurierten Einstiegsnachricht.
            </Text>
              <Input
                placeholder="+49 ..."
                value={testPhone}
                size="large"
                onChange={e => { setTestPhone(e.target.value); setTestStatus('idle') }}
              />
              <Button type="primary" size="large" onClick={handleTestCall} disabled={!testPhone.trim() || testStatus === 'calling'}>
                Testanruf starten
              </Button>
            {testStatus === 'calling' && (
              <Alert type="info" message="Anruf wird eingeleitet…" showIcon style={{ width: '100%', maxWidth: 420 }} />
            )}
            {testStatus === 'success' && (
              <Alert type="success" message="Testanruf erfolgreich gestartet" showIcon style={{ width: '100%', maxWidth: 420 }} />
            )}
            </Flex>
          </Flex>
        )}
        </div>
      </Form>
    </Modal>
  )
}
