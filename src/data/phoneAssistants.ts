export type PhoneAssistantStatus = 'active' | 'inactive'
export type Addressing = 'du' | 'sie'

export type Capability =
  | 'appointment-booking'
  | 'contact-forwarding'
  | 'inquiry-collection'
  | 'opt-in-collection'

export type VoiceOption = {
  value: string
  name: string
  description: string
}

export type PhoneLineOption = {
  value: string
  phoneNumber: string
  team: string
}

export type WebsiteKnowledgeSource = {
  type: 'website'
  url: string
  status: 'pending' | 'crawling' | 'done'
}

export type DocumentKnowledgeSource = {
  type: 'document'
  name: string
  sizeKb: number
}

export type KnowledgeSource = WebsiteKnowledgeSource | DocumentKnowledgeSource

export type InternalProcessing = {
  createCaseEnabled: boolean
  createCaseAssignee?: string
  scheduleAppointmentEnabled: boolean
  scheduleAppointmentAssignee?: string
  createTaskEnabled: boolean
  createTaskAssignee?: string
}

export type PhoneAssistant = {
  id: string
  name: string
  status: PhoneAssistantStatus
  phoneNumber: string
  team: string
  answeredCalls: number
  voice: string
  language: string
  addressing: Addressing
  greetingMessage: string
  additionalPrompt?: string
  capabilities: Capability[]
  knowledgeSources: KnowledgeSource[]
  internalProcessing?: InternalProcessing
}

export const voiceOptions: VoiceOption[] = [
  { value: 'sophie', name: 'Sophie', description: 'Freundlich, Warm, bestimmt' },
  { value: 'lukas', name: 'Lukas', description: 'Ruhig, Professionell, klar' },
  { value: 'emma', name: 'Emma', description: 'Neutral, Sachlich, präzise' },
  { value: 'jonas', name: 'Jonas', description: 'Dynamisch, Engagiert, direkt' },
]

export const capabilityOptions: { value: Capability; label: string }[] = [
  { value: 'appointment-booking', label: 'Terminbuchung' },
  { value: 'contact-forwarding', label: 'Kontaktweitergabe' },
  { value: 'inquiry-collection', label: 'Abfrage des Anliegens' },
  { value: 'opt-in-collection', label: 'Einholen des Opt-Ins' },
]

export const phoneLineOptions: PhoneLineOption[] = [
  { value: 'ks-1', phoneNumber: '+49 89 12345678', team: 'Kundenservice' },
  { value: 'ks-2', phoneNumber: '+49 89 99887766', team: 'Kundenservice' },
  { value: 'tv-1', phoneNumber: '+49 89 87654321', team: 'Terminvereinbarung' },
  { value: 'vt-1', phoneNumber: '+49 89 11223344', team: 'Vertrieb' },
  { value: 'ts-1', phoneNumber: '+49 89 55667788', team: 'Technischer Support' },
]

export const phoneLineGroups = phoneLineOptions.reduce<Record<string, PhoneLineOption[]>>((groups, option) => {
  if (!groups[option.team]) groups[option.team] = []
  groups[option.team].push(option)
  return groups
}, {})

export const languageOptions = [
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'Englisch' },
  { value: 'fr', label: 'Französisch' },
  { value: 'it', label: 'Italienisch' },
]

export const teamOptions = [
  'Kundenservice',
  'Vertrieb',
  'Technischer Support',
  'Terminvereinbarung',
]

export function getVoiceByValue(value: string): VoiceOption | undefined {
  return voiceOptions.find(v => v.value === value)
}

export function getPhoneLineByValue(value: string): PhoneLineOption | undefined {
  return phoneLineOptions.find(p => p.value === value)
}

export function getPhoneLineValueForAssistant(assistant: PhoneAssistant): string | undefined {
  return phoneLineOptions.find(
    p => p.phoneNumber === assistant.phoneNumber && p.team === assistant.team,
  )?.value
}

