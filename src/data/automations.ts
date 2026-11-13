export type AutomationStatus = 'live' | 'draft' | 'archived'

export type AutomationNodeType = 'start' | 'condition' | 'message' | 'action'

export type AutomationNode = {
  id: string
  type: AutomationNodeType
  position: { x: number; y: number }
  title: string
  lines: string[]
}

export type AutomationEdge = {
  id: string
  source: string
  target: string
}

export type Automation = {
  id: string
  name: string
  status: AutomationStatus
  versionMajor: number
  versionMinor: number
  configuration: string
  nodes: AutomationNode[]
  edges: AutomationEdge[]
  createdAt: string
  createdBy: string
}

export const automations: Automation[] = [
  {
    id: 'auto-1',
    name: 'Produktberatung',
    status: 'live',
    versionMajor: 4,
    versionMinor: 0,
    configuration: 'Default-Konfiguration',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        title: 'Start',
        lines: ['Eingehende Nachricht: #Hashtag', 'Kanaltyp: Whatsapp, Facebook', 'Kundenart: Neukunden, Privatkunden'],
      },
      {
        id: 'opt-in',
        type: 'condition',
        position: { x: 280, y: 0 },
        title: 'Opt-In einholen',
        lines: ['Opt-In abfrage stellen'],
      },
      {
        id: 'message',
        type: 'message',
        position: { x: 560, y: 0 },
        title: 'Nachricht schreiben',
        lines: ['Typ: Interactive Buttons', 'Antwort: Kein Interesse', 'Antwort: Neuer Termin', 'Antwort: Vertragsverlängerung'],
      },
      {
        id: 'case-close',
        type: 'action',
        position: { x: 900, y: -140 },
        title: 'Vorgang abschließen',
        lines: ['Kommentar: Kunde nicht interessiert'],
      },
      {
        id: 'case-create',
        type: 'action',
        position: { x: 900, y: 60 },
        title: 'Vorgang erstellen',
        lines: ['Team: Shop Berlin', 'Label: Vertragsverlängerung'],
      },
      {
        id: 'contact-edit',
        type: 'action',
        position: { x: 900, y: 220 },
        title: 'Kontakt bearbeiten',
        lines: ['Produkt: Internet'],
      },
    ],
    edges: [
      { id: 'e-start-optin', source: 'start', target: 'opt-in' },
      { id: 'e-optin-message', source: 'opt-in', target: 'message' },
      { id: 'e-message-close', source: 'message', target: 'case-close' },
      { id: 'e-message-create', source: 'message', target: 'case-create' },
      { id: 'e-message-contact', source: 'message', target: 'contact-edit' },
    ],
    createdAt: '07.03.2024',
    createdBy: 'Marc Lobinger',
  },
  {
    id: 'auto-2',
    name: 'Opt-In einholen',
    status: 'live',
    versionMajor: 2,
    versionMinor: 0,
    configuration: 'Default-Konfiguration',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        title: 'Start',
        lines: ['Eingehende Nachricht: beliebig', 'Kanaltyp: Whatsapp'],
      },
      {
        id: 'opt-in',
        type: 'condition',
        position: { x: 280, y: 0 },
        title: 'Opt-In einholen',
        lines: ['Opt-In abfrage stellen'],
      },
      {
        id: 'contact-edit',
        type: 'action',
        position: { x: 560, y: 0 },
        title: 'Kontakt bearbeiten',
        lines: ['Opt-In: Erteilt'],
      },
    ],
    edges: [
      { id: 'e-start-optin', source: 'start', target: 'opt-in' },
      { id: 'e-optin-contact', source: 'opt-in', target: 'contact-edit' },
    ],
    createdAt: '15.05.2024',
    createdBy: 'Nadja Berger',
  },
  {
    id: 'auto-3',
    name: 'Feedback nach Termin',
    status: 'draft',
    versionMajor: 0,
    versionMinor: 1,
    configuration: 'Default-Konfiguration',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        title: 'Start',
        lines: ['Ereignis: Termin abgeschlossen'],
      },
      {
        id: 'message',
        type: 'message',
        position: { x: 280, y: 0 },
        title: 'Nachricht schreiben',
        lines: ['Typ: Text', 'Bewertungslink senden'],
      },
    ],
    edges: [{ id: 'e-start-message', source: 'start', target: 'message' }],
    createdAt: '02.09.2024',
    createdBy: 'Marc Lobinger',
  },
]

export function getAutomationById(id: string): Automation | undefined {
  return automations.find(a => a.id === id)
}

export function filterAutomationsByStatus(list: Automation[], status: AutomationStatus): Automation[] {
  return list.filter(a => a.status === status)
}

export function createBlankAutomation(id: string): Automation {
  return {
    id,
    name: '',
    status: 'draft',
    versionMajor: 0,
    versionMinor: 1,
    configuration: 'Default-Konfiguration',
    nodes: [
      {
        id: 'start',
        type: 'start',
        position: { x: 0, y: 0 },
        title: 'Start',
        lines: ['Eingehende Nachricht: beliebig'],
      },
    ],
    edges: [],
    createdAt: new Date().toLocaleDateString('de-DE'),
    createdBy: 'Marc Lobinger',
  }
}