export const phoneAssistants: PhoneAssistant[] = [
  {
    id: 'pa-1',
    name: 'Kundenservice Assistent',
    status: 'active',
    phoneNumber: '+49 89 12345678',
    team: 'Kundenservice',
    answeredCalls: 342,
    voice: 'Sophie',
    language: 'Deutsch',
    addressing: 'sie',
    greetingMessage: 'Guten Tag, hier ist der Kundenservice von oneDialog. Wie kann ich Ihnen helfen?',
    additionalPrompt: 'Beantworte Fragen zu Verträgen, Rechnungen und Tarifen. Leite komplexe Anliegen an einen Mitarbeiter weiter.',
    capabilities: ['inquiry-collection', 'contact-forwarding', 'opt-in-collection'],
    internalProcessing: {
      createCaseEnabled: true,
      createCaseAssignee: 'marc',
      scheduleAppointmentEnabled: false,
      createTaskEnabled: true,
      createTaskAssignee: 'nadja',
    },
    knowledgeSources: [
      { type: 'website', url: 'https://onedialog.de/faq', status: 'done' },
      { type: 'website', url: 'https://onedialog.de/tarife', status: 'done' },
      { type: 'document', name: 'Produktkatalog_2025.pdf', sizeKb: 2048 },
    ],
  },
  {
    id: 'pa-2',
    name: 'Termin-Assistent',
    status: 'active',
    phoneNumber: '+49 89 87654321',
    team: 'Terminvereinbarung',
    answeredCalls: 128,
    voice: 'Lukas',
    language: 'Deutsch',
    addressing: 'sie',
    greetingMessage: 'Willkommen beim Terminservice. Für welchen Termin möchten Sie sich anmelden?',
    capabilities: ['appointment-booking', 'inquiry-collection'],
    knowledgeSources: [
      { type: 'website', url: 'https://onedialog.de/termine', status: 'done' },
    ],
  },
  {
    id: 'pa-3',
    name: 'Vertriebs-Assistent',
    status: 'inactive',
    phoneNumber: '+49 89 11223344',
    team: 'Vertrieb',
    answeredCalls: 56,
    voice: 'Emma',
    language: 'Deutsch',
    addressing: 'sie',
    greetingMessage: 'Hallo, Sie erreichen den Vertrieb von oneDialog. Womit kann ich Ihnen weiterhelfen?',
    additionalPrompt: 'Qualifiziere Leads und biete passende Tarife an.',
    capabilities: ['inquiry-collection', 'contact-forwarding'],
    knowledgeSources: [
      { type: 'document', name: 'Vertriebsleitfaden.pdf', sizeKb: 1536 },
      { type: 'document', name: 'Preisliste_Q2.xlsx', sizeKb: 512 },
    ],
  },
  {
    id: 'pa-4',
    name: 'Tech Support Assistent',
    status: 'active',
    phoneNumber: '+49 89 55667788',
    team: 'Technischer Support',
    answeredCalls: 89,
    voice: 'Jonas',
    language: 'Deutsch',
    addressing: 'du',
    greetingMessage: 'Technischer Support oneDialog. Bitte beschreiben Sie Ihr technisches Anliegen.',
    capabilities: ['inquiry-collection'],
    knowledgeSources: [
      { type: 'website', url: 'https://onedialog.de/support', status: 'crawling' },
      { type: 'document', name: 'Troubleshooting_Guide.pdf', sizeKb: 3072 },
    ],
  },
  {
    id: 'pa-5',
    name: 'English Support Assistant',
    status: 'inactive',
    phoneNumber: '+49 89 99887766',
    team: 'Kundenservice',
    answeredCalls: 12,
    voice: 'Sophie',
    language: 'Englisch',
    addressing: 'sie',
    greetingMessage: 'Hello, you have reached oneDialog customer service. How may I help you today?',
    capabilities: [],
    knowledgeSources: [],
  },
]

export function getVoiceLabel(value: string): string {
  return getVoiceByValue(value)?.name ?? value
}

export function getLanguageLabel(value: string): string {
  return languageOptions.find(l => l.value === value)?.label ?? value
}
